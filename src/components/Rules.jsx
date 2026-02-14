import { motion } from "framer-motion";
import { Shield, AlertTriangle, Gavel, CheckCircle } from "lucide-react";
import rulesImage from "../assets/rules-image.jpg";

export default function Rules() {
    return (
        <section id="rules" className="py-24 relative bg-background transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-red-500">🚫</span> НАРУШАЕШЬ — ОТВЕЧАЕШЬ
                    </h2>
                    <p className="text-muted-foreground">Правила созданы, чтобы их не нарушать.</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Rules Text Content */}
                    <div className="flex-1 space-y-8 w-full">

                        {/* Main Rules */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-card border border-border shadow-lg dark:shadow-none"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="text-primary w-6 h-6" />
                                <h3 className="text-xl font-bold text-foreground">Правила Roblox Trade Чата</h3>
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex gap-2"><span className="text-primary">▫️</span> Трейды только по Roblox</li>
                                <li className="flex gap-2"><span className="text-red-400">▫️</span> Спам / флуд / реклама — ❌</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">▫️</span> Скам — БАН навсегда</li>
                                <li className="flex gap-2"><span className="text-orange-400">▫️</span> Оскорбления — мут → бан</li>
                                <li className="flex gap-2"><span className="text-red-400">▫️</span> 18+, политика, дискриминация — ❌</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">▫️</span> Выдача себя за админа — БАН</li>
                                <li className="flex gap-2"><span className="text-red-500 font-bold">▫️</span> Отказ от гаранта — БАН</li>
                            </ul>
                        </motion.div>

                        {/* Administration */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-6 rounded-2xl bg-card border border-border shadow-lg dark:shadow-none"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Gavel className="text-yellow-400 w-6 h-6" />
                                <h3 className="text-xl font-bold text-foreground">АДМИНИСТРАЦИЯ</h3>
                            </div>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex gap-2">👑 Админ всегда прав</li>
                                <li className="flex gap-2">⛔ Причины мутов могут не объясняться</li>
                                <li className="flex gap-2">🔄 Правила меняются без предупреждения</li>
                            </ul>
                        </motion.div>

                        {/* Complaints */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="text-red-500 w-6 h-6" />
                                <h3 className="text-xl font-bold text-red-400">ЖАЛОБЫ / СКАМ</h3>
                            </div>
                            <p className="text-muted-foreground">📩 Пингуй <span className="text-primary font-mono">@admin</span></p>
                        </motion.div>

                        <p className="text-center text-green-400 font-medium pt-4">
                            💚 Безопасный трейд = честная игра 🎮
                        </p>

                    </div>

                    {/* Image */}
                    <div className="flex-1 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl glass"
                        >
                            <img
                                src={rulesImage}
                                alt="Правила Чата"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <p className="text-sm text-muted-foreground text-center">
                                        Ознакомься с правилами перед вступлением.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
