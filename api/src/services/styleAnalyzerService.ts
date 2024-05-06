import { StylesConfig, Colors } from '../types/StylesConfig';
import puppeteer from 'puppeteer';
import { getMetadata, extractNameFromUrl } from './metadataService';
import { getColors, getMostRepresentedColor } from './colorsService';
import { getLinkedinData } from './linkedinService';

const styleConfig = async (url: URL): Promise<StylesConfig> => {

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

    if(metaData.name) {
        socials.linkedin = await getLinkedinData(extractNameFromUrl(url.toString()));
        console.log('socials.linkedin done ✅');
    }
    
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

    // Return the styles config object


    // define primary and secondary buttons


    return {
        metaData,
        colors,
        socials
    } as StylesConfig;
}



export default styleConfig;