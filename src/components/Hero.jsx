import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Zap, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

export default function Hero() {
    const [showModal, setShowModal] = useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-border mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-primary dark:text-yellow-400" />
                        <span className="text-sm font-medium text-muted-foreground">#1 Roblox Brainrot Сообщество</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-muted-foreground to-muted-foreground">
                            Steal a
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary neon-text">
                            Brainrot
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Где хаос встречается с комьюнити. Вступай в самый элитный чат по Roblox для общения и трейдов в Telegram.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            className="w-full sm:w-auto text-lg h-14 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-shadow duration-300"
                            onClick={() => window.open("https://t.me/TradeGameChat", "_blank")}
                        >
                            <MessageCircle className="w-5 h-5" />
                            Вступить в Чат
                        </Button>
                        <Button
                            className="w-full sm:w-auto text-lg h-14"
                            variant="secondary"
                            onClick={() => setShowModal(true)}
                        >
                            <Zap className="w-5 h-5" />
                            Узнать больше
                        </Button>
                    </div>
                </motion.div>

                {/* Floating Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Активное Комьюнити", icon: UserIcon, color: "text-blue-400", delay: 0 },
                        { title: "Безопасные Трейды", icon: Shield, color: "text-emerald-400", delay: 0.2 },
                        { title: "Поддержка 24/7", icon: Zap, color: "text-yellow-400", delay: 0.4 },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + item.delay, duration: 0.5 }}
                            className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-colors backdrop-blur-md shadow-lg dark:shadow-none"
                        >
                            <item.icon className={`w-10 h-10 mb-4 mx-auto ${item.color}`} />
                            <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                            <p className="text-muted-foreground text-sm">Лучшее общение в реальном времени.</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Info Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="О проекте"
            >
                <div className="space-y-4">
                    <p>
                        <span className="font-bold text-primary">Steal a Brainrot</span> — это не просто чат, это целая экосистема для игроков Roblox.
                    </p>
                    <p>
                        Мы создали это пространство для тех, кто устал от скучных трейд-серверов и токсичных комьюнити.
                    </p>

                    <div className="py-4">
                        <h4 className="font-bold text-lg mb-2 text-foreground">Что ты получишь?</h4>
                        <ul className="space-y-2">
                            {[
                                "🔥 Эксклюзивные трейды и сделки",
                                "🛡️ Проверенные гаранты 24/7",
                                "💬 Ламповое общение без душноты",
                                "🎁 Еженедельные розыгрыши робуксов"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                        <p className="text-sm italic text-center">
                            "Единственное место в Telegram, где твои петы в Adopt Me действительно в безопасности."
                        </p>
                    </div>

                    <Button
                        className="w-full mt-4"
                        onClick={() => window.open("https://t.me/TradeGameChat", "_blank")}
                    >
                        Погнали к нам! 🚀
                    </Button>
                </div>
            </Modal>
        </section>
    );
}

function UserIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
