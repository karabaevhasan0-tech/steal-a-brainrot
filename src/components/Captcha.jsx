import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

export default function Captcha({ onVerify }) {
    const [status, setStatus] = useState("idle"); // idle, verifying, success
    const [challenge, setChallenge] = useState({ a: 0, b: 0 });
    const [inputValue, setInputValue] = useState("");

    const generateChallenge = () => {
        setChallenge({
            a: Math.floor(Math.random() * 10) + 1,
            b: Math.floor(Math.random() * 10) + 1
        });
        setInputValue("");
        setStatus("idle");
    };

    useEffect(() => {
        generateChallenge();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = parseInt(inputValue);
        if (result === challenge.a + challenge.b) {
            setStatus("verifying");
            setTimeout(() => {
                setStatus("success");
                setTimeout(() => {
                    onVerify(true);
                }, 800);
            }, 1000);
        } else {
            // Shake effect or just reset
            generateChallenge();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Подтвердите, что вы не робот</span>
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-muted/30 rounded-2xl border border-border space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-mono">
                        Сколько будет {challenge.a} + {challenge.b}?
                    </span>
                    <button
                        type="button"
                        onClick={generateChallenge}
                        className="p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ваш ответ"
                        disabled={status !== "idle"}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-xl font-bold"
                        autoFocus
                    />
                    {status === "success" && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-1"
                        >
                            <Check className="w-4 h-4 text-white" />
                        </motion.div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status !== "idle" || !inputValue}
                    className={cn(
                        "w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
                        status === "success"
                            ? "bg-green-500 text-white"
                            : status === "verifying"
                                ? "bg-primary/50 text-white cursor-wait"
                                : "bg-primary text-white hover:shadow-lg hover:shadow-primary/30"
                    )}
                >
                    {status === "verifying" ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : status === "success" ? (
                        "Проверка пройдена"
                    ) : (
                        "Проверить"
                    )}
                </button>
            </form>
        </div>
    );
}
