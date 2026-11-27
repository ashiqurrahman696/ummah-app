import { getCookie, setCookie } from 'cookies-next';

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

const saveArFontSize = (fontSize: string) => {
    setCookie("arFontSize", fontSize);
}
const getArFontSize = () => {
    return Number(getCookie("arFontSize")) || 24;
}

const saveTrFontSize = (fontSize: string) => {
    setCookie("trFontSize", fontSize);
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
const saveTransliterationSettings = (value: string) => {
    setCookie("showTransliteration", value);
}

const getShowTransliteration = () => {
    return getCookie("showTransliteration") || "no";
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
    getTranslation,
    saveTransliterationSettings,
    getShowTransliteration
};