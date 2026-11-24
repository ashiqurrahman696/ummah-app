import { Collections } from "@/types/hadith";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { notoNaskhArabic } from "@/utils/arabicFont";

const CollectionsTab = ({isCollectionsLoading, isCollectionsError, collections}: {isCollectionsLoading: boolean, isCollectionsError: boolean, collections: Collections[]}) => {
    return (
        <>
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
        </>
    );
};

export default CollectionsTab;