import puppeteer, {Page, ElementHandle} from 'puppeteer';
import tinycolor from 'tinycolor2';
import sharp from 'sharp';

import { Metadata } from "../types/StylesConfig";

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

const extractNameFromUrl = (url: string): string => {
    let cleanedUrl = url.replace(/^https?:\/\/(?:www\.)?/, '');
    cleanedUrl = cleanedUrl.replace(/\/?[a-z]+\/*$/, '');
    const urlParts = cleanedUrl.split('.');
    return urlParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

const launchBrowserAndOpenPage = async (url: string) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
  
    await page.goto(url);
  
    return page;
}

const extractClientName = async (page: Page, url: string) => {
    let clientName = await page.evaluate(() => {
      const ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]');
      return ogSiteNameMeta ? ogSiteNameMeta.getAttribute('content') : null;
    });
  
    if (!clientName) {
      clientName = extractNameFromUrl(url);
    }
  
    return clientName;
}

const extractClientLogo = async (page: Page, url: string):Promise<string[]> => { 
    let clientLogos: string[] = []; 
    
    // find favicon
    const favicon = await page.evaluate(() => {
      const faviconLink = document.querySelector('link[rel="icon"]');
      return faviconLink ? faviconLink.getAttribute('href') : null;
    });

    if (favicon) {
      clientLogos.push(favicon);
    }

    const ogLogo = await page.evaluate(() => {
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        return ogImageMeta ? ogImageMeta.getAttribute('content') : null;
    });

    if (ogLogo) {
        clientLogos.push(ogLogo);
    }

    // find img tags with src tag string containing "logo"
    const imgTags = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('img');
        return Array.from(imgElements).map((img) => img.src.toLowerCase().includes('logo') ? img.src : null);
    });

    imgTags.forEach((imgSrc) => {
        if (imgSrc) {
        clientLogos.push(imgSrc);
        }
    });


    return clientLogos;
}

// extract client return Client
const extractClient = async (page: Page, url: string): Promise<Metadata> => {
  const client = {} as Metadata;

  client.name = await extractClientName(page, url);
  client.logos = await extractClientLogo(page, url);

  return client;
}

function isWhiteOrNearWhite(color: string): boolean {
  const rgb = tinycolor(color).toRgb();

  const luminosity = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminosity > 0.9;
}

async function getBackgroundFromParents(page: Page, element: ElementHandle): Promise<string> {
  let parentElement = element;
  while (parentElement) {
      const parentStyles = await parentElement?.evaluate((element) => getComputedStyle(element));
      if (parentStyles.background !== 'transparent' && parentStyles.background !== 'none') {
          return parentStyles.background;
      }
      if (parentStyles.backgroundColor !== 'transparent' || parentStyles.backgroundImage !== 'none') {
          return parentStyles.backgroundColor || parentStyles.backgroundImage;
      }
      parentElement = await parentElement.evaluateHandle((element) => {
        return element.parentElement;
      }, parentElement);  }
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
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export { 
  isInternalLink, 
  extractTagStyles, 
  extractNameFromUrl, 
  validateUrl, 
  launchBrowserAndOpenPage, 
  extractClientName, 
  extractClient,
  isWhiteOrNearWhite, 
  getBackgroundFromParents,
  isPhoto,
  sleep
};