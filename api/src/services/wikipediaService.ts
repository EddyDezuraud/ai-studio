import { Wikipedia } from "../types/StylesConfig";
import { convertImgSrcToBase64 } from "../helpers/utils";

const getWikipediaPageUrl = async (search: string) => {
    const searchUri = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${search}&limit=1&namespace=0&format=json`;

    // fetch the search results
    const response = await fetch(searchUri);

    // parse the response
    const searchResults = await response.json();

    // get the search result
    if(searchResults.length > 0 && searchResults[0].length > 0) {
        return searchResults[0][2];
    }

    return '';
}


const getWikipediaPageName = async (search: string) => {
    const searchUri = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${search.toLocaleLowerCase()}&limit=1&namespace=0&format=json`;

    // fetch the search results
    const response = await fetch(searchUri);

    // parse the response
    const searchResults = await response.json();

    // get the search result
    if(searchResults.length > 0 && searchResults[0].length > 0) {
        return searchResults[1][0];
    }

    return '';

}

const getLogo = async (companyName: string) => {

    const pageName = await getWikipediaPageName(companyName);

    if(pageName === '') {
        return '';
    }

    const uri = `https://en.wikipedia.org/api/rest_v1/page/media-list/${pageName}`;

    const response = await fetch(uri);
    
    const mediaList = await response.json();

    if(mediaList.items.length > 0 && mediaList.items[0].srcset && mediaList.items[0].srcset.length > 0) {
        const logoSrc = mediaList.items[0].srcset[0].src;
        return await convertImgSrcToBase64('https:'+logoSrc);
    }
    return '';
}

const getWikipediaMetadata = async (search: string): Promise<Wikipedia> => {
    return {
        logo: await getLogo(search),
        url: await getWikipediaPageUrl(search)
    }
}

export { getWikipediaMetadata, getWikipediaPageUrl, getWikipediaPageName, getLogo };