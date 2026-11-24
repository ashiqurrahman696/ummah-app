import { Method, PrayerTimes } from "@/types/prayerTime";
import { Label } from "../ui/label";
import { formatTime12h } from "@/utils/format12h";
import { Dispatch, SetStateAction } from "react";

const PrayerTimeTab = ({date, setDate, methods, method, setMethod, setMadhab, prayerTimes}: {date: string, setDate: Dispatch<SetStateAction<string>>, methods: Method[], method: string, setMethod: Dispatch<SetStateAction<string>>, setMadhab: Dispatch<SetStateAction<string>>, prayerTimes: PrayerTimes}) => {
    return (
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
    );
};

export default PrayerTimeTab;