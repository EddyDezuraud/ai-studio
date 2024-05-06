import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';

import { Linkedin, Employee } from '../types/StylesConfig';
import { scrapeImages } from 'scrape-google-images';
import { getUserAgent } from '../helpers/utils';

const getClientLinkedinName = async (clientName: string): Promise<string> => {
    // search for the client name on linkedin with cheerio

    const query = `${clientName} site:linkedin.com`;
    const searchUrl = `https://www.google.com/search?q=${query}`;

    const response = await axios.get(searchUrl, {
        headers: {
            'User-Agent': getUserAgent()
        }
    });

    const $ = cheerio.load(response.data);
    const linkedinUrl = $('.LC20lb').first().text();

    // if several results, take the first one
    if (linkedinUrl.includes(' | ')) {
        return linkedinUrl.split(' | ')[0];
    }

    return linkedinUrl;
}


const crawlForLogo = async (companyName: string) => {

    const query = `${companyName} site:linkedin.com logo`;
    const options = {
        limit: 1,
        imgar: "s",
        imgData: true
    };

    const images = await scrapeImages(query, options);

    if (images.length > 0) {
        return images[0].imgData;
    }

    return '';
};

const getEmployeeList = async (companyName: string): Promise<Employee[]> => {
    const query = `${companyName}+site%3Alinkedin.com%2Fin`;
    const url = `https://duckduckgo.com/?q=${query}&va=g&t=ha&ia=web`;
    const classSelector = '.eVNpHGjtxRBq_gLOfGDr';


    const browser = await puppeteer.launch({
        // headless: false
    });    
    const page = await browser.newPage();
    await page.goto(url);

    const employees = await page.evaluate((classSelector) => {
        const elements = Array.from(document.querySelectorAll(classSelector));
        return elements.map(element => {
            const text = element.textContent;
            if(!text) return {name: '', position: '', url: null, photo: ''}; 
            const parts = text.split(' - ')
            const name = parts[0];
            const job = parts.length > 2 ? parts[1] : '';
            return {
                name: name,
                position: job,
                url: element.getAttribute('href'),
                photo: ''
            }
        }) as Employee[];
    }, classSelector);

    return employees;

}

const getLinkedinData = async (companyName: string): Promise<Linkedin> => {

    console.log('companyName', companyName);

    if(!companyName) return {url: '', logo: '', nbEmployees: 0, employees: []};

    const logo = await crawlForLogo(companyName);
    const employees = await getEmployeeList(companyName);

    return {
        url: '',
        logo: logo ? logo : '',
        nbEmployees: 0,
        employees
    }

};

export { getLinkedinData, getClientLinkedinName };