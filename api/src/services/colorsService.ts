import { Page } from 'puppeteer';
import Vibrant from 'node-vibrant';
import jimp from 'jimp';
import { rgbToHsl, hslToRgb, rgbToHex, rgbStringToRgbArray } from '../helpers/utils';

const rgbStringToHex = (rgb: string): string => {
    if(!rgb) return rgb;
    const [r, g, b] = rgbStringToRgbArray(rgb);
    return rgbToHex(r, g, b);
};

const getColorIntensity = (r: number, g: number, b: number): number => {
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return 1 - (luminance / 255);
}

const filterSameColors = (colors: string[], mainColor: string): {main: string, colors: string[]} => { 
    const [mainR, mainG, mainB] = rgbStringToRgbArray(mainColor);
    const mainHsl = rgbToHsl(mainR, mainG, mainB);
    const threshold = 15;

    // list of close hue colors from the main color
    const closeHueColors = colors.filter((color) => {
        // check if the hue is close to the main color hue

        const [r, g, b] = rgbStringToRgbArray(color);
        const hsl = rgbToHsl(r, g, b);

        return Math.abs(hsl[0] - mainHsl[0]) < threshold;
    });

    // remove close hue colors from the list
    const filteredColors = colors.filter((color) => !closeHueColors.includes(color));

    const sortedCloseHueColors = closeHueColors.sort((a, b) => {
        // convert to hsl to sort by saturation
        const [r1, g1, b1] = rgbStringToRgbArray(a[0]);
        const [r2, g2, b2] = rgbStringToRgbArray(b[0]);

        return getColorIntensity(r2, g2, b2) - getColorIntensity(r1, g1, b1);
    });
    
    const main = sortedCloseHueColors[0];

    return { main, colors: filteredColors };
}

/**
 * Récupère les 5 couleurs les plus représentées dans une image (hors blanc et transparent)
 * @param base64Image - L'image en base64
 * @returns Un objet contenant les informations sur les 5 couleurs les plus représentées
 */
const getMostRepresentedColor = async (base64Image: string): Promise<string[]> => {

    if(!base64Image) {
        console.error('No image provided');
        return new Array(3).fill('');
    }

    const image = await jimp.read(Buffer.from(base64Image.split(',')[1], 'base64'));

    // Obtenir les pixels de l'image redimensionnée
    const pixels = new Uint8ClampedArray(image.bitmap.data);
  
    const colorCounts: { [color: string]: number } = {};
  
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
  
      // Ignorer les pixels blancs ou transparents
      if ((r === 255 && g === 255 && b === 255) || a === 0) {
        continue;
      }

      const maxLum = 700;

      // Définir une plage pour les couleurs proches du blanc
      const isNearWhite = (r + g + b) > maxLum;
      if (isNearWhite) {
        continue;
      }
  
      const color = `rgb(${r}, ${g}, ${b})`;
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
  
    const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

    // delete colors that are < 5% of the total
    const threshold = sortedColors.length * 0.05;
    const filteredColors = sortedColors.filter(([_, count]) => count > threshold);

    const colorsToKeep = filteredColors.map(([color]) => color);

    const { main: main1, colors: colorsW1 } = filterSameColors(colorsToKeep, colorsToKeep[0]);
    const { main: main2, colors: colorsW2 } = filterSameColors(colorsW1, colorsW1[1]);
    const { main: main3 } = filterSameColors(colorsW2, colorsW2[2]);

    return [rgbStringToHex(main1), rgbStringToHex(main2), rgbStringToHex(main3)];
}; 


const getColors = async (page: Page): Promise<string[]> => {

    const list = [];

    const images = await page.$$('img');
    for (const image of images) {
        await page.evaluate((image) => {
            image.style.opacity = '0!important';
        }, image);
    }
    
    const screenshot = await page.screenshot({fullPage: true});

    const palette = await Vibrant.from(screenshot).getPalette();

    if (palette !== null) {
        for (const color in palette) {
            list.push(palette[color]?.hex || '');
        }
    }

    return list;
}


export { getColors, getMostRepresentedColor };