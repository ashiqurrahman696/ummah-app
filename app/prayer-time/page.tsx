"use client";

import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { Day, Method, MonthlyPrayerTimes, PrayerTimes, Ramadan, RamadanDays, RamadansInYear } from "@/types/prayerTime";
import { formatTime12h } from "@/utils/format12h";
import { getHijriYear } from "@/utils/hijriYear";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const PrayerTimeContent = () => {
    const today = new Date();
    const [lat, setLat] = useState<number>(0);
    const [lng, setLng] = useState<number>(0);
    const [date, setDate] = useState<string>(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
    const [month, setMonth] = useState<number>(today.getMonth() + 1);
    const [year, setYear] = useState<number>(today.getFullYear());
    const [hijriYear, setHijriYear] = useState<number>(getHijriYear(today.getFullYear()) as number);
    const [method, setMethod] = useState<string>("MuslimWorldLeague");
    const [madhab, setMadhab] = useState<string>("Hanafi");
    const axios = useAxios();


    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            },
            (error) => console.error("Unable to get the current location.", error),
        );
    }, []);

    const {data: methods, isLoading: isMethodsLoading, isError: isMethodsError} = useQuery<Method[]>({
        queryKey: ["methods"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/prayer-times/methods`);
            return data.data.methods;
        }
    });

    const {data: prayerTimes, isLoading: isPrayerTimesLoading, isError: isPrayerTimesError} = useQuery<PrayerTimes>({
        queryKey: ["prayerTimes", lat, lng, date, method, madhab],
        queryFn: async() => {
            const {data} = await axios.get(`/api/prayer-times?lat=${lat}&lng=${lng}&date=${date}&method=${method}&madhab=${madhab}&highLatitudeRule=recommended`);
            return data.data;
        }
    });

    const {data: monthlyPrayerTimes, isLoading: isMonthlyPrayerTimesLoading, isError: isMonthlyPrayerTimesError} = useQuery<MonthlyPrayerTimes>({
        queryKey: ["monthlyPrayerTimes", lat, lng, month, year, method, madhab],
        queryFn: async() => {
            const {data} = await axios.get(`/api/prayer-times/month?lat=${lat}&lng=${lng}&month=${month}&year=${year}&method=${method}&madhab=${madhab}&highLatitudeRule=recommended`);
            return data.data;
        }
    });

    const {data: ramadan, isLoading: isRamadanLoading, isError: isRamadanError} = useQuery<Ramadan>({
        queryKey: ["ramadan", year, lat, lng, method, madhab, hijriYear],
        queryFn: async() => {
            const {data} = await axios.get(`/api/ramadan/${year}?lat=${lat}&lng=${lng}&method=${method}&madhab=${madhab}&highLatitudeRule=recommended&hijri_year=${hijriYear}`);
            return data.data;
        }
    });

    return (
        <main className="max-w-7xl w-full mx-auto p-4 space-y-8">
            <h1 className="text-5xl font-bold text-center">Prayer Time</h1>
            <p className="text-lg text-(--text-secondary) text-center">Daily, Monthly Prayer Time and Ramadan Timetable in your location.</p>
            <Tabs defaultValue="dailyPrayer" className="w-full">
                <TabsList className="bg-(--card-bg) grid max-md:w-full grid-cols-3 md:inline-flex overflow-x-auto overflow-y-hidden">
                    <TabsTrigger value="dailyPrayer">Prayer Time</TabsTrigger>
                    <TabsTrigger value="monthlyPrayer">Prayer Month</TabsTrigger>
                    <TabsTrigger value="ramadan">Ramadan</TabsTrigger>
                </TabsList>
                <TabsContent value="dailyPrayer">
                    <div className="grid gap-5 mt-4 md:grid-cols-3">
                        <div className="min-w-0 space-y-6 col-span-full md:col-span-1">
                            <div>
                                <Label htmlFor="date">Date</Label>
                                <input type="date" id="date" className="w-full border border(--border) p-2 rounded-lg" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="method">Method</Label>
                                <select id="method" className="w-full border border(--border) p-2 rounded-lg" value={methods?.find((m) => m.name === method || m.key === method)?.key ?? ""} onChange={(e) => setMethod(e.target.value)}>
                                    {methods?.map((m: Method) => <option key={m.key} value={m.key} className="bg-(--bg-primary)">{m.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="madthab">Madhab</Label>
                                <select id="madthab" className="w-full border border(--border) p-2 rounded-lg" onChange={(e) => setMadhab(e.target.value)}>
                                    <option value="Hanafi">Hanafi</option>
                                    <option value="Shafi">Shafi</option>
                                </select>
                            </div>
                        </div>
                        <div className="min-w-0 col-span-full md:col-span-2">
                            <h3 className="text-3xl font-bold mb-4">Prayer Time ({prayerTimes?.date})</h3>
                            <p className="text-lg"><strong>Timezone:</strong> {prayerTimes?.timezone}</p>
                            <div className="w-full max-w-full overflow-x-auto">
                                <table className="w-full border border-collapse border(--border) text-lg my-4">
                                    <thead>
                                        <tr className="bg-(--bg-secondary) text-center">
                                            <th className="border border-(--border) whitespace-nowrap p-2">Prayer</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Prayer Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Imsak</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.imsak as string)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Fajr</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.fajr as string)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Sunrise</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.sunrise as string)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Dhuhr</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.dhuhr as string)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Asr</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.asr as string)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Maghrib</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.maghrib as string)}</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-(--border) whitespace-nowrap p-2">Isha</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(prayerTimes?.prayer_times.isha as string)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="italic text-(--text-muted) mb-4"><strong>Note:</strong> {prayerTimes?.islamic_info.note}</p>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="monthlyPrayer">
                    <div className="grid gap-5 mt-4 md:grid-cols-3">
                        <div className="min-w-0 space-y-6 col-span-full md:col-span-1">
                            <div>
                                <Label htmlFor="month">Month</Label>
                                <select id="month" className="w-full border border(--border) p-2 rounded-lg" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                    {months?.map((month, i) => <option key={i} value={i + 1} className="bg-(--bg-primary)">{month}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="year">Year</Label>
                                <select id="year" className="w-full border border(--border) p-2 rounded-lg" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                                    {[...Array(101)].map((_, i) => <option key={i} value={i + 2000} className="bg-(--bg-primary)">{i + 2000}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="method">Method</Label>
                                <select id="method" className="w-full border border(--border) p-2 rounded-lg" value={methods?.find((m) => m.name === method || m.key === method)?.key ?? ""} onChange={(e) => setMethod(e.target.value)}>
                                    {methods?.map((m: Method) => <option key={m.key} value={m.key} className="bg-(--bg-primary)">{m.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="madthab">Madhab</Label>
                                <select id="madthab" className="w-full border border(--border) p-2 rounded-lg" onChange={(e) => setMadhab(e.target.value)}>
                                    <option value="Hanafi">Hanafi</option>
                                    <option value="Shafi">Shafi</option>
                                </select>
                            </div>
                        </div>
                        <div className="min-w-0 col-span-full md:col-span-2">
                            <h3 className="text-3xl font-bold mb-4">Monthly Prayer Time ({monthlyPrayerTimes?.month_name} {monthlyPrayerTimes?.year})</h3>
                            <p className="text-lg"><strong>Timezone:</strong> {monthlyPrayerTimes?.timezone}</p>
                            <div className="w-full max-w-full overflow-x-auto">
                                <table className="w-full border border-collapse border(--border) text-lg my-4">
                                    <thead>
                                        <tr className="bg-(--bg-secondary) text-center">
                                            <th className="border border-(--border) whitespace-nowrap p-2">Day</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Imsak</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Fajr</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Sunrise</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Dhuhr</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Asr</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Maghrib</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Isha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyPrayerTimes?.days.map((day: Day) => <tr key={day.day}>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{day.day}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.imsak)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.fajr)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.sunrise)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.dhuhr)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.asr)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.maghrib)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.prayer_times.isha)}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="ramadan">
                    <div className="grid gap-5 mt-4 md:grid-cols-3">
                        <div className="min-w-0 space-y-6 col-span-full md:col-span-1">
                            <div>
                                <Label htmlFor="year">Year</Label>
                                <select id="year" className="w-full border border(--border) p-2 rounded-lg" value={year} onChange={(e) => {setYear(Number(e.target.value)); setHijriYear(getHijriYear(Number(e.target.value)) as number)}}>
                                    {[...Array(140)].map((_, i) => <option key={i} value={i + 1938} className="bg-(--bg-primary)">{i + 1938}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="method">Method</Label>
                                <select id="method" className="w-full border border(--border) p-2 rounded-lg" value={methods?.find((m) => m.name === method || m.key === method)?.key ?? ""} onChange={(e) => setMethod(e.target.value)}>
                                    {methods?.map((m: Method) => <option key={m.key} value={m.key} className="bg-(--bg-primary)">{m.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="madhab">Madhab</Label>
                                <select id="madhab" className="w-full border border(--border) p-2 rounded-lg" onChange={(e) => setMadhab(e.target.value)}>
                                    <option value="Hanafi">Hanafi</option>
                                    <option value="Shafi">Shafi</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="hijri-year">Hijri Year</Label>
                                <select id="hijri-year" className="w-full border border(--border) p-2 rounded-lg" value={hijriYear} onChange={(e) => setHijriYear(Number(e.target.value))}>
                                    {ramadan?.ramadans_in_year.map((ramadanYear: RamadansInYear) => <option key={ramadanYear.hijri_year} value={ramadanYear.hijri_year} className="bg-(--bg-primary)">{ramadanYear.hijri_year}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="min-w-0 col-span-full md:col-span-2">
                            <h3 className="text-3xl font-bold mb-4">Ramadan ({ramadan?.hijri_year} Hijri)</h3>
                            <p className="text-lg"><strong>Timezone:</strong> {ramadan?.timezone}</p>
                            <div className="w-full max-w-full overflow-x-auto">
                                <table className="w-full border border-collapse border(--border) text-lg my-4">
                                    <thead>
                                        <tr className="bg-(--bg-secondary) text-center">
                                            <th className="border border-(--border) whitespace-nowrap p-2">Ramadan</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Date</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Day</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Suhoor Ends</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Fajr</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Sunrise</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Dhuhr</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Asr</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Iftar</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Maghrib</th>
                                            <th className="border border-(--border) whitespace-nowrap p-2">Isha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ramadan?.days.map((day: RamadanDays) => <tr key={day.day}>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{day.day}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{day.date}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{day.day_name}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.suhoor_ends)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.fajr)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.sunrise)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.dhuhr)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.asr)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.iftar)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.maghrib)}</td>
                                            <td className="border border-(--border) whitespace-nowrap p-2">{formatTime12h(day.isha)}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
};

const PrayerTime = () => (
    <Suspense fallback={<main className="max-w-7xl w-full mx-auto p-4 text-center">Loading prayer times...</main>}>
        <PrayerTimeContent />
    </Suspense>
);

export default PrayerTime;