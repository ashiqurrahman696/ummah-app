export interface Audio {
    reciter_id: number,
    reciter: string,
    surah_audio: string,
    ayah_audio: string
}

export interface Surahs {
    number: number,
    name_arabic: string,
    name_english: string,
    name_translation: string,
    revelation_place: string,
    revelation_order: number,
    verses_count: number
}

export interface Ayah {
    surah: {
        number: number,
        name_arabic: string,
        name_english: string,
    },
    verse: {
        verse_key: string,
        ayah: number,
        arabic: string,
        translations: {
            sahih_international: string
        }
    }
    audio: Audio[]
}

export interface Tafsir {
    name: string,
    author: string,
    text: string,
}