import puppeteer, {Page, ElementHandle} from 'puppeteer';
import tinycolor from 'tinycolor2';
import sharp from 'sharp';
import { PolynomialRegression } from 'ml-regression-polynomial';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';

const getUserAgent = () => {
  const agents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    ]

  const index = Math.floor(Math.random() * agents.length);
  return agents[index]
}

const imageUrl = (img: string, url: string): string => {

  if (img.startsWith('//')) {
    return `https:${img}`;
  }

  if (img.startsWith('/')) {
    const baseUrl = url.split('/').slice(0, 3).join('/');
    return `${baseUrl}${img}`;
  }

  return `${img}`;
};

const extractTagStyles = async (page: Page, tagName: string): Promise<CSSStyleDeclaration> => {
    await page.waitForSelector(tagName);

    const element = await page.$(tagName);

    if(!element) {
        throw new Error(`${tagName} element not found`);
    }

    const styles = await element?.evaluate((element) => {
        return getComputedStyle(element);
    });

    return styles;
}

const extractAllTagStyles = async (page: Page, tagName: string): Promise<CSSStyleDeclaration[]> => {
  await page.waitForSelector(tagName);

  const element: ElementHandle<Element>[] = await page.$$(tagName);

  if (!element || element.length === 0) {
    throw new Error(`${tagName} element not found`);
  }

  const styles: CSSStyleDeclaration[] = [];

  for (let i = 0; i < element.length; i++) {
    const style = await element[i].evaluate((element) => {
      return getComputedStyle(element);
    });

    styles.push(style);
  }

  return styles;
}

const extractMultipleTagStyles = async (page: Page, tagNames: string[]): Promise<CSSStyleDeclaration[]> => {
  const styles: CSSStyleDeclaration[] = [];

  for (let i = 0; i < tagNames.length; i++) {
    const styles = await extractAllTagStyles(page, tagNames[i]);
    styles.push(...styles);
  }

  return styles;
}

const isInternalLink = async (currentUrl: string, link: string): Promise<boolean> => {
    if(!link) {
        return false;
    }
    const currentHost = new URL(currentUrl).hostname;
    const linkHost = new URL(link).hostname;
    return currentHost === linkHost;
}

