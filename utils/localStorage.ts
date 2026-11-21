import { getCookie, getCookies, setCookie, deleteCookie, hasCookie } from 'cookies-next';

const saveReciterId = (id: string) => {
    setCookie("reciterId", id);
}

const getReciterId = () => {
    return Number(getCookie("reciterId")) || 1;
}

const saveTafsirKey = (id: string) => {
    setCookie("tafsirKey", id);
}

const getTafsirKey = () => {
    return getCookie("tafsirKey") || "ibn_kathir";
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

const saveTranslation = (id: string) => {
    setCookie("translation", id);
}

const getTranslation = () => {
    return getCookie("translation") || "sahih_international";
}

export {
    saveReciterId,
    getReciterId,
    saveArFontSize,
    getArFontSize,
    saveTrFontSize,
    getTrFontSize,
    saveTafsirKey,
    getTafsirKey,
    saveTranslation,
    getTranslation
};