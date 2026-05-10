import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCrown } from "@fortawesome/free-solid-svg-icons";
import { HoverButton } from "./Others/AnimatedPage";

const durationConfig = {
    1: { gradient: "from-rose-400 to-rose-600",   bg: "from-rose-50 to-red-50",     label: "Starter",    badge: "bg-rose-100 text-rose-700" },
    3: { gradient: "from-sky-400 to-sky-600",     bg: "from-sky-50 to-blue-50",     label: "Popular",    badge: "bg-sky-100 text-sky-700" },
    6: { gradient: "from-emerald-400 to-emerald-600", bg: "from-emerald-50 to-green-50", label: "Best Value", badge: "bg-emerald-100 text-emerald-700" },
};

export default ({ premiumCardData }) => {
    const { duration, price, discount, benefits } = premiumCardData;
    const discountedPrice = price - Math.floor((price * discount) / 100);
    const config = durationConfig[duration] || durationConfig[1];

    return (
        <motion.div
            whileHover={{ y: -6, boxShadow: "0 16px 60px rgba(180,120,110,0.20)" }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-luxury w-full max-w-[300px]
                       overflow-hidden relative"
        >
            {/* Top gradient bar */}
            <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

            <div className="p-7">
                {/* Badge */}
                <div className="flex items-center justify-between mb-5">
                    <span className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${config.badge}`}>
                        {config.label}
                    </span>
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient}
                                    flex items-center justify-center text-white text-sm shadow-luxury-sm`}>
                        <FontAwesomeIcon icon={faCrown} />
                    </div>
                </div>

                {/* Duration */}
                <h3 className="text-xl font-extrabold text-gray-800 tracking-tight mb-4">
                    {duration} Month{duration > 1 ? "s" : ""}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-gray-800 font-outfit">
                        ₹{discountedPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">₹{price}</span>
                </div>
                <div className="mb-6">
                    <span className="badge badge-success text-xs">Save {discount}%</span>
                </div>

                {/* Benefits */}
                <ul className="flex flex-col gap-3 mb-7">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${config.gradient}
                                            flex items-center justify-center text-white text-[10px] flex-shrink-0 mt-0.5`}>
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                            {benefit}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <HoverButton
                    className={`w-full py-3 rounded-full font-outfit font-bold text-sm text-white
                               bg-gradient-to-r ${config.gradient} border-none cursor-pointer
                               shadow-luxury transition-all duration-300 flex items-center justify-center gap-2`}
                >
                    <FontAwesomeIcon icon={faCrown} /> Upgrade Now
                </HoverButton>
            </div>
        </motion.div>
    );
};
