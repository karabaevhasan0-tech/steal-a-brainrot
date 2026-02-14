import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqData = [
    {
        question: "Сколько стоит гарант?",
        answer: "Стоимость услуг гаранта варьируется от 650 до 1500 рублей, в зависимости от суммы сделки и сложности операции. Это небольшая плата за 100% безопасность ваших средств и нервов."
    },
    {
        question: "Продажа рекламы?",
        answer: "Хочешь пропиарить свой канал или шоп? У нас лучшие цены:\n• 24 часа — 500р\n• 3 дня — 1000р\nПиши админам для покупки."
    },
    {
        question: "Сколько стоит стажерство?",
        answer: "Стажерство в нашей команде стоит от 200 до 500 рублей. Это отличный шанс попробовать себя в роли администратора, научиться проводить сделки и заработать репутацию в комьюнити."
    },
    {
        question: "Что делать если заскамили?",
        answer: "1. Не паникуйте и НЕ удаляйте переписку.\n2. Сделайте скриншоты всего: профиля скамера, переписки, чеков перевода.\n3. Срочно пишите главному админу или в ветку 'Жалобы'.\n4. Если гарант был из нашего списка — мы разберемся. Если вы пошли без гаранта — это урок на будущее."
    },
    {
        question: "Какие способы оплаты?",
        answer: "Мы принимаем:\n• Узбекские сумы (UZS)\n• Telegram Stars (Звезды) ⭐️\n• Доллары ($)\n• Робуксы\n• Редкие Brainrot-петы\nУточняйте актуальный курс и реквизиты у гаранта."
    }
];

export default function FAQ() {
    return (
        <section id="faq" className="py-24 relative bg-background">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                        <HelpCircle className="text-primary w-10 h-10" />
                        Частые Вопросы
                    </h2>
                    <p className="text-muted-foreground">Всё, что ты хотел узнать, но боялся спросить.</p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <FAQItem key={index} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ item }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-border rounded-2xl overflow-hidden bg-card"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-lg font-bold text-foreground">{item.question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-muted-foreground leading-relaxed whitespace-pre-line">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
