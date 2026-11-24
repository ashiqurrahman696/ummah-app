import { formatTime12h } from "@/utils/format12h";
import { Label } from "../ui/label";
import { Day, Method, MonthlyPrayerTimes } from "@/types/prayerTime";
import { Dispatch, SetStateAction } from "react";

const PrayerMonthTab = ({month, setMonth, months, year, setYear, methods, method, setMethod, setMadhab, monthlyPrayerTimes}: {month: number, setMonth: Dispatch<SetStateAction<number>>, months: string[], year: number, setYear: Dispatch<SetStateAction<number>>, methods: Method[], method: string, setMethod: Dispatch<SetStateAction<string>>, setMadhab: Dispatch<SetStateAction<string>>, monthlyPrayerTimes: MonthlyPrayerTimes}) => {
    return (
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
                                <th className="border border-(--border) whitespace-nowrap p-2">Day Name</th>
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
                                <td className="border border-(--border) whitespace-nowrap p-2">{day.day_name}</td>
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
    );
};

export default PrayerMonthTab;