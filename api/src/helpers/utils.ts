import puppeteer, {Page, ElementHandle} from 'puppeteer';
import tinycolor from 'tinycolor2';
import sharp from 'sharp';
import { PolynomialRegression } from 'ml-regression-polynomial';

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
  analyser
};