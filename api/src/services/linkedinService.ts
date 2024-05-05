import { Linkedin } from '../types/StylesConfig';
import { scrapeImages } from 'scrape-google-images';


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

const getLinkedinData = async (companyName: string): Promise<Linkedin> => {

    if(!companyName) return {url: '', logo: '', nbEmployees: 0};

    const logo = await crawlForLogo(companyName);

    return {
        url: '',
        logo: logo ? logo : '',
        nbEmployees: 0
    }


};

export { getLinkedinData };