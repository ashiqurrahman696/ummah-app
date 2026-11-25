import { Ayah, Surahs, Tafsir } from "@/types/quran";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { getReciterId } from "@/utils/localStorage";
import { Dispatch, SetStateAction } from "react";
import { FaPlay, FaStop } from "react-icons/fa6";

const SingleVerseTab = ({surahId, setSurahId, stopVerse, verseId, setVerseId, surahs, ayah, isVersePlaying, playVerse, arFontSize, translation, trFontSize, tafsir}: {surahId: number, setSurahId: Dispatch<SetStateAction<number>>, stopVerse: () => void, verseId: number, setVerseId: Dispatch<SetStateAction<number>>, surahs: Surahs[], ayah: Ayah, isVersePlaying: boolean, playVerse: (url: string, surahId: number, verseId: number) => void, arFontSize: number, translation: string, trFontSize: number, tafsir: Tafsir}) => {
    const reciterId = getReciterId();
    const surah = surahs?.find((surah) => surah.number === surahId);

    const audio = ayah?.audio.find(audio => audio.reciter_id === reciterId);
    const translatedVerse = translation === "sahih_international" ? ayah?.verse?.translations.sahih_international : translation === "pickthall" ? ayah?.verse?.translations.pickthall : translation === "yusuf_ali" ? ayah?.verse?.translations.yusuf_ali : translation === "urdu" ? ayah?.verse?.translations.urdu : translation === "turkish" ? ayah?.verse?.translations.turkish : translation === "indonesian" ? ayah?.verse?.translations.indonesian : translation === "french" ? ayah?.verse?.translations.french : translation === "german" ? ayah?.verse?.translations.german : translation === "bengali" ? ayah?.verse?.translations.bengali : translation === "spanish" ? ayah?.verse?.translations.spanish : translation === "malay" ? ayah?.verse?.translations.malay : ayah?.verse?.translations.bosnian;

    return (
        <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="surahs">Surah</label>
                    <select id="surahs" className="w-full border border(--border) p-2 rounded-lg" value={surahId} onChange={(e) => {setSurahId(Number(e.target.value)); stopVerse()}}>
                        {surahs?.map((surah: Surahs) => <option key={surah.number} value={surah.number} className="bg-(--bg-primary)">{surah.number}. {surah.name_english}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="verse">Verse Number</label>
                    <select id="verse" className="w-full border border(--border) p-2 rounded-lg" value={verseId} onChange={(e) => {setVerseId(Number(e.target.value)); stopVerse()}}>
                        {[...Array(surah?.verses_count)].map((_, i) => <option key={i} value={i + 1} className="bg-(--bg-primary)">{i + 1}</option>)}
                    </select>
                </div>
            </div>
            <h3 className="font-bold text-2xl text-center mb-6">{surah?.name_english} {ayah?.verse.verse_key}</h3>
            <div className="flex items-center gap-4">
                {isVersePlaying && verseId === ayah?.verse.ayah && surahId === ayah.surah.number ? <button
                    onClick={stopVerse}
                    className="p-4 bg-(--bg-tertiary) rounded-full text-sm font-semibold"
                    >
                        <FaStop />
                    </button> : <button
                    onClick={() => playVerse(audio?.ayah_audio as string, surahId, verseId)}
                    className="p-4 bg-(--bg-tertiary) rounded-full text-sm font-semibold"
                    >
                        <FaPlay />
                    </button>
                }
                <div className="w-full">
                    <p dir="rtl" className={`leading-loose ${notoNaskhArabic.className}`} style={{ 
                        fontSize: `${arFontSize}px`
                    }}>{ayah?.verse.arabic.replaceAll("ٱ", "ا")} <span className={`rounded-[50%] border border-(--foreground) p-2 text-xl`}>{ayah?.verse.ayah}</span></p>
                    <p className={`text-(--text-secondary) my-2 italic`} style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{ayah?.verse.transliteration}</p>
                    <p className={`text-(--text-secondary) my-2 ${translation === "urdu" && "text-end"}`} style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{translatedVerse}</p>
                </div>
            </div>
            <hr className="bg-(--foreground) mb-2" />
            <p className="text-2xl text-center font-semibold mb-2">Tafsir by {tafsir?.author} (<span className="capitalize">{tafsir?.language}</span>)</p>
            {tafsir?.language === "arabic" ? <p dir="rtl" className={`text-lg ${notoNaskhArabic.className}`}>{tafsir?.text}</p> : <p className="text-lg">{tafsir?.text}</p>}
        </div>
    );
};

export default SingleVerseTab;