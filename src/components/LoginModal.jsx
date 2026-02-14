import { useState } from "react";
import Modal from "./Modal";
import Captcha from "./Captcha";
import { Send, CheckCircle2, User } from "lucide-react";
import TelegramLoginButton from "./TelegramLoginButton";

export default function LoginModal({ isOpen, onClose, onAuth }) {
    const BOT_NAME = "BrainrotSecurityBot"; // Замените на имя вашего бота из @BotFather
    const [step, setStep] = useState(1); // 1: Captcha, 2: Telegram

    const handleCaptchaVerify = () => {
        setStep(2);
    };

    const handleTelegramAuth = (user) => {
        onAuth(user);
        onClose();
        // Reset for next time
        setTimeout(() => setStep(1), 500);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={step === 1 ? "Проверка безопасности" : "Вход через Telegram"}
        >
            <div className="py-2">
                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <Captcha onVerify={handleCaptchaVerify} />
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 text-center">
                        <div className="flex justify-center flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Send className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-foreground">Почти готово!</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Для завершения регистрации подтвердите свой аккаунт в Telegram
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-2xl border border-border space-y-4">
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <span className="text-sm">Вы подтвердили, что не являетесь роботом</span>
                            </div>

                            <div className="pt-2 flex flex-col items-center gap-4 w-full">
                                <a
                                    href={`https://t.me/${BOT_NAME}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                                >
                                    <Send className="w-5 h-5" />
                                    ОТКРЫТЬ БОТА
                                </a>

                                <button
                                    onClick={() => handleTelegramAuth({
                                        id: 12345678,
                                        first_name: "Посетитель",
                                        username: "guest_user",
                                        photo_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.random()}`
                                    })}
                                    className="w-full border border-border py-3 rounded-2xl text-sm font-medium hover:bg-muted/50 transition-colors"
                                >
                                    ПРОДОЛЖИТЬ КАК ГОСТЬ
                                </button>

                                {window.location.hostname === 'localhost' && (
                                    <button
                                        onClick={() => handleTelegramAuth({
                                            id: 8371175143, // ID владельца (пример)
                                            first_name: "Hasan",
                                            username: "Karabaev_Hasan",
                                            photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hasan"
                                        })}
                                        className="text-[10px] text-muted-foreground hover:text-primary transition-colors underline decoration-dotted"
                                    >
                                        [Dev Only] Login as Owner
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-[10px] text-muted-foreground italic px-4">
                            * После перехода в бота отправьте ему команду /start, чтобы получить доступ ко всем функциям проекта.
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