const validateUrl = (url: string) => {
  if(!url || typeof url !== 'string') {
    return 'Please provide a valid URL';
  }

  const urlPattern = new RegExp(/^(http|https):\/\/[^ "]+$/);
  if(!urlPattern.test(url)) {
    return 'Invalid URL';
  }

  return null;
}


const launchBrowserAndOpenPage = async (url: string) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
  
    await page.goto(url);
  
    return page;
}


function isWhiteOrNearWhite(color: string): boolean {
  const rgb = tinycolor(color).toRgb();

  const luminosity = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminosity > 0.9;
}

async function getBackgroundFromParents(page: Page, element: ElementHandle): Promise<string> {
  let parentElement: any = element;
  while (parentElement) {
      const parentStyles = await parentElement?.evaluate((element: HTMLElement) => getComputedStyle(element));
      if (parentStyles.background !== 'transparent' && parentStyles.background !== 'none') {
          return parentStyles.background;
      }
      if (parentStyles.backgroundColor !== 'transparent' || parentStyles.backgroundImage !== 'none') {
          return parentStyles.backgroundColor || parentStyles.backgroundImage;
      }
      
      parentElement = await parentElement.evaluateHandle((element: HTMLElement) => {
        return element.parentElement;
      }, parentElement);
  }
  return '';
};


const isPhoto = async (imgSrc: string) => {
  // analyser si l'image est une photo ou non en se basant sur le contenu de l'image nombre de couleurs, etc.
  try {

    let imgBuffer = Buffer.from(imgSrc, 'base64');

    if (imgSrc.startsWith('data:image')) {
      const uri = imgSrc.split(';base64,').pop();

      if (!uri) {
        throw new Error('Invalid base64 image');
      }
  
      imgBuffer = Buffer.from(uri, 'base64');
    } else {
      // check if the image is supported image format
      const supportedFormats = ['jpeg', 'webp', '.jpg'];
      const format = imgSrc.split('.').pop();
      if (!format || !supportedFormats.includes(format)) {
        console.error('Unsupported image format');
        return false;
      }
    }

    const { data, info } = await sharp(imgBuffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    const uniqueColorsRow = new Set();
    const uniqueColorsColumn = new Set();

    for (let i = 0; i < width * 4; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      uniqueColorsRow.add(`${r},${g},${b}`);
    }

    for (let i = 0; i < height * width * 4; i += width * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      uniqueColorsColumn.add(`${r},${g},${b}`);
    }

    const limitColors = 50;

    if (uniqueColorsRow.size < limitColors && uniqueColorsColumn.size < limitColors) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(imgSrc, err);
    throw err;
  }
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const analyser = (nbToPredict: number, data: { width: { value: number; nb: number }[] }) => {
  const x = data.width.map((d) => d.value);
  const y = data.width.map((d) => d.nb);

  const regression = new PolynomialRegression(x, y, 3, { interceptAtZero: true });

  const predictedValue = regression.predict(nbToPredict);
  const maxValue = Math.max(...y);

  const percentage = (predictedValue / maxValue) * 100;

  return percentage;
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    // Convert RGB values from 0-255 range to 0-1 range
    r /= 255;
    g /= 255;
    b /= 255;
  
    // Find the maximum and minimum values among R, G, and B
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
  
    // Calculate the Luminance (l) value
    let l = (max + min) / 2;
  
    // Initialize Hue (h) and Saturation (s) values
    let h = 0;
    let s = 0;
  
    // Calculate Saturation (s) value
    if (max !== min) {
      const delta = max - min;
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  
      // Calculate Hue (h) value
      switch (max) {
        case r:
          h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
  
      h /= 6;
    }
  
    // Convert Hue (h), Saturation (s), and Luminance (l) values to ranges
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return [h, s, l];
};
const rgbToHex = (r: number, g: number, b: number) => {
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        throw new Error("Les valeurs RGB doivent être comprises entre 0 et 255.");
    }

    const toHex = (value: number): string => {
        const hex = value.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);

    const hexColor = `#${hexR}${hexG}${hexB}`;

    return hexColor;
};

const hslToRgb = (h: number, s: number, l: number) => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Couleur achromatique
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const hslToHex = (h: number, s: number, l: number) => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

const rgbStringToRgbArray = (rgbString: string): number[] => {
  return rgbString.replace('rgb(', '').replace(')', '').split(',').map(Number);
};

const getImageData = async (imgSrc: string): Promise<{ metadata: sharp.Metadata, imgBuffer: Buffer }> => {
  try {
    let imgBuffer = Buffer.from(imgSrc, 'base64');

    // deal with url images and base64 images
    if (imgSrc.startsWith('http')) {
      const response = await fetch(imgSrc);
      const buffer = await response.arrayBuffer();
      imgBuffer = Buffer.from(buffer);
    } else if (imgSrc.startsWith('data:image')) {
      const uri = imgSrc.split(';base64,').pop();
      if (!uri) {
        throw new Error('Invalid base64 image');
      }
      imgBuffer = Buffer.from(uri, 'base64');
    }

    const metadata = await sharp(imgBuffer).metadata();

    return {metadata, imgBuffer}
    
  } catch (err) {
    console.error(imgSrc, err);
    throw err;
  }
};

const convertImgSrcToBase64 = async (imgSrc: string): Promise<string> => {
  try {
    const {metadata, imgBuffer} = await getImageData(imgSrc);

    return `data:image/${metadata.format};base64,${imgBuffer.toString('base64')}`;

  } catch (error) {
    throw new Error(`file ${imgSrc} no exist ❌`)
  }
};

export { 
  isInternalLink, 
  imageUrl,
  extractTagStyles, 
  extractMultipleTagStyles,
  validateUrl, 
  launchBrowserAndOpenPage, 
  isWhiteOrNearWhite, 
  getBackgroundFromParents,
  isPhoto,
  sleep,
  analyser,
  getUserAgent,
  rgbToHsl,
  hslToHex,
  rgbToHex,
  hslToRgb,
  rgbStringToRgbArray,
  convertImgSrcToBase64
};