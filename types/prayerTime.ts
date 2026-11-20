export interface Method {
    key: string,
    name: string,
    description: string,
}

export interface PrayerTimes {
    date: string,
    timezone: string,
    prayer_times: {
        imsak: string,
        fajr: string,
        sunrise: string,
        dhuhr: string,
        asr: string,
        maghrib: string,
        isha: string
    },
    islamic_info: {
        prayer_names: {
            fajr: string,
            dhuhr: string,
            asr: string,
            maghrib: string,
            isha: string
        },
        note: string
    }
}

export interface Day extends PrayerTimes {
    date: string,
    day: number,
    day_name: string
}

export interface MonthlyPrayerTimes {
    timezone: string,
    month: number,
    year: number,
    month_name: string,
    days: Day[]
}

export interface RamadansInYear {
    hijri_year: number,
    ramadan_start: string
}

export interface RamadanDays {
    day: number,
    date: string,
    day_name: string,
    hijri_date: string,
    third: string,
    suhoor_ends: string,
    fajr: string,
    sunrise: string,
    dhuhr: string,
    asr: string,
    iftar: string,
    maghrib: string,
    isha: string,
}

export interface Ramadan {
    timezone: string,
    year: number,
    hijri_year: number,
    ramadans_in_year: RamadansInYear[],
    ramadan_days: number,
    ramadan_start: string,
    ramadan_end: string,
    total_days: number,
    days: RamadanDays[]
}