import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";
import {
    User, Shield, Calendar, Award, Star,
    Flame, Sparkles, Zap, Ghost, Rocket,
    Crown, Moon, Sun, Flower2, Heart,
    Palette, Check, Loader2, Cherry, Leaf, ShieldAlert
} from "lucide-react";
import { cn } from "../lib/utils";

const AVATAR_ICONS = [
    { id: 'sparkles', icon: Sparkles },
    { id: 'flame', icon: Flame },
    { id: 'zap', icon: Zap },
    { id: 'ghost', icon: Ghost },
    { id: 'rocket', icon: Rocket },
    { id: 'crown', icon: Crown },
    { id: 'flower', icon: Flower2 },
    { id: 'cherry', icon: Cherry },
    { id: 'heart', icon: Heart },
    { id: 'moon', icon: Moon },
    { id: 'sun', icon: Sun },
    { id: 'leaf', icon: Leaf },
];

const AVATAR_COLORS = [
    { id: 'blue', class: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
    { id: 'purple', class: 'text-purple-500', bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
    { id: 'red', class: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/30' },
    { id: 'green', class: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    { id: 'yellow', class: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    { id: 'pink', class: 'text-pink-500', bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
];

export default function ProfileModal({ isOpen, onClose, user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Default current avatar or first options
    const currentAvatarData = user?.avatar ? JSON.parse(user.avatar) : { icon: 'sparkles', color: 'blue' };
    const [selectedIcon, setSelectedIcon] = useState(currentAvatarData.icon);
    const [selectedColor, setSelectedColor] = useState(currentAvatarData.color);

    useEffect(() => {
        if (user?.avatar) {
            const data = JSON.parse(user.avatar);
            setSelectedIcon(data.icon);
            setSelectedColor(data.color);
        }
    }, [user]);

    if (!user) return null;

    const handleSaveAvatar = async () => {
        setLoading(true);
        const avatarObj = { icon: selectedIcon, color: selectedColor };
        const avatarData = JSON.stringify(avatarObj);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
            const username = user.username || user.first_name;
            const response = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(username)}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatar: avatarData })
            });

            if (response.ok) {
                // Получаем свежие данные с сервера после обновления аватара
                const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
                const refreshRes = await fetch(`${API_BASE_URL}/api/user/${encodeURIComponent(username)}`);
                const apiData = await refreshRes.json();

                const newData = { ...user, ...apiData };
                onUpdate(newData);
                localStorage.setItem("brainrot_user_data", JSON.stringify(newData));
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setLoading(false);
        }
    };

    const ActiveIcon = AVATAR_ICONS.find(i => i.id === selectedIcon)?.icon || Sparkles;
    const activeColor = AVATAR_COLORS.find(c => c.id === selectedColor) || AVATAR_COLORS[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Мой Профиль">
            <div className="space-y-6 py-2 overflow-y-auto max-h-[80vh] px-1 custom-scrollbar">
                {/* Scammer Warning */}
                {user.status === 'scammer' && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 p-4 rounded-[2rem] flex items-center gap-4 animate-pulse">
                        <div className="bg-red-500 p-2 rounded-xl">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-red-500 font-black text-xs uppercase tracking-widest">Внимание</p>
                            <p className="text-red-500 font-bold text-sm">Вы находитесь в черном списке!</p>
                        </div>
                    </div>
                )}

                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="group relative">
                        <div className={cn(
                            "w-28 h-28 rounded-[2rem] flex items-center justify-center border-4 shadow-2xl transition-all duration-500",
                            activeColor.bg,
                            activeColor.border
                        )}>
                            <ActiveIcon className={cn("w-14 h-14 transition-transform group-hover:scale-110", activeColor.class)} />
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all outline-none border-4 border-background"
                        >
                            <Palette className="w-4 h-4" />
                        </button>
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-foreground tracking-tight">
                            {user.first_name} {user.last_name || ""}
                        </h3>
                        <p className="text-sm text-primary font-bold flex items-center justify-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            @{user.username || "user"}
                        </p>
                    </div>
                </div>

                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-5 rounded-[2.5rem] bg-muted/30 border border-border space-y-6 overflow-hidden"
                    >
                        {/* Color Picker */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Цвет Аватара</span>
                            <div className="flex flex-wrap gap-3">
                                {AVATAR_COLORS.map(color => (
                                    <button
                                        key={color.id}
                                        onClick={() => setSelectedColor(color.id)}
                                        className={cn(
                                            "w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center",
                                            color.bg,
                                            selectedColor === color.id ? "border-primary scale-110" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        {selectedColor === color.id && <Check className="w-4 h-4 text-primary" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Icon Picker */}
                        <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Выберите Иконку</span>
                            <div className="grid grid-cols-6 gap-2">
                                {AVATAR_ICONS.map(({ id, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedIcon(id)}
                                        className={cn(
                                            "aspect-square rounded-xl flex items-center justify-center transition-all",
                                            selectedIcon === id
                                                ? "bg-primary/20 text-primary border-2 border-primary"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveAvatar}
                            disabled={loading}
                            className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Сохранить"}
                        </button>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/40 p-5 rounded-[2rem] border border-border flex flex-col items-center justify-center gap-2 text-center shadow-sm">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Роль</span>
                            <p className="font-bold text-sm text-foreground whitespace-pre-line leading-tight mt-1">
                                {user.role || "Участник"}
                            </p>
                        </div>
                    </div>
                    <div className="bg-muted/40 p-5 rounded-[2rem] border border-border flex flex-col items-center justify-center gap-2 text-center shadow-sm">
                        <Award className="w-5 h-5 text-accent" />
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Доверие</span>
                            <p className={cn(
                                "font-bold text-lg mt-1",
                                user.status === 'scammer' ? "text-red-500" : "text-green-500"
                            )}>
                                {user.status === 'scammer' ? "0%" : "100%"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4 bg-muted/20 p-6 rounded-[2.5rem] border border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-bold text-muted-foreground">Статус</span>
                        </div>
                        <span className={cn(
                            "font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full border",
                            user.status === 'scammer'
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-green-500/10 text-green-500 border-green-500/20"
                        )}>
                            {user.status === 'scammer' ? "В черном списке" : "Проверен ✅"}
                        </span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
