"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dotMenuOpen, setDotMenuOpen] = useState(false);
    const dotMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Close dot menu when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dotMenuRef.current &&
                !dotMenuRef.current.contains(e.target as Node)
            ) {
                setDotMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const allLinks = [
        { name: "Home", path: "/" },
        { name: "Quran", path: "/quran" },
        { name: "Hadith", path: "/hadith" },
        { name: "Duas", path: "/duas" },
        { name: "Prayer Time", path: "/prayer-time" },
        { name: "Asmaul Husna", path: "/asmaul-husna" },
        { name: "Islamic Names", path: "/islamic-names" },
        { name: "Islamic Events", path: "/islamic-events" },
    ];


    // Tablet: always-visible links
    const tabletPrimary = [
        { name: "Home", path: "/" },
        { name: "Quran", path: "/quran" },
        { name: "Hadith", path: "/hadith" },
        { name: "Duas", path: "/duas" },
    ];

    // Tablet: overflow links in 3-dot menu
    const tabletSecondary = allLinks.filter(
        (l) => !tabletPrimary.some((p) => p.path === l.path),
    );

    const activeCls =
        "border-b-2 border-(--border-highlight) font-bold px-2.5 py-1.5 rounded-lg text-(--primary) text-sm";
    const normalCls =
        "hover:text-r(--primary) px-2.5 py-1.5 rounded-lg transition-colors text-sm font-medium";
    const linkCls = (path: string) => (pathname === path ? activeCls : normalCls);

    return (
        <nav className="bg-(--bg-nav-footer) sticky top-0 z-50 shadow-md">
            <div className="flex items-center justify-between px-4 py-2 mx-auto max-w-7xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 my-2 shrink-0">
                    <Image src="/assets/logo.png" alt="Logo" className="w-20" width={80} height={80} />
                    <span className="text-3xl font-bold">Ummah</span>
                </Link>

                {/* ── DESKTOP (lg+): all links ── */}
                <ul className="hidden lg:flex gap-0.5 items-center">
                {allLinks.map((link) => (
                    <li key={link.path}>
                        <Link href={link.path} className={linkCls(link.path)}>
                            {link.name}
                        </Link>
                    </li>
                ))}
                </ul>

                {/* ── TABLET (md → lg): primary links + ⋯ button ── */}
                <div className="hidden md:flex lg:hidden items-center gap-0.5">
                {tabletPrimary.map((link) => (
                    <Link
                    key={link.path}
                    href={link.path}
                    className={linkCls(link.path)}
                    >
                        {link.name}
                    </Link>
                ))}

                {tabletSecondary.length > 0 && (
                    <div className="relative ml-1" ref={dotMenuRef}>
                    <button
                        onClick={() => setDotMenuOpen((o) => !o)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                        style={{
                        color: dotMenuOpen
                            ? "var(--primary)"
                            : "var(--text-secondary)",
                        background: dotMenuOpen
                            ? "var(--bg-secondary)"
                            : "transparent",
                        }}
                        aria-label="More navigation links"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    <AnimatePresence>
                        {dotMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: -4 }}
                            transition={{
                            duration: 0.16,
                            ease: [0.22, 1, 0.36, 1] as [
                                number,
                                number,
                                number,
                                number,
                            ],
                            }}
                            className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                            background: "var(--bg-secondary)",
                            border: "1px solid var(--border-color)",
                            zIndex: 100,
                            }}
                        >
                            <div className="py-2">
                            {tabletSecondary.map((link, i) => {
                                const isActive = pathname === link.path;
                                return (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Link
                                    href={link.path}
                                    onClick={() => setDotMenuOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-primary)]"
                                    style={{
                                        color: isActive
                                        ? "var(--primary)"
                                        : "var(--text-primary)",
                                        fontWeight: isActive ? 700 : 500,
                                    }}
                                    >
                                    {isActive && (
                                        <span
                                        className="w-1.5 h-1.5 rounded-full shrink-0"
                                        style={{ background: "var(--primary)" }}
                                        />
                                    )}
                                    {link.name}
                                    </Link>
                                </motion.div>
                                );
                            })}
                            </div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                )}
                </div>

                {/* Right: theme toggle + CTA + mobile burger */}
                <div className="flex items-center gap-2 shrink-0">
                <ThemeToggle />

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-2xl p-1 transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ color: "var(--text-primary)" }}
                >
                    {mobileOpen ? <FiX /> : <FiMenu />}
                </button>
                </div>
            </div>

            {/* ── MOBILE drawer (< md) ── */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: mobileOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 z-50 w-64 h-full shadow-2xl md:hidden"
                style={{
                backgroundColor: "var(--bg-nav-footer)",
                borderLeft: "1px solid var(--border-color)",
                }}
            >
                <div className="flex justify-end p-6">
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="text-2xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="flex flex-col px-6 space-y-1 text-sm">
                {allLinks.map((link) => (
                    <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`font-medium transition px-3 py-2.5 rounded-xl ${
                        pathname === link.path
                        ? "text-[var(--primary)] bg-[var(--bg-secondary)] font-bold"
                        : "text-[var(--text-primary)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                    >
                    {link.name}
                    </Link>
                ))}
                </div>
            </motion.div>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                />
            )}
        </nav>
    );
};

export default Navbar;