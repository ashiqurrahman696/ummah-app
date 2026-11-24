"use client";

import PrayerMonthTab from "@/components/prayerTime/PrayerMonthTab";
import PrayerTimeTab from "@/components/prayerTime/PrayerTimeTab";
import RamadanTab from "@/components/prayerTime/RamadanTab";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { Method, MonthlyPrayerTimes, PrayerTimes, Ramadan } from "@/types/prayerTime";
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
                    <PrayerTimeTab
                        date={date}
                        setDate={setDate}
                        methods={methods as Method[]}
                        method={method}
                        setMethod={setMethod}
                        setMadhab={setMadhab}
                        prayerTimes={prayerTimes as PrayerTimes}
                    />
                </TabsContent>
                <TabsContent value="monthlyPrayer">
                    <PrayerMonthTab
                        month={month}
                        setMonth={setMonth}
                        months={months}
                        year={year}
                        setYear={setYear}
                        methods={methods as Method[]}
                        method={method}
                        setMethod={setMethod}
                        setMadhab={setMadhab}
                        monthlyPrayerTimes={monthlyPrayerTimes as MonthlyPrayerTimes}
                    />
                </TabsContent>
                <TabsContent value="ramadan">
                    <RamadanTab
                        year={year}
                        setYear={setYear}
                        hijriYear={hijriYear}
                        setHijriYear={setHijriYear}
                        methods={methods as Method[]}
                        method={method}
                        setMethod={setMethod}
                        setMadhab={setMadhab}
                        ramadan={ramadan as Ramadan}
                    />
                </TabsContent>
            </Tabs>
        </main>
    );
};

const PrayerTimePage = () => (
    <Suspense fallback={<main className="max-w-7xl w-full mx-auto p-4 text-center">Loading prayer times...</main>}>
        <PrayerTimeContent />
    </Suspense>
);

export default PrayerTimePage;