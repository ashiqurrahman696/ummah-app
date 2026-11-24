"use client";
import CollectionsTab from '@/components/hadtih/CollectionsTab';
import HadithSearch from '@/components/hadtih/HadithSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAxios from '@/hooks/useAxios';
import { Collections, Search } from '@/types/hadith';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const HadithPage = () => {
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
                    <CollectionsTab
                        isCollectionsLoading={isCollectionsLoading}
                        isCollectionsError={isCollectionsError}
                        collections={collections as Collections[]}
                    />
                </TabsContent>
                <TabsContent value="search">
                    <HadithSearch
                        collections={collections as Collections[]}
                        isSearchedHadithsLoading={isSearchedHadithsLoading}
                        isSearchedHadithsError={isSearchedHadithsError}
                        selectedCollection={selectedCollection}
                        query={query}
                        setQuery={setQuery}
                        setSelectedCollection={setSelectedCollection}
                        searchedHadiths={searchedHadiths as Search}
                    />
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default HadithPage;