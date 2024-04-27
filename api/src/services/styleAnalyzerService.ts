import { StylesConfig } from '../types/StylesConfig';

import { extractMultipleTagStyles } from '../helpers/utils';

const styleAnalyser = async (url: URL): Promise<StylesConfig> => {

    const computedButtons:CSSStyleDeclaration[] = extractMultipleTagStyles(["button","a"]); // Array of all buttons a div with class button

    // define primary and secondary buttons

    return {} as StylesConfig;
}



export default styleAnalyser;