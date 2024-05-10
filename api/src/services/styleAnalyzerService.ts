import { StylesConfig, Colors } from '../types/StylesConfig';
import puppeteer from 'puppeteer';
import { getMetadata } from './metadataService';
import { getColors, getMostRepresentedColor } from './colorsService';
import { getLinkedinData } from './linkedinService';
import { getImages } from './imagesService';
import { getCompanyDescription, getWebsite } from './companyService';
import { getScreenshots } from './websiteService';

const styleConfig = async (query: string, mode:'url' | 'name', lang: string): Promise<StylesConfig> => {

    let website = '';
    let companyName = '';

    console.log('styleConfig', query, mode, lang);

    if(mode === 'name') {
        console.log('Check for website');
        companyName = query;
        const website = await getWebsite(query);
        if(website) {
            query = website;
        } else {
            throw new Error('No website found');
        }
        console.log('✅ website found');
    } else {
        website = query;
    }

    const time = Date.now();

    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();
    await page.goto(query);

    //1. Extract metadata
    const metaData = await getMetadata(page, query, companyName);
    console.log('metaData done ✅');

    //2. Extract main colors
    const colors: Colors = {
        primary: '',
        secondary: '',
        website: [],
        logo: [],
        list: []
    }
    const siteColors = await getColors(page);
    colors.website = siteColors.map(color => ({hex: color, description: 'website'}));
    colors.list = siteColors;
    console.log('siteColors done ✅');


    //3. Extract body styles

    //4. Extract form styles
    // const computedButtons:CSSStyleDeclaration[] = await extractMultipleTagStyles(page, ["button","a"]); // Array of all buttons a div with class button
    // const buttons = buttonsAnalyzer(computedButtons);

    //5. Extract text styles

    //6. Extract block styles

    //7. extract socials
    await browser.close();

    const socials = {
        linkedin: {logo: ''}
    }

    socials.linkedin = await getLinkedinData(metaData.name);
    console.log('socials.linkedin done ✅');
    
    //8. Extract logo colors
    const lnkImage = socials.linkedin?.logo;
    const logoColors = await getMostRepresentedColor(lnkImage);

    if(logoColors && logoColors.length > 0) {
        colors.primary = logoColors[0];
        // push the logoColors.list to the top of the list
        colors.list = [...logoColors, ...colors.list];
        colors.logo = logoColors.map(color => ({hex: color, description: 'logo'}));
    }
    colors.list = colors.list.splice(0, 5);
    console.log('logoColors done ✅');


    //9. Extract images
    const images = await getImages(metaData.name, lang);
    console.log('images done ✅');



    //10. Extract screenshots
    const screenshots = await getScreenshots(query);


    // define primary and secondary buttons

    // console log time spent
    const timeSpent = Date.now() - time;
    console.log(`Results in : ${timeSpent}ms`);

    // if(!metaData.description) {
    //     const companyDescription = await getCompanyDescription(metaData.name);

    //     if(companyDescription) {
    //         metaData.description = companyDescription;
    //     }
    //     const newTimeSpent = Date.now() - time;
    //     console.log('companyDescription done ✅', newTimeSpent);
    // }

    return {
        metaData,
        colors,
        socials,
        images,
        screenshots
    } as StylesConfig;
}



export default styleConfig;