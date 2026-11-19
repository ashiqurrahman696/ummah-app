export interface Audio {
    reciter_id: number,
    reciter: string,
    surah_audio: string
}

export interface Verse {
    ayah: number,
    arabic: string,
    translation: string,
    audio: {
        ayah_audio: string
    }
}

export interface Surah {
    surah: {
        number: number,
        name_arabic: string,
        name_english: string,
        name_translation: string,
        revelation_place: string,
        revelation_order: number,
        verses_count: number,
    },
    audio: Audio[],
    verses: Verse[],
}

export interface Tafsir {
    name: string,
    author: string,
    text: string,
}