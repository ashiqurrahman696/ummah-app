"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { Names } from "@/types/asmaulHusna";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { useQuery } from "@tanstack/react-query";

const AsmaulHusna = () => {
    const axios = useAxios();
    const {data: names, isLoading: isNamesLoading, isError: isNamesError} = useQuery<Names[]>({
        queryKey: ["names"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/asma-ul-husna`); 
            return data.data.names;
        }
    });
    return (
        <main className="max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-center mb-6">99 Names of Allah</h2>
            {isNamesLoading && <p className="text-center text-2xl font-semibold">Loading 99 Names of Allah...</p>}
            {isNamesError ? <p className="text-center text-2xl font-semibold">Error loading 99 Names of Allah</p> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {names?.map((name: Names) => <Card key={name.number} className="bg-(--card-bg) border-(--border) border size-full text-center">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {name.number}. {name.transliteration} (<span className={notoNaskhArabic.className}>{name.arabic}</span>) - {name.english}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-(--text-muted)">
                        {name.meaning}
                    </CardContent>
                </Card>)}
            </div>}
        </main>
    );
};

export default AsmaulHusna;