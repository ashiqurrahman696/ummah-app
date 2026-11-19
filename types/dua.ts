export interface Categories {
    id: string,
    name: string,
    description: string,
    count: number,
}

export interface Dua {
    id: number,
    category: string,
    title: string,
    arabic: string,
    translation: string,
    source: string,
    repeat: number,
    reference: string,
}

export interface Duas{
    category: {
        id: string,
        name: string,
        description: string,
    }
    total: number,
    duas: Dua[]
}