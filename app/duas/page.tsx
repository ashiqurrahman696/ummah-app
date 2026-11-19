"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { Categories } from "@/types/dua";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const DuaCategories = () => {
    const axios = useAxios();
    const {data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError} = useQuery<Categories[]>({
        queryKey: ["categories"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/duas/categories`); 
            return data.data.categories;
        }
    });
    return (
        <main className="w-full max-w-7xl mx-auto p-4">
            <h2 className="text-4xl font-bold text-center mb-6">Duas</h2>
            {isCategoriesLoading && <p className="text-center text-2xl font-semibold">Loading dua categories...</p>}
            {isCategoriesError ? <p className="text-center text-2xl font-semibold">Error loading dua categories</p> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {categories?.map((category: Categories) => <Link href={`/duas/category/${category.id}`} key={category.id}>
                    <Card className="bg-(--card-bg) border-(--border) border w-full text-center h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-(--text-muted) space-y-3">
                            <p>{category.description}</p>
                            <p>{category.count} duas</p>
                        </CardContent>
                    </Card>
                </Link>)}
            </div>}
        </main>
    );
};

export default DuaCategories;