import { motion } from "framer-motion";

// Page entrance animation wrapper
export const AnimatedPage = ({ children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// Stagger children
export const StaggerContainer = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial="hidden"
        animate="visible"
        variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: delay } }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

// Stagger child item
export const StaggerItem = ({ children, className = "" }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
        }}
        className={className}
    >
        {children}
    </motion.div>
);

// Fade in from left
export const SlideInLeft = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// Fade in from right
export const SlideInRight = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// Scale in (modal/card)
export const ScaleIn = ({ children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

// Hover card
export const HoverCard = ({ children, className = "", onClick }) => (
    <motion.div
        whileHover={{ y: -4, boxShadow: "0 8px 40px rgba(180,120,110,0.16)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className={className}
        onClick={onClick}
    >
        {children}
    </motion.div>
);

// Hover button
export const HoverButton = ({ children, className = "", onClick, disabled, type = "button", ...props }) => (
    <motion.button
        whileHover={!disabled ? { y: -2, scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        transition={{ duration: 0.2 }}
        className={className}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...props}
    >
        {children}
    </motion.button>
);

export default AnimatedPage;
