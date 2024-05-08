import { Image } from '../types/StylesConfig';
import { scrapeImages } from 'scrape-google-images';

const searchTermsList = (lang: string):string => {
    if(lang === 'fr') {

        const terms = ['siege+social', 'photos+équipe', 'photos+entreprise']

        return terms[Math.floor(Math.random() * terms.length)];
    } else {
        const terms = ['office+pictures', 'team+photos', 'company+photos']
        return terms[Math.floor(Math.random() * terms.length)];
    }
}

const getImages = async (name: string, lang: string): Promise<Image[]> => {
    
    const terms = searchTermsList(lang);

    const query = `${name}+${terms}`;

    const options = {
        limit: 5,
        imgData: false,
        metadata: false
    };

    const images = await scrapeImages(query, options)

    const dataToRet = images.map(image => ({ 
            src: image.src,
            alt: image.description,
            source: image.source
        })
    );

    return dataToRet
};

export { getImages };