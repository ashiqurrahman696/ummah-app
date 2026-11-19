"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAxios from '@/hooks/useAxios';
import { Collections, Hadith, Search } from '@/types/hadith';
import { getArFontSize, getTrFontSize } from '@/utils/localStorage';
import { useQuery } from '@tanstack/react-query';
import { Noto_Naskh_Arabic } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';

const notoNaskhArabic = Noto_Naskh_Arabic({
    weight: ["400", "500", "600", "700"]
});

const HadithPage = () => {
    const arFontSize = getArFontSize();
    const trFontSize = getTrFontSize();
    const [query, setQuery] = useState<string>("");
    const [selectedCollection, setSelectedCollection] = useState<string>("bukhari");
    const axios = useAxios();
    const {data: collections, isLoading: isCollectionsLoading, isError: isCollectionsError} = useQuery<Collections[]>({
        queryKey: ["collections"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/hadith/collections`); 
            return data.data.collections;
        }
    });
    const {data: searchedHadiths, isLoading: isSearchedHadithsLoading, isError: isSearchedHadithsError} = useQuery<Search>({
        queryKey: ["search", query, selectedCollection],
        queryFn: async() => {
            const {data} = await axios.get(`/api/hadith/search?q=${query}&collection=${selectedCollection}&limit=100`); 
            return data.data;
        }
    });
    return (
        <main className="w-full max-w-7xl mx-auto p-4">
            <Tabs defaultValue="collections" className="w-full">
                <TabsList className="bg-(--card-bg)">
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="search">Search Hadith</TabsTrigger>
                </TabsList>
                <TabsContent value="collections">
                    <h2 className="text-4xl font-bold text-center mb-6">Hadith Collections</h2>
                    {isCollectionsLoading && <p className="text-center text-2xl font-semibold">Loading hadith collections...</p>}
                    {isCollectionsError ? <p className="text-center text-2xl font-semibold">Error loading hadith collections</p> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                        {collections?.map((collection: Collections) => <Link href={`/hadith/collection/${collection.key}`} key={collection.key}>
                            <Card className="bg-(--card-bg) border-(--border) border size-full text-center">
                                <CardHeader>
                                    <CardTitle className="text-lg">{collection.name} (<span className={notoNaskhArabic.className}>{collection.arabic_name}</span>)</CardTitle>
                                </CardHeader>
                                <CardContent className="text-(--text-muted)">
                                    {collection.total_hadiths} hadiths
                                </CardContent>
                            </Card>
                        </Link>)}
                    </div>}
                </TabsContent>
                <TabsContent value="search">
                    <h2 className="text-4xl font-bold text-center mb-6">Search Hadith</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="query">Query</label>
                            <input type="search" id="query" className="w-full border border(--border) p-2 rounded-lg" onChange={(e) => setQuery(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="collection">Collection</label>
                            <select id="collection" className="w-full border border(--border) p-2 rounded-lg" value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)}>
                                {collections?.map((collection: Collections) => <option key={collection.key} value={collection.key} className="bg-(--bg-primary)">{collection.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {isSearchedHadithsLoading && <p className="text-center text-2xl font-semibold">Searching hadith...</p>}
                    {isSearchedHadithsError ? <p className="text-center text-2xl font-semibold">{query || "Failed to search hadith"}</p> : <>
                        {searchedHadiths?.hadiths.map((hadith: Hadith) => <div key={hadith.id} className="w-full">
                            <p dir="rtl" className={`leading-loose ${notoNaskhArabic.className}`} style={{ 
                                fontSize: `${arFontSize}px`
                            }}>{hadith.arabic.replaceAll("ٱ", "ا")}</p>
                            <p className="text-(--text-secondary) my-2" style={{ 
                                fontSize: `${trFontSize}px`
                            }}>{hadith.english}</p>
                            <p className="italic text-(--text-muted) mb-2">{hadith.collection_name}: {hadith.hadithnumber}</p>
                            <hr className="bg-(--foreground) mb-2" />
                        </div>)}
                    </>}
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default HadithPage;