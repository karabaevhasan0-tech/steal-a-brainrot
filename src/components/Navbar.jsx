import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, User, LogOut, Menu, X } from "lucide-react";
import Button from "./Button";
import { cn } from "../lib/utils";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        // Auth Check
        const storedUser = localStorage.getItem("brainrot_user");
        if (storedUser) {
            setIsLoggedIn(true);
            setUsername(storedUser);
        }

        // Theme Check - Enforce Dark
        document.documentElement.classList.add("dark");

        // Scroll Spy / Active Section Observer (BoundingRect Logic)
        const handleScroll = () => {
            // Correct Order based on App.jsx
            const sections = ["features", "community", "rules", "guarantor", "scam", "faq", "about"];

            // Middle of the viewport
            const triggerPoint = window.innerHeight / 2;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();

                    // If the section top is above the middle, and bottom is below the middle
                    // OR if the section top is close to the middle (entering)
                    if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Trigger once on mount
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const handleLogin = () => {
        const name = "BrainrotFan_" + Math.floor(Math.random() * 1000);
        localStorage.setItem("brainrot_user", name);
        setIsLoggedIn(true);
        setUsername(name);
    };

    const handleLogout = () => {
        localStorage.removeItem("brainrot_user");
        setIsLoggedIn(false);
        setUsername("");
    };

    const navLinkClass = (section) => cn(
        "transition-colors duration-300 relative",
        activeSection === section
            ? "text-primary font-medium"
            : "hover:text-primary text-foreground/80"
    );

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-8 h-8 text-secondary animate-pulse" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent neon-text">
                        Steal a Brainrot
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <a href="#features" className={navLinkClass("features")}>
                        Функции
                        {activeSection === "features" && (
                            <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </a>
                    <a href="#guarantor" className={navLinkClass("guarantor")}>
                        Гаранты
                        {activeSection === "guarantor" && (
                            <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500 rounded-full" />
                        )}
                    </a>
                    <a href="#rules" className={navLinkClass("rules")}>
                        Правила
                        {activeSection === "rules" && (
                            <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </a>
                    <a href="#scam" className={cn(navLinkClass("scam"), activeSection === "scam" ? "text-red-500" : "hover:text-red-400 text-red-500/80")}>
                        Анти-Скам
                        {activeSection === "scam" && (
                            <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
                        )}
                    </a>
                    <a href="#faq" className={navLinkClass("faq")}>
                        FAQ
                        {activeSection === "faq" && (
                            <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </a>
                    <a href="https://t.me/TradeGameChat" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-foreground/80">Сообщество</a>
                    <a href="#about" className={navLinkClass("about")}>
                        О нас
                        {activeSection === "about" && (
                            <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </a>


                    <AnimatePresence mode="wait">
                        {isLoggedIn ? (
                            <motion.div
                                key="logged-in"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-full border border-black/10 dark:border-white/10"
                            >
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-accent" />
                                    <span className="font-mono text-sm text-accent">{username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-red-400"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logged-out"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Button onClick={handleLogin} variant="primary" className="text-sm py-2 px-4 shadow-none">
                                    Войти (Тест)
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">

                    <button
                        className="text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-white/10 mt-4 rounded-b-xl"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className={cn("text-lg", activeSection === "features" ? "text-primary" : "text-foreground")}>Функции</a>
                            <a href="#guarantor" onClick={() => setIsMenuOpen(false)} className={cn("text-lg", activeSection === "guarantor" ? "text-green-400" : "text-foreground")}>Гаранты</a>
                            <a href="#rules" onClick={() => setIsMenuOpen(false)} className={cn("text-lg", activeSection === "rules" ? "text-primary" : "text-foreground")}>Правила</a>
                            <a href="#scam" onClick={() => setIsMenuOpen(false)} className={cn("text-lg", activeSection === "scam" ? "text-red-500" : "text-red-500/80")}>Анти-Скам</a>
                            <a href="#faq" onClick={() => setIsMenuOpen(false)} className={cn("text-lg", activeSection === "faq" ? "text-primary" : "text-foreground")}>FAQ</a>
                            <a href="https://t.me/TradeGameChat" target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="text-lg text-foreground hover:text-primary">Сообщество</a>
                            <a href="#about" onClick={() => setIsMenuOpen(false)} className={cn("text-lg", activeSection === "about" ? "text-primary" : "text-foreground")}>О нас</a>
                            <div className="h-px bg-white/10 my-2" />
                            {isLoggedIn ? (
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-accent">{username}</span>
                                    <Button onClick={handleLogout} variant="ghost" className="text-red-400">Выйти</Button>
                                </div>
                            ) : (
                                <Button onClick={handleLogin} variant="primary" className="w-full justify-center">
                                    Войти (Тест)
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
