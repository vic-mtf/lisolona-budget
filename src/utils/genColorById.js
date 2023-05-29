export default function getHueColorById (_id= '') {
    const id = _id.toString(16);
    const len = id?.length;
    const middle = Math.round(len / 2);
    let red = id.slice(0, 2).split('').reverse().join('');
    let green = id.slice(middle - 1, middle + 1);
    let blue = id.slice(-2).split('').reverse().join('');
    red = parseInt(red, 16);
    green = parseInt(green, 16);
    blue = parseInt(blue, 16);
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const d = (max - min) / 255;
    const lighness = (max + min) / (2 * 255)
    const saturation = lighness > 0 ? (d / (1 - Math.abs(2 * lighness - 1 ))) : 0;
    let angle = Math.acos(
            (red - (green / 2) - (blue / 2)) / 
        Math.sqrt(
            red ** 2 + green ** 2 + blue ** 2 - 
            (red * green) - (red * blue) - (green * blue))
    );
    angle = green >= blue ? angle : 360 - angle;
    return {
        hsl : {h: angle, s: saturation, l: lighness},
        rgb: {r: red, g: green, b: blue}
    };
}

export function generateColorsFromId(id, theme) {
    // Convertir l'id en un nombre hexadécimal
    const num = parseInt(id.substr(-6), 16);
  
    // Définir un niveau de luminosité pour les couleurs en fonction du thème
    let lightness;
    if (theme === 'light') {
      lightness = 70;
    } else {
      lightness = 30;
    }
  
    // Générer une couleur claire
    const colorLight = `hsl(${num % 360}, 100%, ${lightness}%)`;
  
    // Générer une couleur plus foncée pour le texte
    const colorDark = `hsl(${num % 360}, 100%, ${lightness - 30}%)`;
  
    // Retourner un objet avec les deux couleurs
    return {
      background: colorLight,
      text: colorDark
    };
  }
  