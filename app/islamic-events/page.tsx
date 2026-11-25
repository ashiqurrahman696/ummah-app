"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { Event, Events, Months } from "@/types/islamicEvents";
import { useQuery } from "@tanstack/react-query";

const IslamicEvents = () => {
    const axios = useAxios();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const {data: months, isLoading: isMonthsLoading, isError: isMonthsError} = useQuery<Months[]>({
        queryKey: ["months"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/islamic-months`); 
            return data.data.months;
        }
    });
    const {data: events, isLoading: isEventsLoading, isError: isEventsError} = useQuery<Events>({
        queryKey: ["events"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/islamic-events?timezone=${tz}`); 
            return data.data;
        }
    });
    return (
        <main className="max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-center mb-6">Islamic Events</h2>
            <p className="text-lg text-(--text-secondary) mb-4 text-center"><strong>Today:</strong> {events?.current_hijri_date.gregorian.formatted} ({events?.current_hijri_date.hijri.formatted})</p>
            <p className="text-lg text-(--text-secondary) mb-4 text-center"><strong>Next Event:</strong> {events?.next_event.name} ({events?.next_event.hijri_date})</p>
            {isEventsLoading && <p className="text-center text-2xl font-semibold">Loading Islamic Events...</p>}
            {isEventsError ? <p className="text-center text-2xl font-semibold">Error loading Islamic Events</p> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {events?.events?.map((event: Event, i: number) => <Card key={i} className="bg-(--card-bg) border-(--border) border size-full text-center">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {event.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-(--text-muted) space-y-2">
                        <p><strong>Date:</strong> {event.day} {months?.[event.month - 1].name_english}</p>
                        <p>{event.description}</p>
                    </CardContent>
                </Card>)}
            </div>}
        </main>
    );
};

export default IslamicEvents;