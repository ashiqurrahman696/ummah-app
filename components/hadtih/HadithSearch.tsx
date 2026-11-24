import { Collections, Hadith, Search } from "@/types/hadith";
import { notoNaskhArabic } from "@/utils/arabicFont";import { getArFontSize, getTrFontSize } from "@/utils/localStorage";
import { Dispatch, SetStateAction } from "react";

const arFontSize = getArFontSize();
const trFontSize = getTrFontSize();

const HadithSearch = ({collections, isSearchedHadithsLoading, isSearchedHadithsError, selectedCollection, query, setQuery, setSelectedCollection, searchedHadiths}: {collections: Collections[], isSearchedHadithsLoading: boolean, isSearchedHadithsError: boolean, selectedCollection: string, query: string, setQuery: Dispatch<SetStateAction<string>>, setSelectedCollection: Dispatch<SetStateAction<string>>, searchedHadiths: Search}) => {
    return (
        <>
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
            {isSearchedHadithsError ? <p className="text-center text-2xl font-semibold">{query || "Please write something to search"}</p> : <>
                {searchedHadiths?.hadiths?.length !== 0 ? searchedHadiths?.hadiths.map((hadith: Hadith) => <div key={hadith.id} className="w-full">
                    <p dir="rtl" className={`leading-loose ${notoNaskhArabic.className}`} style={{ 
                        fontSize: `${arFontSize}px`
                    }}>{hadith.arabic.replaceAll("ٱ", "ا")}</p>
                    <p className="text-(--text-secondary) my-2" style={{ 
                        fontSize: `${trFontSize}px`
                    }}>{hadith.english}</p>
                    <p className="italic text-(--text-muted) mb-2">{hadith.collection_name}: {hadith.hadithnumber}</p>
                    <hr className="bg-(--foreground) mb-2" />
                </div>) : <p className="text-center text-2xl font-semibold">No results for &quot;{query}&quot;</p>}
            </>}
        </>
    );
};

export default HadithSearch;