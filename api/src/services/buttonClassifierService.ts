import data, {Data} from '../../_data/elements/buttonPrimary';
import { FormButtons } from '../types/StylesConfig';

const buttonsAnalyzer = (buttons: CSSStyleDeclaration[]): FormButtons => {
    
    
    const primaryButtons = {
        height: "",
        width: "",
        padding: "",
        borderRadius: "",
        background: "",
        border: "",
        color: "",
        fontSize: "",
        fontFamily: "",
        boxShadow: "",
        transition: "",
        classNames: [],
        content: "",
        htmlContent: ""
    };
    const secondaryButtons = {
        height: "",
        width: "",
        padding: "",
        borderRadius: "",
        background: "",
        border: "",
        color: "",
        fontSize: "",
        fontFamily: "",
        boxShadow: "",
        transition: "",
        classNames: [],
        content: "",
        htmlContent: ""
    };

    return {
        primary: primaryButtons,
        secondary: secondaryButtons
    }
};

export {buttonsAnalyzer};