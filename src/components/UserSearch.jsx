import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, UserCheck, Shield, User, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function UserSearch() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            const username = query.replace('@', '');
            const response = await fetch(`http://localhost:3001/api/user/${username}`);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Search error:", error);
            setResult({ error: "Не удалось получить данные от бота" });
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
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                                result.status === 'scammer' ? "bg-red-500/20" : "bg-primary/20"
                            )}>
                                {result.status === 'scammer' ? (
                                    <ShieldAlert className="w-8 h-8 text-red-500" />
                                ) : result.role === 'Гарант 🛡️' ? (
                                    <Shield className="w-8 h-8 text-primary" />
                                ) : (
                                    <UserCheck className="w-8 h-8 text-green-500" />
                                )}
                            </div>

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
