"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { Ayah, QuranSearch, Surahs, Tafsir } from "@/types/quran";
import { getArFontSize, getReciterId, getTafsirKey, getTranslation, getTrFontSize } from "@/utils/localStorage";
import { sortSurahs } from "@/utils/sortSurahs";
import { useQuery } from "@tanstack/react-query";
import { Noto_Naskh_Arabic } from "next/font/google";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa6";

const notoNaskhArabic = Noto_Naskh_Arabic({
    weight: ["400", "500", "600", "700"]
});

const QuranPage = () => {
    const [surahId, setSurahId] = useState<number>(1);
    const [verseId, setVerseId] = useState<number>(1);
    const [verseQuery, setVerseQuery] = useState<string>("");
    const [sort, setSort] = useState("surahNumber-asc");
    const [isVersePlaying, setIsVersePlaying] = useState<boolean>(false);
    const reciterId = getReciterId();
    const arFontSize = getArFontSize();
    const trFontSize = getTrFontSize();
    const tafsirKey = getTafsirKey();
    const translation = getTranslation();
    const verseAudioRef = useRef<HTMLAudioElement | null>(null);
    const axios = useAxios();

    const {data: surahs, isLoading: isSurahsLoading, isError: isSurahsError} = useQuery<Surahs[]>({
        queryKey: ["surahs"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/quran/surahs`);
            return data.data.surahs;
        }
    });

    const {data: ayah, isLoading: isAyahLoading, isError: isAyahError} = useQuery<Ayah>({
        queryKey: ["ayah", surahId, verseId],
        queryFn: async() => {
            const {data} = await axios.get(`/api/quran/surah/${surahId}/ayah/${verseId}?script=uthmani`);
            return data.data;
        }
    });

    const {data: tafsir, isLoading: isLoadingTafsir, isError: isTafsirError} = useQuery<Tafsir>({
        queryKey: ["tafsir", surahId, verseId],
        queryFn: async() => {
            const {data} = await axios.get(`/api/tafsir/${tafsirKey}/surah/${surahId}/ayah/${verseId}`);
            return data.data.tafsir;
        }
    });

    const {data: quranSearch, isLoading: isLoadingQuranSearch, isError: isQuranSearchError} = useQuery<QuranSearch[]>({
        queryKey: ["quranSearch", verseQuery],
        queryFn: async() => {
            const {data} = await axios.get(`api/quran/search?q=${verseQuery}&translation=${translation}&limit=50`);
            return data.data.results;
        }
    });

    const surah = surahs?.find((surah) => surah.number === surahId);

    const audio = ayah?.audio.find(audio => audio.reciter_id === reciterId);

    const playVerse = (url: string, surahId: number, verseId: number) => {
        setSurahId(surahId);
        setVerseId(verseId);
        setIsVersePlaying(true);

        const verseAudio = verseAudioRef.current ?? new Audio();
        verseAudioRef.current = verseAudio;

        verseAudio.pause();
        verseAudio.currentTime = 0;

        if(!url) return alert("Failed to play verse");

        verseAudio.src = url;
        verseAudio.play();

        verseAudio.onended = () => {
            verseAudio.pause();
            verseAudio.currentTime = 0;
            setIsVersePlaying(false);
        };
    }

    const stopVerse = () => {
        const verseAudio = verseAudioRef.current;
        verseAudio?.pause();
        if (verseAudio) verseAudio.currentTime = 0;
        setIsVersePlaying(false);
    };

    const translatedVerse = translation === "sahih_international" ? ayah?.verse?.translations.sahih_international : translation === "pickthall" ? ayah?.verse?.translations.pickthall : translation === "yusuf_ali" ? ayah?.verse?.translations.yusuf_ali : translation === "urdu" ? ayah?.verse?.translations.urdu : translation === "turkish" ? ayah?.verse?.translations.turkish : translation === "indonesian" ? ayah?.verse?.translations.indonesian : translation === "french" ? ayah?.verse?.translations.french : translation === "german" ? ayah?.verse?.translations.german : translation === "bengali" ? ayah?.verse?.translations.bengali : translation === "spanish" ? ayah?.verse?.translations.spanish : translation === "malay" ? ayah?.verse?.translations.malay : ayah?.verse?.translations.bosnian;

    return (
        <main className="w-full max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-center mb-6">Al Quran</h2>
            <Tabs defaultValue="surahs" className="w-full">
                <TabsList className="bg-(--card-bg) grid max-md:w-full grid-cols-3 md:inline-flex overflow-x-auto overflow-y-hidden">
                    <TabsTrigger value="surahs">Surahs</TabsTrigger>
                    <TabsTrigger value="singleVerse">Single Verse</TabsTrigger>
                    <TabsTrigger value="searchVerse">Search Verse</TabsTrigger>
                </TabsList>
                <TabsContent value="surahs">
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
                </TabsContent>
                <TabsContent value="singleVerse">
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
                                <p className={`text-(--text-secondary) my-2 ${translation === "urdu" && "text-end"}`} style={{ 
                                    fontSize: `${trFontSize}px`
                                }}>{translatedVerse}</p>
                            </div>
                        </div>
                        <hr className="bg-(--foreground) mb-2" />
                        <p className="text-2xl text-center font-semibold mb-2">Tafsir by {tafsir?.author} (<span className="capitalize">{tafsir?.language}</span>)</p>
                        {tafsir?.language === "arabic" ? <p dir="rtl" className={`text-lg ${notoNaskhArabic.className}`}>{tafsir?.text}</p> : <p className="text-lg">{tafsir?.text}</p>}
                        
                    </div>
                </TabsContent>
                <TabsContent value="searchVerse">
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
                                <p className={`text-(--text-secondary) my-2 ${translation === "urdu" && "text-end"}`} style={{ 
                                    fontSize: `${trFontSize}px`
                                }}>{search.translation}</p>
                            </div>
                            <hr className="bg-(--foreground) mb-2" />
                        </div>) : <p className="text-center text-2xl font-semibold">No results for &quot;{verseQuery}&quot;</p> : <p className="text-center text-2xl font-semibold">Please write something to search</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default QuranPage;