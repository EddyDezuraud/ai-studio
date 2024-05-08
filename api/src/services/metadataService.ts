import { Page } from 'puppeteer';
import { Metadata, Logo, Socials } from '../types/StylesConfig';
import { imageUrl } from '../helpers/utils';
import { getLinkedinData, getClientLinkedinName } from './linkedinService';

const extractNameFromUrl = (url: string): string => {
    let cleanedUrl = url.replace(/^https?:\/\/(?:www\.)?/, '');
    cleanedUrl = cleanedUrl.replace(/\/?[a-z]+\/*$/, '');
    const urlParts = cleanedUrl.split('.');
    return urlParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const rateLogo = (src: string, alt: string, url: string, index: number): number => {

    let rate = 0;

    if (src.toLowerCase().includes('logo')) {
        rate += 33;
    }

    if (alt.toLowerCase().includes('logo')) {
        rate += 33;
    }

    if (alt.toLowerCase().includes('home') || alt.toLowerCase().includes('accueil')) {
        rate += 33;
    }

    //if end by png or svg +33
    if (src.endsWith('.png')) {
        rate += 20;
    }

    if (src.endsWith('.svg')) {
        rate += 33;
    }

    // check if alt text is the same as the website name
    const name = extractNameFromUrl(url);
    if (alt.toLowerCase().includes(name)) {
        rate += 33;
    }

    // if the alt text contains less than 25 characters +33
    if (alt.length < 25) {
        rate += 33;
    }

    // if the src url after .xx/ contains name +33
    const urlParts = url.split('.');
    const domain = urlParts[urlParts.length - 1];
    if (src.toLowerCase().includes(domain.toLowerCase())) {
        rate += 33;
    } 

    // if index is 0 +33, if index is 1 +20, if index is 2 +10, if index is 3 +5
    if (index === 0) {
        rate += 33;
    } else if (index === 1) {
        rate += 20;
    } else if (index === 2) {
        rate += 10;
    } else if (index === 3) {
        rate += 5;
    }

    return rate;
};

const extractClientLogo = async (page: Page, url: string):Promise<Logo[]> => { 
    let potentialLogos:Logo[] = []; 

    const ogLogo = await page.evaluate(() => {
        const ogImageMeta = document.querySelector('meta[property="og:image"]');
        return ogImageMeta ? ogImageMeta.getAttribute('content') : null;
    });

    if (ogLogo) {
        potentialLogos.push({
            rate: 33,
            src: imageUrl(ogLogo, url),
            alt: "og:image",
            type: 'img'
        });
    }

    const svgTags = await page.evaluate(() => {
        const svgElements = Array.from(document.querySelectorAll('a[rel="home"] svg, a[href="/"] svg, a[class*="logo"] svg, a[id*="logo"] svg, a[title*="logo"] svg, a[title*="accueil"] svg, a[title*="home"] svg'));

        return svgElements.map((value: Element, index: number, array: Element[]) => {
            const element = value as HTMLOrSVGImageElement;
            return {
                rate: 200,
                src: element.outerHTML,
                alt: "",
                type: 'svg'
            }
        });
    }) as Logo[];

    // find img tags with src tag string containing "logo"
    const imgTags = await page.evaluate(() => {
        const imgElements = Array.from(document.querySelectorAll('a[rel="home"] img, a[href="/"] img, a[class*="logo"] img, a[id*="logo"] img, a[title*="logo"] img'));

        return imgElements.map((value: Element, index: number, array: Element[]) => {
            const img = value as HTMLImageElement;
            return {
                rate: 0,
                src: img.src,
                alt: img.alt || "",
                type: 'img'
            }
        });
    }) as Logo[];

    [...svgTags, ...imgTags].forEach((img, index) => {
        if (img && img.src) {
            potentialLogos.push({
                rate: img.rate + rateLogo(img.src, img.alt, url, index),
                src: img.type === 'img' ? imageUrl(img.src, url) : img.src,
                alt: img.alt,
                type: img.type
            });
        }
    });

    if(potentialLogos.length === 0) {
        const imgTags = await page.evaluate(() => {
            const imgElements = Array.from(document.querySelectorAll('img'));
        
            return imgElements.map((value: Element, index: number, array: Element[]) => {
                const img = value as HTMLImageElement;
                return {
                    rate: 0,
                    src: img.src,
                    alt: img.alt || "",
                    type: 'img'
                }
            });
        });

        imgTags.forEach((img, index) => {
            if (img && img.src) {
                potentialLogos.push({
                    rate: img.rate + rateLogo(img.src, img.alt, url, index),
                    src: imageUrl(img.src, url),
                    alt: img.alt,
                    type: 'img'
                });
            }
        });
    }

    // sort potential logos by rate
    potentialLogos = potentialLogos.sort((a, b) => b.rate - a.rate);

    // get the top 10 logos max
    potentialLogos = potentialLogos.slice(0, 10);

    return potentialLogos;
};




const extractClientName = async (page: Page, url: string):Promise<string> => {
    return await getClientLinkedinName(extractNameFromUrl(url));

    // let clientName = await page.evaluate(() => {
    //     const ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]');

    //     if(ogSiteNameMeta && ogSiteNameMeta.getAttribute('content')) {
    //         return ogSiteNameMeta.getAttribute('content');
    //     }

    //     const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    //     if(ogTitleMeta && ogTitleMeta.getAttribute('content')) {
    //         return ogTitleMeta.getAttribute('content');
    //     }

    //     // return the title
    //     return document.title;
    // });
  
    // if (!clientName) {
    //   clientName = extractNameFromUrl(url);
    // }

    // // check if domain is in the client name and pick only that part of the client name if it is
    // const domain = new URL(url).hostname.replace('www.', '');
    // const domainPattern = new RegExp(`(\\b${domain.split('.')[0]}\\b)`, 'i');
    // const match = clientName.toLowerCase().match(domainPattern);
    // if (match) {
    //     const matchedDomain = match[0];
    //     const startIndex = clientName.toLowerCase().indexOf(matchedDomain.toLowerCase());
    //     const endIndex = startIndex + matchedDomain.length;
    //     clientName = clientName.substring(startIndex, endIndex);
    // } else {
    //     const separators = [" - ", " | ", " : ", ": "];
    //     separators.forEach((separator) => {
    //         if (clientName && clientName.includes(separator)) {
    //             clientName = clientName.split(separator)[0].trim();
    //         }
    //     });
    // }
    
    
  
    // return clientName;
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

const getSocials = async (page: Page, name: string): Promise<Socials> => {

    const linkedin = await getLinkedinData(name);

    return {
        linkedin
    };
    
};

const getMetadata = async (page: Page, url: string, companyName: string): Promise<Metadata> => {

    const metadata: Metadata = {
        name: "",
        description: "",
        logos: [],
        favicon: "",
    };

    metadata.name = companyName ? companyName : await extractClientName(page, url); 
    metadata.description = await getDescription(page);
    metadata.logos = await extractClientLogo(page, url);
    metadata.favicon = await getFavicon(page);

    return metadata;
}

export { getMetadata, extractNameFromUrl };