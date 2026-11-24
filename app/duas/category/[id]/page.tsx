"use client";

import useAxios from "@/hooks/useAxios";
import { Dua, Duas } from "@/types/dua";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { getArFontSize, getTrFontSize } from "@/utils/localStorage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const DuaCategoryContent = () => {
    const { id } = useParams<{ id: string }>();
    const arFontSize = getArFontSize();
    const trFontSize = getTrFontSize();
    const axios = useAxios();
    const {data: duas, isLoading: isDuasLoading, isError: isDuasError} = useQuery<Duas>({
        queryKey: ["duas"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/duas/category/${id}`); 
            return data.data;
        }
    });
    return (
        <main className="w-full max-w-7xl mx-auto p-4">
            {isDuasLoading && <p className="text-center text-2xl font-semibold">Loading duas...</p>}
            {isDuasError ? <p className="text-center text-2xl font-semibold">Failed loading duas</p> : <div className="space-y-4">
                <h3 className="font-bold text-3xl text-center">{duas?.category.name} ({duas?.total} duas)</h3>
                <p className="text-center text-(--text-secondary)">{duas?.category.description}</p>
                {duas?.duas.map((dua: Dua) => <div key={dua.id}>
                    <h4 className="font-semibold text-2xl text-center mb-4">{dua.title} ({dua.repeat} time{dua.repeat > 1 ? "s" : ""})</h4>
                    <p dir="rtl" className={`leading-loose mb-2 ${notoNaskhArabic.className}`} style={{ 
                        fontSize: `${arFontSize}px`
                    }}>{dua.arabic.replaceAll("ٱ", "ا")}</p>
                    <p className="text-(--text-secondary) mb-2" style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{dua.translation}</p>
                    <p className="italic text-(--text-muted) mb-2">Source {dua.source}</p>
                    <hr className="bg-(--foreground) mb-2" />
                </div>)}
            </div>}
        </main>
    );
};

const DuaCategory = () => (
    <Suspense fallback={<main className="w-full max-w-7xl mx-auto p-4 text-center">Loading duas...</main>}>
        <DuaCategoryContent />
    </Suspense>
);

export default DuaCategory;