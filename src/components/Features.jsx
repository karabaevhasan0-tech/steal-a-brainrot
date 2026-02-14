import { motion } from "framer-motion";
import { Gamepad2, Coins, Users, Gift } from "lucide-react";

const features = [
    {
        icon: Gamepad2,
        title: "Эксклюзивные Brainrot Игры",
        description: "Доступ к приватным серверам и кастомным режимам игры, доступным только участникам."
    },
    {
        icon: Coins,
        title: "Торговая Площадка",
        description: "Безопасные и проверенные каналы для трейдов. Никакого скама. Сохрани свой лут."
    },
    {
        icon: Gift,
        title: "Еженедельные Конкурсы",
        description: "Каждую неделю мы проводим масштабные конкурсы на робуксы, бреинротов и эксклюзивные предметы."
    },
    {
        icon: Users,
        title: "Живое Сообщество",
        description: "Присоединяйся к тысячам активных игроков. Находи друзей, создавай сквады и доминируй."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative bg-background transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Функции Чата</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Все что нужно для комфортного общения и трейдинга в одном месте.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-2xl glass hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
