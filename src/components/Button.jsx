import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function Button({ children, className, variant = "primary", ...props }) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.5)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "hover:bg-white/10 text-white",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "px-6 py-3 rounded-xl font-bold transition-colors duration-200 flex items-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
