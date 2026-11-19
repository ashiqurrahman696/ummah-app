"use client";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button";
import { BsGear } from "react-icons/bs";
import { Label } from "./ui/label";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { getArFontSize, getReciterId, getTrFontSize, saveArFontSize, saveReciterId, saveTrFontSize } from "@/utils/localStorage";

interface Reciter {
    id: number,
    name: string,
    name_arabic: string,
    style: string
}

const Settings = () => {
    const arFontSize = getArFontSize();
    const trFontSize = getTrFontSize();
    const axios = useAxios();

    const {data: reciters, isLoading, isError} = useQuery<Reciter[]>({
        queryKey: ["reciters"],
        queryFn: async() => {
            const {data} = await axios.get(`/api/quran/reciters`); 
            return data.data.reciters;
        }
    });
    const [reciterId, setReciterId] = useState<number>(getReciterId());

    return (
        <Drawer swipeDirection="right">
            <DrawerTrigger render={<Button className="absolute bottom-4 right-4 bg-(--bg-primary)" variant="outline" />}>
                <BsGear />
            </DrawerTrigger>
            <DrawerContent className="bg-(--bg-primary)">
                <DrawerHeader>
                <DrawerTitle>Settings</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-6">
                    <div>
                        <Label htmlFor="reciters">Reciters</Label>
                        <select id="reciters" className="w-full border border(--border) p-2 rounded-lg" value={reciterId} onChange={(e) => {
                            saveReciterId(e.target.value);
                            setReciterId(Number(e.target.value));
                        }}>
                            {reciters?.map((reciter: Reciter) => <option key={reciter.id} value={reciter.id} className="bg-(--bg-primary)">{reciter.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="arFontSize">Arabic Font Size</Label>
                        <div className="flex items-center gap-4">
                            <span>12</span>
                            <input type="range" id="arFontSize" className="w-full accent-(--text-primary) bg-(--bg-secondary)" min={12} max={70} defaultValue={arFontSize} onChange={(e) => saveArFontSize(e.target.value)} />
                            <span>70</span>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="trFontSize">Translation Font Size</Label>
                        <div className="flex items-center gap-4">
                            <span>12</span>
                            <input type="range" id="trFontSize" className="w-full accent-(--text-primary) bg-(--bg-secondary)" min={12} max={50} defaultValue={trFontSize} onChange={(e) => saveTrFontSize(e.target.value)} />
                            <span>50</span>
                        </div>
                    </div>
                </div>
                {<DrawerFooter>
                    <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                </DrawerFooter>}
            </DrawerContent>
        </Drawer>
    );
};

export default Settings;