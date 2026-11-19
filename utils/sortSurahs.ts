import { Surahs } from "@/types/quran";

const sortSurahs = (sorted: string, surahs: Surahs[]) => {
    if(sorted === "surahNumber-asc") return surahs?.sort((a, b) => a.number - b.number) as Surahs[];
    if(sorted === "surahNumber-desc") return surahs?.sort((a, b) => b.number - a.number) as Surahs[];
    if(sorted === "surahName-asc") return surahs?.sort((a, b) => a.name_english.localeCompare(b.name_english)) as Surahs[];
    if(sorted === "surahName-desc") return surahs?.sort((a, b) => b.name_english.localeCompare(a.name_english)) as Surahs[];
    if(sorted === "revealOrder-asc") return surahs?.sort((a, b) => a.revelation_order - b.revelation_order) as Surahs[];
    if(sorted === "revealOrder-desc") return surahs?.sort((a, b) => b.revelation_order - a.revelation_order) as Surahs[];
}

export {sortSurahs};