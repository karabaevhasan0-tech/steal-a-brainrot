import { motion } from "framer-motion";
import { MessageCircle, Rocket, Heart } from "lucide-react";
import Button from "./Button";

export default function Community() {
    const handleJoin = () => {
        window.open("https://t.me/TradeGameChat", "_blank");
    };

    return (
        <section id="community" className="py-24 relative overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 shadow-sm dark:shadow-none">
                        <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-sm font-medium text-muted-foreground">Любовь и Хаос</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                        Больше, чем просто чат.
                    </h2>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                        Здесь мы не просто общаемся. Мы создаем тренды, ломаем экономику игр и угараем 24/7.
                        Если ты не с нами — ты пропускаешь весь движ.
                    </p>

                    <Button
                        onClick={handleJoin}
                        className="text-lg px-8 py-6 h-auto shadow-[0_0_50px_rgba(139,92,246,0.5)] hover:shadow-[0_0_80px_rgba(139,92,246,0.7)] transition-shadow duration-300"
                    >
                        <MessageCircle className="w-6 h-6 mr-2" />
                        Залететь в Телеграм
                        <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
