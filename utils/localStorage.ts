import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

const saveReciterId = (id: string) => {
    setCookie("reciterId", id);
}

const getReciterId = () => {
    return Number(getCookie("reciterId")) || 1;
}

const saveArFontSize = (id: string) => {
    setCookie("arFontSize", id);
}
const getArFontSize = () => {
    return Number(getCookie("arFontSize")) || 24;
}

const saveTrFontSize = (id: string) => {
    setCookie("trFontSize", id);
}

const getTrFontSize = () => {
    return Number(getCookie("trFontSize")) || 20;
}

export {
    saveReciterId,
    getReciterId,
    saveArFontSize,
    getArFontSize,
    saveTrFontSize,
    getTrFontSize,
};