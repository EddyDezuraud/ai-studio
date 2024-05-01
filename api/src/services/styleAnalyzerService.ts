import { StylesConfig } from '../types/StylesConfig';
import puppeteer, {Page, ElementHandle} from 'puppeteer';
import { extractMultipleTagStyles } from '../helpers/utils';
import { buttonsAnalyzer } from './buttonClassifierService'

const styleConfig = async (url: URL): Promise<StylesConfig> => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url.toString());


    const computedButtons:CSSStyleDeclaration[] = await extractMultipleTagStyles(page, ["button","a"]); // Array of all buttons a div with class button

    const buttons = buttonsAnalyzer(computedButtons);

    // define primary and secondary buttons
    
    

    return {} as StylesConfig;
}



export default styleConfig;