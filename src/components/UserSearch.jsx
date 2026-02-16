import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShieldAlert, UserCheck, Shield, User, Loader2,
    Flame, Sparkles, Zap, Ghost, Rocket, Crown, Flower2, Heart, Cherry, Moon, Sun, Leaf
} from "lucide-react";
import { cn } from "../lib/utils";

const ResultAvatar = ({ result }) => {
    const avatarData = result.avatar ? JSON.parse(result.avatar) : null;

    if (avatarData) {
        const icons = { sparkles: Sparkles, flame: Flame, zap: Zap, ghost: Ghost, rocket: Rocket, crown: Crown, flower: Flower2, heart: Heart, cherry: Cherry, moon: Moon, sun: Sun, leaf: Leaf };
        const colors = { blue: 'text-blue-500 bg-blue-500/20', purple: 'text-purple-500 bg-purple-500/20', red: 'text-red-500 bg-red-500/20', green: 'text-green-500 bg-green-500/20', yellow: 'text-yellow-500 bg-yellow-500/20', pink: 'text-pink-500 bg-pink-500/20' };

        const Icon = icons[avatarData.icon] || User;
        const colorClass = colors[avatarData.color] || colors.blue;

        return (
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-white/5", colorClass)}>
                <Icon className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
            result.status === 'scammer' ? "bg-red-500/20" : "bg-primary/20"
        )}>
            {result.status === 'scammer' ? (
                <ShieldAlert className="w-8 h-8 text-red-500" />
            ) : result.role && result.role.includes('Гарант') ? (
                <Shield className="w-8 h-8 text-primary" />
            ) : (
                <UserCheck className="w-8 h-8 text-green-500" />
            )}
        </div>
    );
};

export default function UserSearch() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            if (!query.startsWith('@') && isNaN(query)) {
                setResult({ error: "Юзернейм должен начинаться с @" });
                setLoading(false);
                return;
            }

            const username = query.trim();
            const API_BASE_URL = import.meta.env.VITE_API_URL || "https://brainrot-bot-p20j.onrender.com";
            const response = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(username)}`);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    setResult({ error: "Пользователь не найден. Он должен быть участником чата или запустить бота." });
                } else {
                    setResult({ error: data.message || "Ошибка сервера" });
                }
                return;
            }

            setResult(data);
        } catch (error) {
            console.error("Search error:", error);
            setResult({ error: "Не удалось подключиться к боту. Убедитесь, что бот запущен." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto w-full space-y-6">
            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Введите @username игрока..."
                    className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground text-lg shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Найти"}
                </button>
            </form>

            <AnimatePresence mode="wait">
                {result && result.error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-6 rounded-3xl border border-warning/30 bg-warning/5 glass text-center"
                    >
                        <ShieldAlert className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                        <p className="text-foreground font-bold">{result.error}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Проверьте правильность написания @username
                        </p>
                    </motion.div>
                ) : result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn(
                            "p-6 rounded-3xl border shadow-xl glass overflow-hidden relative",
                            result.status === 'scammer' ? "border-red-500/30 bg-red-500/5" : "border-primary/20 bg-primary/5"
                        )}
                    >
                        {/* Background Decoration */}
                        <div className={cn(
                            "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20",
                            result.status === 'scammer' ? "bg-red-500" : "bg-primary"
                        )} />

                        <div className="flex items-center gap-6 relative z-10">
                            <ResultAvatar result={result} />

                            <div className="flex-1 min-w-0">
                                <h4 className="text-xl font-bold text-foreground truncate">
                                    @{result.username}
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={cn(
                                        "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider leading-relaxed whitespace-pre-line",
                                        result.status === 'scammer'
                                            ? "bg-red-500 text-white"
                                            : "bg-primary/10 text-primary border border-primary/20"
                                    )}>
                                        {result.role || "Участник"}
                                    </span>
                                    {result.status !== 'scammer' && (
                                        <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Проверен ✅
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {result.status === 'scammer' && (
                            <div className="mt-4 p-3 bg-red-500/10 rounded-xl border border-red-500/20 flex gap-3 items-center">
                                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-sm text-red-500 font-bold">
                                    ВНИМАНИЕ: Данный пользователь находится в черном списке! Сделки проводить нельзя.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
