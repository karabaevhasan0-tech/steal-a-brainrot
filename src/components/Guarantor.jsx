import { motion } from "framer-motion";
import { Shield, Lock, ArrowRightLeft, UserCheck, CheckCircle2 } from "lucide-react";

export default function Guarantor() {
    return (
        <section id="guarantor" className="py-24 relative bg-zinc-900 overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                        <Shield className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-green-400">Anti-Scam Protection</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6">
                        КТО ТАКОЙ <span className="text-primary">ГАРАНТ?</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Твой личный щит от скамеров и крыс. Узнай, почему это база для любого адекватного трейдера.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Visual Flow */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-green-500/20 rounded-3xl blur-2xl" />
                        <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8">
                            {/* Step 1 */}
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5">
                                    <span className="text-2xl">😎</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Ты (Продавец)</h4>
                                    <p className="text-zinc-500 text-sm">Продаешь редкую ауру</p>
                                </div>
                            </div>

                            {/* Arrow Down */}
                            <div className="flex justify-center -my-2">
                                <ArrowRightLeft className="w-8 h-8 text-zinc-600 rotate-90" />
                            </div>

                            {/* Middle - Guarantor */}
                            <div className="flex items-center gap-6 bg-primary/10 p-4 rounded-2xl border border-primary/20">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                                    <Shield className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-primary font-bold text-lg">ГАРАНТ</h4>
                                    <p className="text-zinc-400 text-sm">Держит деньги и подтверждает сделку.</p>
                                </div>
                            </div>

                            {/* Arrow Down */}
                            <div className="flex justify-center -my-2">
                                <ArrowRightLeft className="w-8 h-8 text-zinc-600 rotate-90" />
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/5">
                                    <span className="text-2xl">🤑</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Покупатель</h4>
                                    <p className="text-zinc-500 text-sm">Переводит деньги гаранту</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 15 Points List (Condensed/Grouped) */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Lock className="text-primary" />
                                Как это работает?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Гарант — это третий человек, которому доверяют оба.</span>
                                </li>
                                <li className="flex gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Покупатель кидает деньги **Гаранту**, а не тебе.</span>
                                </li>
                                <li className="flex gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Гарант подтверждает получение средств, давая отмашку.</span>
                                </li>
                                <li className="flex gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span>Ты передаешь предмет. Гарант переводит тебе деньги.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4 mt-8">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <UserCheck className="text-primary" />
                                Почему это безопасно?
                            </h3>
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-zinc-300 text-sm">
                                    <span className="text-red-400 font-bold block mb-1">🚫 Убивает схему "Скину потом"</span>
                                    Если покупатель решит включить "режим крысы" и не платить — гарант просто вернет всё назад. Никто не пострадает.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <p className="text-zinc-300 text-sm">
                                    <span className="text-green-400 font-bold block mb-1">✅ Признак Адеквата</span>
                                    В комьюнити Steal a Brainrot работа через гаранта — это база. За безопасность гарант берет чисто символический %.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
