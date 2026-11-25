import Settings from "@/components/Settings";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const cards = [
  {
    title: "Quran", href: "/quran"
  },
  {
    title: "Hadith", href: "/hadith"
  },
  {
    title: "Duas", href: "/duas"
  },
  {
    title: "Prayer Time", href: "/prayer-time"
  },
  {
    title: "99 Names of Allah", href: "/asmaul-husna"
  },
  {
    title: "Islamic Names", href: "/islamic-names"
  },
  {
    title: "Islamic Months", href: "/islamic-months"
  },
  {
    title: "Islamic Events", href: "/islamic-events"
  },
];

export default function Home() {
  return (
    <main className="max-w-7xl w-full mx-auto p-4 space-y-8 text-center">
      <h1 className="text-5xl font-bold">Ummah</h1>
      <p className="text-lg text-(--text-secondary)">Your whole islamic life in one place. Quran, Hadith, Tafsir, Prayer time, Dua, and more.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {cards.map((card, i) => <Link href={card.href} key={i}>
          <Card className="bg-(--card-bg) border-(--border) border size-full">
            <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
          </Card>
        </Link>)}
      </div>
      <Settings />
    </main>
  );
}