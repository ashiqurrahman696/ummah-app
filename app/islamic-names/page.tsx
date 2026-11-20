"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import { Name, Names } from "@/types/islamicNames";
import { useQuery } from "@tanstack/react-query";
import { Noto_Naskh_Arabic } from "next/font/google";
import { useState } from "react";

const notoNaskhArabic = Noto_Naskh_Arabic({
    weight: ["400", "500", "600", "700"]
});

const IslamicNamesPage = () => {
    const axios = useAxios();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);

    const {data: names, isLoading: isNamesLoading, isError: isNamesError} = useQuery<Names>({
        queryKey: ["names", page, limit],
        queryFn: async() => {
            const {data} = await axios.get(`/api/names?page=${page}&limit=${limit}`); 
            return data.data;
        }
    });

    return (
        <main className="max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-center mb-6">Islamic Names</h2>
            {isNamesLoading && <p className="text-center text-2xl font-semibold">Loading Islamic Names...</p>}
            {isNamesError ? <p className="text-center text-2xl font-semibold">Error loading Islamic Names</p> : <>
                <div className="flex items-center gap-3 justify-center md:justify-end mb-6">
                    <Label htmlFor="limit">Names per page</Label>
                    <select id="limit" className="border border(--border) p-2 rounded-lg" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                        {[20, 25, 50, 100].map((l) => <option key={l} value={l} className="bg-(--bg-primary)">{l}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                    {names?.names.map((name: Name) => <Card key={name.id} className="bg-(--card-bg) border-(--border) border size-full text-center">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {name.id}. {name.name} (<span className={notoNaskhArabic.className}>{name.arabic}</span>) - {name.meaning}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-(--text-muted) space-y-2">
                            <p><strong>Gender:</strong> <span className="capitalize">{name.gender}</span></p>
                            <p><strong>Origin:</strong> {name.origin}</p>
                            {name.root && <p><strong>Root:</strong> <span className={notoNaskhArabic.className}>{name.root}</span></p>}
                            <p>{name.note}</p>
                        </CardContent>
                    </Card>)}
                </div>
            </>}
            <div className="flex gap-4 items-center justify-center">
                <Button className="bg-(--bg-secondary) text-(--text-secondary) cursor-pointer text-xl p-4 py-6 hover:bg-(--bg-secondary)" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</Button>
                <select className="border border(--border) p-2 rounded-lg" value={page} onChange={(e) => setPage(Number(e.target.value))}>
                    {[...Array(names?.total_pages)].map((_, i) => <option key={i} value={i + 1} className="bg-(--bg-primary)">{i + 1} / {names?.total_pages}</option>)}
                </select>
                <Button className="bg-(--bg-secondary) text-(--text-secondary) cursor-pointer text-xl p-4 py-6 hover:bg-(--bg-secondary)" disabled={page === names?.total_pages} onClick={() => setPage(page + 1)}>Next &gt;</Button>
            </div>
        </main>
    );
};

export default IslamicNamesPage;