import Modal from "./Modal";
import { User, Shield, Calendar, Award, Star } from "lucide-react";
import { cn } from "../lib/utils";

export default function ProfileModal({ isOpen, onClose, user }) {
    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Мой Аккаунт">
            <div className="space-y-8 py-4">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        {user.photo_url ? (
                            <img
                                src={user.photo_url}
                                alt={user.first_name}
                                className="w-24 h-24 rounded-full border-4 border-primary/20 shadow-xl"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                                <User className="w-12 h-12 text-primary" />
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-1.5 rounded-full shadow-lg">
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground">
                            {user.first_name} {user.last_name || ""}
                        </h3>
                        <p className="text-sm text-primary font-medium">@{user.username || "user"}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border flex flex-col items-center justify-center gap-1 text-center">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">Роль</span>
                        <span className="font-bold text-sm leading-tight text-foreground whitespace-pre-line">
                            {user.role || "Участник"}
                        </span>
                    </div>
                    <div className="bg-muted/40 p-4 rounded-2xl border border-border flex flex-col items-center justify-center gap-1">
                        <Award className="w-5 h-5 text-accent" />
                        <span className="text-xs text-muted-foreground">Доверие</span>
                        <span className={cn(
                            "font-bold",
                            user.status === 'scammer' ? "text-red-500" : "text-green-500"
                        )}>
                            {user.status === 'scammer' ? "0%" : "100%"}
                        </span>
                    </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4 bg-muted/20 p-6 rounded-3xl border border-border">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Проверка</span>
                        </div>
                        <span className={cn(
                            "font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-full",
                            user.status === 'scammer' ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                        )}>
                            {user.status === 'scammer' ? "В черном списке" : "Проверен"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>ID</span>
                        </div>
                        <span className="font-mono text-xs">{user.id}</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-muted-foreground italic">
                        Данные аккаунта синхронизированы с вашим профилем в Telegram
                    </p>
                </div>
            </div>
        </Modal>
    );
}
