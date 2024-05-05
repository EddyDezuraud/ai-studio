import { StylesConfig } from '../types/StylesConfig';
import puppeteer, {Page, ElementHandle} from 'puppeteer';
import { extractMultipleTagStyles } from '../helpers/utils';
import { buttonsAnalyzer } from './buttonClassifierService'
import { getMetadata } from './metadataService';
import { getColors } from './colorsService';
import { get } from 'axios';
import { getLinkedinData } from './linkedinService';

const styleConfig = async (url: URL): Promise<StylesConfig> => {

    const browser = await puppeteer.launch({
        // headless: false
    });
    const page = await browser.newPage();
    await page.goto(url.toString());

    //1. Extract metadata
    const metaData = await getMetadata(page, url.toString());

    //2. Extract main colors
    const colors = await getColors(page);

    //3. Extract body styles

    //4. Extract form styles
    // const computedButtons:CSSStyleDeclaration[] = await extractMultipleTagStyles(page, ["button","a"]); // Array of all buttons a div with class button
    // const buttons = buttonsAnalyzer(computedButtons);

    //5. Extract text styles

    //6. Extract block styles

    //7. extract socials
    await browser.close();

    const socials = {
        linkedin: await getLinkedinData((metaData as any).companyName)
    }


    // Return the styles config object


    // define primary and secondary buttons
    

    return {
        metaData,
        colors,
        socials
    } as StylesConfig;
}



export default styleConfig;