import {SessionState} from "../types/Types.ts";

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // eslint-disable-next-line prefer-const
    let h = 0, s, l: number = (max + min) / 2;

    if (max === min) {
        s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hexToRgb(hex: string): [number, number, number] {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function mixColors(colors: string[], percentages: number[]): [number, number, number] {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < colors.length; i++) {
        const [ri, gi, bi] = hexToRgb(colors[i]);
        r += ri * percentages[i];
        g += gi * percentages[i];
        b += bi * percentages[i];
    }
    return [Math.round(r), Math.round(g), Math.round(b)];
}

function mixHexToHsl(colors: string[], percentages: number[]): [number, number, number] {
    const mixedRgb = mixColors(colors, percentages);
    return rgbToHsl(...mixedRgb);
}

const getHsl = (session: SessionState["session"]) => {
    const sum = session.user_score.development + session.user_score.creativity + session.user_score.marketing;
    if (sum === 0) return [0, 0, 100];
    const colors = ["#3959d0", "#f8ee83", "#b844f5"];
    const weights = [(session.user_score.development / sum), (session.user_score.creativity / sum), (session.user_score.marketing / sum)];
    return mixHexToHsl(colors, weights);
}

export {
    rgbToHsl,
    hexToRgb,
    rgbToHex,
    mixColors,
    mixHexToHsl,
    getHsl
}
