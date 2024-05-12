import { Screenshots } from '../types/StylesConfig'
import puppeteer from "puppeteer-extra"
import { Page } from "puppeteer"
import stealth from "puppeteer-extra-plugin-stealth"

const cookieKeywords = ['accept', 'ok', 'valider', 'validate', 'agree', 'compris', 'comprendre', 'accepter'];

const acceptCookies = async (page: Page) => {
    // await page.waitForNavigation();
    await page.waitForSelector('body', { timeout: 60000 });

    // array of all buttons
    const buttons = await page.$$('button');

    // find the button that contains the keyword
    const acceptButton = buttons.find(async (button) => {
        const buttonText = await button.evaluate((node) => node.textContent);
        return cookieKeywords.some(keyword => buttonText?.toLowerCase().includes(keyword));
    });

    // click the button
    if(acceptButton) {

        // acceptButton classname
        const acceptButtonClass = await acceptButton.evaluate((node) => node.className);
        console.log('acceptButtonClass', acceptButtonClass);

        await page.waitForSelector('button', { timeout: 60000 });

        await acceptButton?.click();
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });
    }
  };

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
    await acceptCookies(page);

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