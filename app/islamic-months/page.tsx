"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { Months } from "@/types/islamicEvents";
import { notoNaskhArabic } from "@/utils/arabicFont";
import { useQuery } from "@tanstack/react-query";

const IslamicMonth = () => {
    const axios = useAxios();
    const {data: months, isLoading: isMonthsLoading, isError: isMonthsError} = useQuery<Months[]>({
        queryKey: ["months"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/islamic-months`); 
            return data.data.months;
        }
    });
    return (
        <main className="max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-center mb-6">Islamic Months</h2>
            {isMonthsLoading && <p className="text-center text-2xl font-semibold">Loading Islamic Events...</p>}
            {isMonthsError ? <p className="text-center text-2xl font-semibold">Error loading Islamic Events</p> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {months?.map((month: Months) => <Card key={month.number} className="bg-(--card-bg) border-(--border) border size-full text-center">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {month.number}. {month.name_english} (<span className={notoNaskhArabic.className}>{month.name_arabic}</span>)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-(--text-muted)">
                        <p>{month.significance}</p>
                    </CardContent>
                </Card>)}
            </div>}
        </main>
    );
};

export default IslamicMonth;