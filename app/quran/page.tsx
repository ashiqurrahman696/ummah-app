"use client";
import SearchVerseTab from "@/components/quran/SearchVerseTab";
import SingleVerseTab from "@/components/quran/SingleVerseTab";
import SurahsTab from "@/components/quran/SurahsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxios from "@/hooks/useAxios";
import { Ayah, QuranSearch, Surahs, Tafsir } from "@/types/quran";
import { getArFontSize, getReciterId, getTafsirKey, getTranslation, getTrFontSize } from "@/utils/localStorage";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

const QuranPage = () => {
    const [surahId, setSurahId] = useState<number>(1);
    const [verseId, setVerseId] = useState<number>(1);
    const [verseQuery, setVerseQuery] = useState<string>("");
    const [sort, setSort] = useState("surahNumber-asc");
    const [isVersePlaying, setIsVersePlaying] = useState<boolean>(false);
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
                    <SurahsTab
                        isSurahsLoading={isSurahsLoading}
                        isSurahsError={isSurahsError}
                        sort={sort}
                        setSort={setSort}
                        surahs={surahs as Surahs[]}
                    />
                </TabsContent>
                <TabsContent value="singleVerse">
                    <SingleVerseTab
                        surahId={surahId}
                        setSurahId={setSurahId}
                        stopVerse={stopVerse}
                        verseId={verseId}
                        setVerseId={setVerseId}
                        surahs={surahs as Surahs[]}
                        ayah={ayah as Ayah}
                        isVersePlaying={isVersePlaying}
                        playVerse={playVerse}
                        arFontSize={arFontSize}
                        translation={translation as string}
                        trFontSize={trFontSize}
                        tafsir={tafsir as Tafsir}
                    />
                </TabsContent>
                <TabsContent value="searchVerse">
                    <SearchVerseTab
                        verseQuery={verseQuery}
                        setVerseQuery={setVerseQuery}
                        stopVerse={stopVerse}
                        quranSearch={quranSearch as QuranSearch[]}
                        arFontSize={arFontSize}
                        translation={translation as string}
                        trFontSize={trFontSize}
                    />
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default QuranPage;