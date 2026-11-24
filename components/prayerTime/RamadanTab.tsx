import { formatTime12h } from "@/utils/format12h";
import { Label } from "../ui/label";
import { getHijriYear } from "@/utils/hijriYear";
import { Method, Ramadan, RamadanDays, RamadansInYear } from "@/types/prayerTime";
import { Dispatch, SetStateAction } from "react";

const RamadanTab = ({year, setYear, hijriYear, setHijriYear, methods, method, setMethod, setMadhab, ramadan}: {year: number, setYear: Dispatch<SetStateAction<number>>, hijriYear: number, setHijriYear: Dispatch<SetStateAction<number>>, methods: Method[], method: string, setMethod: Dispatch<SetStateAction<string>>, setMadhab: Dispatch<SetStateAction<string>>, ramadan: Ramadan}) => {
    return (
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
    );
};

export default RamadanTab;