export interface Hadith {
    id: string,
    collection: string,
    collection_name: string,
    hadithnumber: number,
    arabic: string,
    english: string,
}

export interface Collection {
    collection: string,
    collection_name: string,
    page: number,
    limit: number,
    total: number,
    total_pages: number,
    hadiths: Hadith[],
}