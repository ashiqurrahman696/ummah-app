"use client";

import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useAxios from "@/hooks/useAxios";
import { Name, Names } from "@/types/islamicNames";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
            <Pagination
                page={page}
                setPage={setPage}
                totalPages={names?.total_pages as number}
            />
        </main>
    );
};

export default IslamicNamesPage;