export interface Name {
    id: number,
    name: string,
    arabic: string,
    gender: string,
    meaning: string,
    origin: string,
    root: string,
    note: string,
}

export interface Names {
    total: number,
    page: number,
    limit: number,
    total_pages: number,
    names: Name[]
}