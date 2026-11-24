import { Surahs } from "@/types/quran";
import { sortSurahs } from "@/utils/sortSurahs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { Dispatch, SetStateAction } from "react";

const SurahsTab = ({isSurahsLoading, isSurahsError, sort, setSort, surahs}: {isSurahsLoading: boolean, isSurahsError: boolean, sort: string, setSort: Dispatch<SetStateAction<string>>, surahs: Surahs[]}) => {
    return (
        <>
            {isSurahsLoading && <p className="text-center text-2xl font-semibold">Loading surahs...</p>}
            {isSurahsError ? <p className="text-center text-2xl font-semibold">Error loading surahs</p> : <>
                <div className="w-full max-w-md mx-auto mb-4">
                    <label htmlFor="sort">Sort by</label>
                    <select id="sort" className="w-full border border(--border) p-2 rounded-lg" value={sort} onChange={(e) => {setSort(e.target.value); sortSurahs(e.target.value, surahs as Surahs[]);}}>
                        <option value="surahNumber-asc">Surah Number (Asc)</option>
                        <option value="surahNumber-desc">Surah Number (Desc)</option>
                        <option value="surahName-asc">Surah Name (Asc)</option>
                        <option value="surahName-desc">Surah Name (Desc)</option>
                        <option value="revealOrder-asc">Revelation Order (Asc)</option>
                        <option value="revealOrder-desc">Revelation Order (Desc)</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {surahs?.map((surah: Surahs) => <Link href={`/quran/surah/${surah.number}`} key={surah.number}>
                        <Card className="bg-(--card-bg) border-(--border) border size-full text-center">
                            <CardHeader>
                                <CardTitle className="text-lg">{surah.number}. {surah.name_english} (<span className={notoNaskhArabic.className}>{surah.name_arabic}</span>) - {surah.name_translation}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-(--text-muted) space-y-2">
                                <p><strong>Verses:</strong> {surah.verses_count}</p>
                                <p className="capitalize"><strong>Revelation Place:</strong> {surah.revelation_place}</p>
                                <p><strong>Revelation Order:</strong> {surah.revelation_order}</p>
                            </CardContent>
                        </Card>
                    </Link>)}
                </div>
            </>}
        </>
    );
};

export default SurahsTab;