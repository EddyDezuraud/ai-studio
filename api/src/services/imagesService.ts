import { Image } from '../types/StylesConfig';
import { scrapeImages } from 'scrape-google-images';

const getImages = async (name: string): Promise<Image[]> => {

    const query = `${name}+office+pictures`;

    const options = {
        limit: 5
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