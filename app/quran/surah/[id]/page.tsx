"use client";
import AudioPlayer from "@/components/AudioPlayer";
import useAxios from "@/hooks/useAxios";
import { getArFontSize, getReciterId, getTafsirKey, getTranslation, getTrFontSize } from "@/utils/localStorage";
import { Surah, Tafsir, Verse } from "@/types/surah";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Noto_Naskh_Arabic } from "next/font/google";
import { useParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa6";
import { notoNaskhArabic } from "@/utils/arabicFont";

const SurahPageContent = () => {
    const { id } = useParams<{ id: string }>();
    const axios = useAxios();
    const verseAudioRef = useRef<HTMLAudioElement | null>(null);
    const [verseId, setVerseId] = useState<number>(0);
    const [isVersePlaying, setIsVersePlaying] = useState<boolean>(false);
    const reciterId = getReciterId();
    const arFontSize = getArFontSize();
    const trFontSize = getTrFontSize();
    const tafsirKey = getTafsirKey();
    const translation = getTranslation();
    const [isTafsirModalOpen, setIsTafsirModalOpen] = useState<boolean>(false);

    const {data: surah, isLoading: isLoadingSurah, isError: isSurahError} = useQuery<Surah>({
        queryKey: ["surah", id],
        queryFn: async() => {
            const {data} = await axios.get(`/api/quran/surah/${id}?script=uthmani&translation=${translation}&reciter=${reciterId}`); 
            return data.data;
        }
    });

    const {data: tafsir, isLoading: isLoadingTafsir, isError: isTafsirError} = useQuery<Tafsir>({
        queryKey: ["tafsir", id, verseId],
        queryFn: async() => {
            const {data} = await axios.get(`/api/tafsir/${tafsirKey}/surah/${id}/ayah/${verseId}`);
            return data.data.tafsir;
        }
    });

    const audio = surah?.audio.find(audio => audio.reciter_id === reciterId);

    const playVerse = (url: string, verseId: number) => {
        const verseAudio = verseAudioRef.current ?? new Audio();
        verseAudioRef.current = verseAudio;

        verseAudio.pause();
        verseAudio.currentTime = 0;

        setVerseId(verseId);
        setIsVersePlaying(true);

        if(!url) return alert("Failed to play verse");

        verseAudio.src = url;
        verseAudio.play();

        verseAudio.onended = () => {
            setVerseId(0);
        };
    }

    const stopVerse = () => {
        const verseAudio = verseAudioRef.current;
        verseAudio?.pause();
        if (verseAudio) verseAudio.currentTime = 0;
        setVerseId(0);
        setIsVersePlaying(false);
    };

    const openTafsirModal = (surah: number, ayah: number) => {
        setVerseId(ayah);
        setIsTafsirModalOpen(true);
    }

    return (
        <main className="w-full max-w-7xl mx-auto p-4 relative">
            {isLoadingSurah && <p className="text-center text-2xl font-semibold">Loading surah...</p>}
            {isSurahError ? <p className="text-center text-2xl font-semibold">Error loading surah...</p> : <>
                <h3 className="font-bold text-3xl text-center mb-6">{surah?.surah.name_english} (<span className={`${notoNaskhArabic.className}`}>{surah?.surah.name_arabic}</span>) - {surah?.surah.name_translation}</h3>
                <p className="text-center text-(--text-secondary) mb-6">Ayah {surah?.surah.verses_count} (<span className="capitalize">{surah?.surah.revelation_place}</span>)</p>
                {surah?.surah.bismillah_pre && <p dir="rtl" className={`text-center mb-6 ${notoNaskhArabic.className}`} style={{ 
                    fontSize: `${arFontSize}px`
                }}>بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>}
                {surah?.verses.map((verse: Verse) => <div key={verse.ayah}>
                    <div className="flex items-center gap-4">
                        {verseId === verse.ayah && isVersePlaying ? <button
                            onClick={stopVerse}
                            className="p-4 bg-(--bg-tertiary) rounded-full text-sm font-semibold"
                            >
                                <FaStop />
                            </button> : <button
                            onClick={() => playVerse(verse.audio.ayah_audio, verse.ayah)}
                            className="p-4 bg-(--bg-tertiary) rounded-full text-sm font-semibold"
                            >
                                <FaPlay />
                            </button>
                        }
                        <div className="w-full cursor-pointer" onClick={() => openTafsirModal(surah.surah.number, verse.ayah)}>
                            <p dir="rtl" className={`leading-loose ${notoNaskhArabic.className}`} style={{ 
                                fontSize: `${arFontSize}px`
                            }}>{verse.arabic.replaceAll("ٱ", "ا")} <span className={`rounded-[50%] border border-(--foreground) p-2 text-xl`}>{verse.ayah}</span></p>
                            <p className="text-(--text-secondary) my-2" style={{ 
                                fontSize: `${trFontSize}px`
                            }}>{verse.translation}</p>
                        </div>
                    </div>
                    <hr className="bg-(--foreground) mb-2" />
                </div>)}
                <AudioPlayer src={audio?.surah_audio as string} title={`Surah ${surah?.surah.name_english} by ${audio?.reciter}`} />
            </>}
            <AnimatePresence>
                {isTafsirModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsTafsirModalOpen(false)}
                    >
                        <motion.div
                        className="size-full max-w-4xl overflow-y-auto bg-(--bg-primary) shadow-lg rounded-xl p-4"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-bold text-2xl text-center mb-6">{surah?.surah.name_english} {id}:{verseId}</h3>
                            <p dir="rtl" className="leading-loose" style={{ 
                                fontSize: `${arFontSize}px`
                            }}>{surah?.verses[verseId - 1].arabic.replaceAll("ٱ", "ا")} <span className={`rounded-[50%] border border-(--foreground) p-2 text-xl`}>{surah?.verses[verseId - 1].ayah}</span></p>
                            <p className="text-(--text-secondary) my-2" style={{ 
                                fontSize: `${trFontSize}px`
                            }}>{surah?.verses[verseId - 1].translation}</p>
                            <hr className="bg-(--foreground) mb-2" />
                            <p className="text-2xl text-center font-semibold mb-2">Tafsir by {tafsir?.author} (<span className="capitalize">{tafsir?.language}</span>)</p>
                            {tafsir?.language === "arabic" ? <p dir="rtl" className={`text-lg ${notoNaskhArabic.className}`}>{tafsir?.text}</p> : <p className="text-lg">{tafsir?.text}</p>}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

const SurahPage = () => (
    <Suspense fallback={<main className="w-full max-w-7xl mx-auto p-4 text-center">Loading surah...</main>}>
        <SurahPageContent />
    </Suspense>
);

export default SurahPage;