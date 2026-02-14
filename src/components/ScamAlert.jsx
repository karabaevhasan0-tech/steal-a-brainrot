import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Search, Copy, CheckCircle, XCircle } from "lucide-react";

export default function ScamAlert() {
    return (
        <section id="scam" className="py-24 relative bg-background overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-background to-background pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                        <span className="text-sm font-bold text-red-400">Способы скама</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
                        НЕ ДАЙ СЕБЯ <br />
                        <span className="text-red-500">ЗАСКАМИТЬ</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Данная ветка создана в целях обезопасить Вас, рассказать все скам схемы и как не попасться на мошенников!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Method 1: Fake Guarantor */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 p-8 rounded-3xl bg-card border border-red-500/20 backdrop-blur-sm shadow-xl dark:shadow-none"
                    >
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <ShieldAlert className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">1. Фейк-Гарант</h3>
                                <p className="text-red-500 dark:text-red-400 font-bold tracking-wider text-sm">САМЫЙ РАСПРОСТРАНЕННЫЙ ВИД СКАМА</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm dark:shadow-none">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        Как понять что вас скамят?
                                    </h4>
                                    <ul className="space-y-3 text-muted-foreground text-sm">
                                        <li className="flex gap-2">❌ Человек очень торопит вас.</li>
                                        <li className="flex gap-2">❌ Сам предлагает гаранта и сам ему якобы "пишет".</li>
                                        <li className="flex gap-2">❌ При создании сделки гарант принимает вашу позицию первым.</li>
                                        <li className="flex gap-2">❌ У фейка в "О себе" стоит юз гаранта, а у самого юза НЕТУ!</li>
                                    </ul>
                                </div>

                                <div className="p-5 rounded-2xl bg-card border border-border shadow-sm dark:shadow-none">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                                        <Search className="w-5 h-5 text-orange-400" />
                                        Как определить фейка?
                                    </h4>
                                    <ul className="space-y-3 text-muted-foreground text-sm">
                                        <li className="flex gap-2">⚠️ Юзернейм в телеграмме. Обычно скамеры меняют I на L, либо наоборот.</li>
                                        <li className="flex gap-2">⚠️ Всегда проверяйте Био, отзывы, посты, подарки и эмодзи статус.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 h-full">
                                <h4 className="font-bold text-xl mb-6 flex items-center gap-2 text-green-400">
                                    <CheckCircle className="w-6 h-6" />
                                    Как НЕ попасться (100% способ)
                                </h4>
                                <div className="space-y-6 relative">
                                    {/* Connector Line */}
                                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-green-500/20" />

                                    <div className="relative flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 z-10 text-green-600 dark:text-green-400 font-bold border border-green-500/30">1</div>
                                        <p className="text-muted-foreground text-sm pt-1">
                                            <Copy className="inline w-4 h-4 mr-1 text-muted-foreground" />
                                            <span className="text-foreground font-medium">Копируете юзернейм</span> гаранта, который с вами в сделке.
                                        </p>
                                    </div>

                                    <div className="relative flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 z-10 text-green-600 dark:text-green-400 font-bold border border-green-500/30">2</div>
                                        <p className="text-muted-foreground text-sm pt-1">
                                            Вбиваете в поиск его юз именно в <span className="text-foreground font-medium">ЭТОЙ ветке</span> (чате). Если он есть в списке гарантов — все нормально.
                                            <br /><span className="text-red-400 font-bold block mt-1">Нету в списке = СКАМ.</span>
                                        </p>
                                    </div>

                                    <div className="relative flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 z-10 text-green-600 dark:text-green-400 font-bold border border-green-500/30">3</div>
                                        <p className="text-muted-foreground text-sm pt-1">
                                            Иногда скамеры ставят юз настоящего гаранта в <span className="text-foreground font-medium">ОПИСАНИЕ</span>. Всегда сверяйте поле "Username" (@name), а не Bio!
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-green-500/20 text-center">
                                    <p className="text-green-400 font-bold animate-pulse">
                                        Будьте бдительны! 🛡️
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
