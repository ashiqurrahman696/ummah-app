export interface Months {
    number: number,
    name_english: string,
    name_arabic: string,
    significance: string,
}

export interface Event {
    month: number,
    day: number,
    name: string,
    description: string,
}

export interface Events {
    current_hijri_date: {
        gregorian: {
            formatted: string,
        },
        hijri: {
            formatted: string,
        },
    },
    next_event: {
        name: string,
        hijri_date: string,
    }
    events: Event[]
}