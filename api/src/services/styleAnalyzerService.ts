import { StylesConfig, Colors } from '../types/StylesConfig';
import puppeteer from 'puppeteer';
import { getMetadata } from './metadataService';
import { getColors, getMostRepresentedColor } from './colorsService';
import { getLinkedinData } from './linkedinService';
import { getImages } from './imagesService';

const styleConfig = async (url: URL, lang: string): Promise<StylesConfig> => {

    const time = Date.now();

    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();
    await page.goto(url.toString());

    //1. Extract metadata
    const metaData = await getMetadata(page, url.toString());
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
    console.log('logoColors done ✅');

    if(logoColors && logoColors.length > 0) {
        colors.primary = logoColors[0];
        // push the logoColors.list to the top of the list
        colors.list = [...logoColors, ...colors.list];
        colors.logo = logoColors.map(color => ({hex: color, description: 'logo'}));
    }
    colors.list = colors.list.splice(0, 5);


    //9. Extract images
    const images = await getImages(metaData.name, lang);

    // Return the styles config object


    // define primary and secondary buttons

    // console log time spent
    const timeSpent = Date.now() - time;
    console.log(`Results in : ${timeSpent}ms`);


    return {
        metaData,
        colors,
        socials,
        images
    } as StylesConfig;
}



export default styleConfig;