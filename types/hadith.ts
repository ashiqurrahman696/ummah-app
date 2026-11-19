export interface Collections {
    key: string,
    name: string,
    arabic_name: string,
    author: string,
    total_hadiths: number,
}

export interface Hadith {
    id: string,
    collection: string,
    collection_name: string,
    hadithnumber: number,
    arabic: string,
    english: string,
    grade: string,
}

export interface Search {
    query: string,
    collection: string,
    limit: number,
    total_found: number,
    hadiths: Hadith[]
}