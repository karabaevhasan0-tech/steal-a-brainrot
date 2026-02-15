import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle, LogOut, Menu, X, Sun, Moon, User,
    Flame, Sparkles, Zap, Ghost, Rocket, Crown, Flower2, Heart, Cherry, Leaf
} from "lucide-react";
import Button from "./Button";
import { cn } from "../lib/utils";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";

const UserAvatar = ({ user, className }) => {
    if (!user) return null;
    const avatarData = user.avatar ? JSON.parse(user.avatar) : null;

    if (user.photo_url && !avatarData) {
        return <img src={user.photo_url} alt={user.first_name} className={cn("rounded-full object-cover", className)} />;
    }

    const icons = { sparkles: Sparkles, flame: Flame, zap: Zap, ghost: Ghost, rocket: Rocket, crown: Crown, flower: Flower2, heart: Heart, cherry: Cherry, moon: Moon, sun: Sun, leaf: Leaf };
    const colors = { blue: 'text-blue-500 bg-blue-500/20', purple: 'text-purple-500 bg-purple-500/20', red: 'text-red-500 bg-red-500/20', green: 'text-green-500 bg-green-500/20', yellow: 'text-yellow-500 bg-yellow-500/20', pink: 'text-pink-500 bg-pink-500/20' };

    const data = avatarData || { icon: 'sparkles', color: 'blue' };
    const Icon = icons[data.icon] || User;
    const colorClass = colors[data.color] || colors.blue;

    return (
        <div className={cn("rounded-xl flex items-center justify-center border border-white/10", colorClass, className)}>
            <Icon className="w-[60%] h-[60%]" />
        </div>
    );
};

export default function Navbar() {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("brainrot_user_data");
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Автоматическое обновление данных и вход по ссылке
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const authId = urlParams.get('auth');

        if (authId) {
            // Если есть auth в ссылке — входим автоматически
            handleTelegramAuth({ username: authId, first_name: authId });
            // Убираем параметр из URL для красоты
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (user) {
            // Если уже залогинены — обновляем данные
            handleTelegramAuth(user);
        }
    }, []);

    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('brainrot_theme');
            if (saved) {
                return saved === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true; // Default to dark
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('brainrot_theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('brainrot_theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
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


    const handleTelegramAuth = async (userData) => {
        console.log("Telegram Auth Success:", userData);

        try {
            // Fetch role/status from our bot API
            const username = userData.username || userData.first_name;
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
            const response = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(username)}`);
            const apiData = await response.json();

            // Merge Telegram data with our Bot DB data
            const fullUserData = { ...userData, ...apiData };

            localStorage.setItem("brainrot_user_data", JSON.stringify(fullUserData));
            setUser(fullUserData);
        } catch (error) {
            console.error("Error fetching user role:", error);
            // Fallback to basic telegram data if API is down
            localStorage.setItem("brainrot_user_data", JSON.stringify(userData));
            setUser(userData);
        }
    };

    const handleLogout = (e) => {
        e.stopPropagation();
        localStorage.removeItem("brainrot_user_data");
        setUser(null);
    };

    const navLinkClass = (section) => cn(
        "transition-colors duration-300 relative",
        activeSection === section
            ? "text-primary font-medium"
            : "hover:text-primary text-foreground/80"
    );

    return (
        <>
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

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted dark:hover:bg-muted transition-colors text-foreground"
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <AnimatePresence mode="wait">
                            {user ? (
                                <motion.div
                                    key="logged-in"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-3 bg-muted/50 pl-2 pr-4 py-1.5 rounded-full border border-border cursor-pointer hover:bg-muted/80 transition-all"
                                    onClick={() => setIsProfileModalOpen(true)}
                                >
                                    <UserAvatar user={user} className="w-8 h-8 rounded-[10px]" />
                                    <span className="font-medium text-sm text-foreground">
                                        {user.username ? `@${user.username}` : user.first_name}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-red-400 ml-1"
                                        title="Выйти"
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
                                    className="flex items-center"
                                >
                                    <Button
                                        onClick={() => setIsLoginModalOpen(true)}
                                        variant="primary"
                                        className="rounded-full px-6 py-2 shadow-lg shadow-primary/20"
                                    >
                                        Войти
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Toggle & Theme */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted dark:hover:bg-muted transition-colors text-foreground"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

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
                                {user ? (
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={() => {
                                                setIsProfileModalOpen(true);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <UserAvatar user={user} className="w-9 h-9 rounded-xl" />
                                            <span className="font-mono text-accent">
                                                {user.username ? `@${user.username}` : user.first_name}
                                            </span>
                                        </div>
                                        <Button onClick={(e) => { handleLogout(e); setIsMenuOpen(false); }} variant="ghost" className="text-red-400">Выйти</Button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center w-full">
                                        <Button
                                            onClick={() => {
                                                setIsLoginModalOpen(true);
                                                setIsMenuOpen(false);
                                            }}
                                            variant="primary"
                                            className="w-full rounded-xl py-3"
                                        >
                                            Войти через Telegram
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Modals */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onAuth={handleTelegramAuth}
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onUpdate={setUser}
            />
        </>
    );
}
