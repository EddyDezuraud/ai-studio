import { PolynomialRegression } from 'ml-regression-polynomial';
import data, {Data} from '../../_data/elements/buttonPrimary';

const analyser = (nbToPredict: number) => {
    const x = data.width.map((d) => d.value);
    const y = data.width.map((d) => d.nb);
    
    const regression = new PolynomialRegression(x, y, 3, {interceptAtZero: true});
    
    return regression.predict(nbToPredict);
}

export default analyser;