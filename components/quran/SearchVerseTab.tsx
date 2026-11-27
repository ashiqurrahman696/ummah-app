import { QuranSearch } from "@/types/quran";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { getShowTransliteration } from "@/utils/localStorage";
import { Dispatch, SetStateAction } from "react";

const SearchVerseTab = ({verseQuery, setVerseQuery, stopVerse, quranSearch, arFontSize, translation, trFontSize}: {verseQuery: string, setVerseQuery: Dispatch<SetStateAction<string>>, stopVerse: () => void, quranSearch: QuranSearch[], arFontSize: number, translation: string, trFontSize: number}) => {
    const showTransliteration = getShowTransliteration();
    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="search">Search Verse</label>
                <input type="search" id="search" className="w-full border border(--border) p-2 rounded-lg" onChange={(e) => {setVerseQuery(e.target.value); stopVerse()}} />
            </div>
            {verseQuery ? quranSearch?.length !== 0 ? quranSearch?.map((search: QuranSearch) => <div key={search.verse_key}>
                <h3 className="font-bold text-2xl text-center mb-6">{search.surah_name} {search.verse_key}</h3>
                <div className="w-full">
                    <p dir="rtl" className={`leading-loose ${notoNaskhArabic.className}`} style={{
                        fontSize: `${arFontSize}px`
                    }}>{search.arabic.replaceAll("ٱ", "ا")} <span className={`rounded-[50%] border border-(--foreground) p-2 text-xl`}>{search.ayah}</span></p>
                    {showTransliteration && <p className={`text-(--text-secondary) my-2 italic`} style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{search.transliteration}</p>}
                    <p className={`text-(--text-secondary) my-2 ${translation === "urdu" && "text-end"}`} style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{search.translation}</p>
                </div>
                <hr className="bg-(--foreground) mb-2" />
            </div>) : <p className="text-center text-2xl font-semibold">No results for &quot;{verseQuery}&quot;</p> : <p className="text-center text-2xl font-semibold">Please write something to search verse in arabic, {translation} or arabic ayah&apos;s transliteration</p>}
        </div>
    );
};

export default SearchVerseTab;