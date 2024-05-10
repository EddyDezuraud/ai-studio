import { Screenshots } from '../types/StylesConfig'
import puppeteer from "puppeteer-extra"
import stealth from "puppeteer-extra-plugin-stealth"

const getScreenshots = async (url: string): Promise<Screenshots> => {

    puppeteer.use(stealth())
    
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-sync",
            "--ignore-certificate-errors",
            "--lang=en-US,en;q=0.9",
        ]
    });

    const page = await browser.newPage();
    await page.goto(url);

    await page.setViewport({width:1920, height:1080});

    const desktopScreen = await page.screenshot({fullPage: true});
    const desktop = desktopScreen.toString('base64');

    await page.setViewport({width:375, height:812});
    
    const mobileScreen = await page.screenshot({fullPage: true});
    const mobile = mobileScreen.toString('base64');

    await browser.close();

    return {desktop, mobile}
    
}

export { getScreenshots }