import * as cheerio from 'cheerio';
import axios from 'axios';
import puppeteer from 'puppeteer';

import { Linkedin, Employee } from '../types/StylesConfig';
import { getUserAgent, convertImgSrcToBase64 } from '../helpers/utils';

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

const crawlForLogo = async (companyName: string): Promise<{logo: string, linkedinUrl: string}> => {

    const url = `https://www.bing.com/images/search?q=${companyName}+logo+site%3Alinkedin.com&qs=n&form=QBIR&qft=+filterui%3Aimagesize-custom_200_200&sp=-1&lq=0&pq=${companyName}+logo+site%3Alinkedin.com`
    

    const response = await axios.get(url, {
        headers: {
            'User-Agent': getUserAgent()
        }
    });

    const $ = cheerio.load(response.data);

    const logoJson = $('.iusc').first().attr('m');
    if(logoJson) {
        const logo = JSON.parse(logoJson);
        const logoUrl = logo.murl;
        const logo64 = await convertImgSrcToBase64(logoUrl);
        return {logo: logo64, linkedinUrl: logo.purl};
    } 

    // if no img
    const imgSelector = '.mimg'
    const logo = $(imgSelector).first().attr('src');

    if(logo) {
        const logo64 = await convertImgSrcToBase64(logo);
        return {logo: logo64, linkedinUrl: ''};
    }

    return {logo: '', linkedinUrl: ''};
};

const getEmployeeList = async (companyName: string): Promise<Employee[]> => {
    const formattedCompanyName = companyName.replace(/ /g, '+').replace('&', '%26');

    const query = `${formattedCompanyName}+site%3Alinkedin.com%2Fin`;
    const url = `https://duckduckgo.com/?q=${query}&va=g&t=ha&ia=web`;

    const classSelector = '.eVNpHGjtxRBq_gLOfGDr';


    const browser = await puppeteer.launch({
        // headless: false
    });    
    const page = await browser.newPage();
    await page.goto(url);
    // add console log availabile in page.evaluate
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // console.log page status
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


    // if employees is empty, search on bing
    if(employees.length === 0) {

        console.log('searching on bing');
        const bingUrl = `https://www.bing.com/search?q=${formattedCompanyName}+site%3Alinkedin.com%2Fin`;
        const bingSelector = '.b_algo h2 a';

        await page.goto(bingUrl);
        const bingEmployees = await page.evaluate((bingSelector) => {
            const elements = Array.from(document.querySelectorAll(bingSelector));
            return elements.map(element => {
                const text = element.textContent;
                if (!text) return { name: '', position: '', url: null, photo: '' };
                // split on ' - ' & ' | ' to get name and job
                const parts = text.split(' - ');
                parts[parts.length - 1] = parts[parts.length - 1].split(' | ')[0];
                const name = parts[0];
                const job = parts.length > 1 ? parts[1] : '';
                return {
                    name: name,
                    position: job,
                    url: element.getAttribute('href'),
                    photo: ''
                }
            }) as Employee[];
        }, bingSelector);

        employees.push(...bingEmployees);
    }


    return employees;

}

const getLinkedinData = async (companyName: string): Promise<Linkedin> => {

    if(!companyName) return {url: '', logo: '', nbEmployees: 0, employees: []};

    const {logo, linkedinUrl} = await crawlForLogo(companyName);
    const employees = await getEmployeeList(companyName);

    return {
        url: linkedinUrl,
        logo: logo ? logo : '',
        nbEmployees: 0,
        employees
    }

};

export { getLinkedinData, getClientLinkedinName };