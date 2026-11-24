"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import { Collection, Hadith } from "@/types/collection";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { getArFontSize, getTrFontSize } from "@/utils/localStorage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

const CollectionPageContent = () => {
    const { key } = useParams<{ key: string }>();
    const arFontSize = getArFontSize();
    const trFontSize = getTrFontSize();
    const axios = useAxios();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const {data: collection, isLoading: isCollectionLoading, isError: isCollectionError} = useQuery<Collection>({
        queryKey: ["collections", page, limit],
        queryFn: async() => {
            const {data} = await axios.get(`/api/hadith/${key}?page=${page}&limit=${limit}`); 
            return data.data;
        }
    });
    return (
        <main className="w-full max-w-7xl mx-auto p-4">
            {isCollectionLoading && <p className="text-center text-2xl font-semibold">Loading collection...</p>}
            {isCollectionError ? <p className="text-center text-2xl font-semibold">Failed loading collection</p> : <>
                <h3 className="font-bold text-3xl text-center mb-6">{collection?.collection_name}</h3>
                <div className="flex items-center gap-3 justify-center md:justify-end">
                    <Label htmlFor="limit">Hadiths per page</Label>
                    <select id="limit" className="border border(--border) p-2 rounded-lg" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                        {[10, 20, 25, 50, 100].map((l) => <option key={l} value={l} className="bg-(--bg-primary)">{l}</option>)}
                    </select>
                </div>
                {collection?.hadiths.map((hadith: Hadith) => <div key={hadith.hadithnumber} className="w-full">
                    <p dir="rtl" className={`leading-loose ${notoNaskhArabic.className}`} style={{ 
                        fontSize: `${arFontSize}px`
                    }}>{hadith.arabic.replaceAll("ٱ", "ا")} <span className={`rounded-[50%] border border-(--foreground) p-2 text-xl`}>{hadith.hadithnumber}</span></p>
                    <p className="text-(--text-secondary) my-2" style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{hadith.english}</p>
                    <hr className="bg-(--foreground) mb-2" />
                </div>)}
            </>}
            <div className="flex gap-4 items-center justify-center">
                <Button className="bg-(--bg-secondary) text-(--text-secondary) cursor-pointer text-xl p-4 py-6 hover:bg-(--bg-secondary)" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</Button>
                <select className="border border(--border) p-2 rounded-lg" value={page} onChange={(e) => setPage(Number(e.target.value))}>
                    {[...Array(collection?.total_pages)].map((_, i) => <option key={i} value={i + 1} className="bg-(--bg-primary)">{i + 1} / {collection?.total_pages}</option>)}
                </select>
                <Button className="bg-(--bg-secondary) text-(--text-secondary) cursor-pointer text-xl p-4 py-6 hover:bg-(--bg-secondary)" disabled={page === collection?.total_pages} onClick={() => setPage(page + 1)}>Next &gt;</Button>
            </div>
        </main>
    );
};

const CollectionPage = () => (
    <Suspense fallback={<main className="w-full max-w-7xl mx-auto p-4 text-center">Loading collection...</main>}>
        <CollectionPageContent />
    </Suspense>
);

export default CollectionPage;