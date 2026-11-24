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
            sahih_international: string,
            pickthall: string,
            yusuf_ali: string,
            urdu: string,
            turkish: string,
            indonesian: string,
            french: string,
            german: string,
            bengali: string,
            spanish: string,
            malay: string,
            bosnian: string,
        }
    }
    audio: Audio[]
}

export interface Tafsir {
    name: string,
    language: string,
    author: string,
    text: string,
}

export interface QuranSearch {
    verse_key: string,
    surah_number: number,
    surah_name: string,
    ayah: number,
    arabic: string,
    translation: string
}