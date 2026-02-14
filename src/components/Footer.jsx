import { MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-border bg-muted transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-8">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-primary" />
                        <span className="font-bold text-lg">Steal a Brainrot</span>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 hover:text-blue-400 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="w-full border-t border-white/10 pt-8 text-center">
                    <p className="text-muted-foreground text-sm mb-4">© {new Date().getFullYear()} Steal a Brainrot. Все права защищены.</p>

                    {/* Creator Credit - HUGE */}
                    <div className="p-6 rounded-2xl bg-card border border-border shadow-xl inline-block">
                        <p className="text-muted-foreground text-sm mb-2 uppercase tracking-widest font-bold">Сайт разработан создателем чата</p>
                        <a
                            href="https://t.me/Karabaev_Hasan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 hover:from-primary hover:to-primary transition-all duration-300 block"
                        >
                            BY @Karabaev_Hasan
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
