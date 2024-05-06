import { Page } from 'puppeteer';
import Vibrant from 'node-vibrant';
import jimp from 'jimp';


const filterSameColors = (colors: [string, number][], mainColor: string): [string, number][] => {

    const [mainR, mainG, mainB] = mainColor.split(',').map(Number);

    const filteredColors = colors.filter(([colorString]) => {
        const [r, g, b] = colorString.split(',').map(Number);

        // s'il s'agit de la main couleur, la garder
        if (colorString === mainColor) {
            return true;
        }

        // Vérifier si la couleur est proche de la couleur principale
        const isNotNearMainColor = Math.abs(r - mainR) > 10 || Math.abs(g - mainG) > 10 || Math.abs(b - mainB) > 10;
        
        return isNotNearMainColor;
    });

    return filteredColors;

}

/**
 * Récupère les 5 couleurs les plus représentées dans une image (hors blanc et transparent)
 * @param base64Image - L'image en base64
 * @returns Un objet contenant les informations sur les 5 couleurs les plus représentées
 */
const getMostRepresentedColor = async (base64Image: string): Promise<string[]> => {

    const colors: string[] = [];

    // check if the image is a base64 image
    if (!base64Image.startsWith('data:image/')) {

        // console log des premiers caractères de l'image
        console.log('base64Image', base64Image.slice(0, 50));

      return colors;
    }

    const image = await jimp.read(Buffer.from(base64Image.split(',')[1], 'base64'));

    // Redimensionner l'image à 40x40
    const resizedImage = image.resize(200, 200);
  
    // Obtenir les pixels de l'image redimensionnée
    const pixels = new Uint8ClampedArray(resizedImage.bitmap.data);
  
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

      // Définir une plage pour les couleurs proches du blanc
      const isNearWhite = r >= 239 && g >= 239 && b >= 239;
      if (isNearWhite) {
        continue;
      }
  
      const color = `rgb(${r}, ${g}, ${b})`;
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }
  
    const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

    const colorsW1 = filterSameColors(sortedColors, sortedColors[0][0]);
    const colorsW2 = filterSameColors(colorsW1, colorsW1[1][0]);
    const colorsW3 = filterSameColors(colorsW2, colorsW2[2][0]);

    for (let i = 0; i < 3 && i < colorsW3.length; i++) {
        const [colorString] = colorsW3[i];
        const hexColor = colorString.replace(/rgb\((\d+), (\d+), (\d+)\)/, (_, r, g, b) =>
            `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`
        );

        colors.push(hexColor);
    }

    return colors;
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