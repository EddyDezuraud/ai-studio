import { Page } from 'puppeteer';
import { Metadata } from '../types/StylesConfig';

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
};

const extractNameFromUrl = (url: string): string => {
    let cleanedUrl = url.replace(/^https?:\/\/(?:www\.)?/, '');
    cleanedUrl = cleanedUrl.replace(/\/?[a-z]+\/*$/, '');
    const urlParts = cleanedUrl.split('.');
    return urlParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const extractClientName = async (page: Page, url: string):Promise<string> => {
    let clientName = await page.evaluate(() => {
      const ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]');
      return ogSiteNameMeta ? ogSiteNameMeta.getAttribute('content') : null;
    });
  
    if (!clientName) {
      clientName = extractNameFromUrl(url);
    }
  
    return clientName;
};

const getDescription = async (page: Page): Promise<string> => {
    return await page.evaluate(() => {
        const descriptionMeta = document.querySelector('meta[name="description"]');
        return descriptionMeta ? descriptionMeta.getAttribute('content') || "" : "";
    });
};

const getFavicon = async (page: Page): Promise<string> => {
    return await page.evaluate(() => {
        const faviconLink = document.querySelector('link[rel="icon"]');
        return faviconLink ? faviconLink.getAttribute('href') || "" : "";
    });
};

const getMetadata = async (page: Page, url: string): Promise<Metadata> => {

    const metadata: Metadata = {
        name: "",
        title: "",
        description: "",
        logos: [],
        favicon: ""
    };

    metadata.name = await extractClientName(page, url); 
    metadata.title = await page.title();
    metadata.description = await getDescription(page);
    metadata.logos = await extractClientLogo(page, url);
    metadata.favicon = await getFavicon(page);

    return metadata;
}

export { getMetadata };