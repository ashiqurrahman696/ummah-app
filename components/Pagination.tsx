import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

const Pagination = ({page, setPage, totalPages}: {page: number, setPage: Dispatch<SetStateAction<number>>, totalPages: number}) => {
    return (
        <div className="flex gap-4 items-center justify-center">
            <Button className="bg-(--bg-secondary) text-(--text-secondary) cursor-pointer text-xl p-4 py-6 hover:bg-(--bg-secondary)" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</Button>
            <select className="border border(--border) p-2 rounded-lg" value={page} onChange={(e) => setPage(Number(e.target.value))}>
                {[...Array(totalPages)].map((_, i) => <option key={i} value={i + 1} className="bg-(--bg-primary)">{i + 1} / {totalPages}</option>)}
            </select>
            <Button className="bg-(--bg-secondary) text-(--text-secondary) cursor-pointer text-xl p-4 py-6 hover:bg-(--bg-secondary)" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next &gt;</Button>
        </div>
    );
};

export default Pagination;