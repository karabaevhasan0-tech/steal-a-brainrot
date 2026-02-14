import { motion } from "framer-motion";
import { Users, Sparkles, Zap } from "lucide-react";

export default function About() {
    return (
        <section id="about" className="py-24 relative overflow-hidden bg-background transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                                Кто Мы Такие?
                                <br />
                                <span className="text-primary">Steal a Brainrot</span>
                            </h2>

                            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                Мы — самое быстрорастущее сообщество по Roblox в Telegram. Наша цель — объединить игроков, трейдеров и любителей бреинрота в одном месте.
                            </p>

                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Здесь нет скучных правил. Мы создаем хаос, веселье и возможности для каждого. От новичка до про-трейдера — здесь каждый найдет свой сквад.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl bg-card border border-border shadow-sm dark:shadow-none">
                                    <h4 className="text-3xl font-bold text-accent mb-1">24/7</h4>
                                    <p className="text-sm text-muted-foreground">Актив</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Content */}
                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 p-8 rounded-3xl glass neon-box rotate-3 hover:rotate-0 transition-transform duration-500 bg-card/80"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                                    <Sparkles className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-foreground">Элита Роблокса</h3>
                                    <p className="text-xs text-muted-foreground">Только лучшие</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { icon: Zap, text: "Мгновенные трейды", color: "text-yellow-400" },
                                    { icon: Users, text: "Дружные админы", color: "text-green-400" },
                                    { icon: Sparkles, text: "Уникальный вайб", color: "text-purple-400" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                        <span className="font-medium text-foreground">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Visual Backdrops */}
                        <div className="absolute top-10 -right-10 w-full h-full rounded-3xl border-2 border-dashed border-white/10 z-0 rotate-6" />
                    </div>

                </div>
            </div>
        </section>
    );
}
