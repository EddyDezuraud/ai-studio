import { Page } from 'puppeteer';
import Vibrant from 'node-vibrant';
import { Colors } from '../types/StylesConfig';

const getColors = async (page: Page): Promise<Colors> => {

    const list = [];

    const images = await page.$$('img');
    for (const image of images) {
        await page.evaluate((image) => {
            image.style.opacity = '0!important';
        }, image);
    }
    
    const screenshot = await page.screenshot({fullPage: true});

    const palette = await Vibrant.from(screenshot).getPalette();

    if (palette !== null) {
        // push list Object.keys(palette).map((color) => palette[color]?.hex || '');
        for (const color in palette) {
            list.push(palette[color]?.hex || '');
        }
    }

    return {
        primary: list[0] || '',
        secondary: list[1] || '',
        list: list
    };
}


export { getColors };