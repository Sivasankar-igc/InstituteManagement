import { useSelector } from "react-redux";
import PremiumCard from "./PremiumCard";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { AnimatedPage, StaggerContainer, StaggerItem } from "./Others/AnimatedPage";

export default () => {
    const { data: instituteData } = useSelector((state) => state.institute);

    const premiumCards = [
        { price: 200,  discount: 12, duration: 1, benefits: ["Teacher can use AI to prepare questions", "Student can upload PDFs"] },
        { price: 850,  discount: 32, duration: 3, benefits: ["Teacher can use AI to prepare questions", "Student can upload PDFs"] },
        { price: 2000, discount: 52, duration: 6, benefits: ["Teacher can use AI to prepare questions", "Student can upload PDFs"] },
    ];

    const userPremiumPlan = instituteData?.premiumInfo?.isPremium
        ? premiumCards.find(card => card.duration === instituteData.premiumInfo.duration)
        : null;

    return (
        <AnimatedPage>
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600
                               flex items-center justify-center text-white text-2xl shadow-luxury mb-4"
                >
                    <FontAwesomeIcon icon={faCrown} />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Premium Plans</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
                    Unlock the full potential of <strong className="text-rose">insti360.com</strong> with exclusive benefits
                </p>
            </div>

            {/* Current Plan */}
            {userPremiumPlan ? (
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500" />
                        <h3 className="text-base font-bold text-gray-700">Your Current Plan</h3>
                    </div>
                    <div className="flex justify-center">
                        <PremiumCard premiumCardData={userPremiumPlan} />
                    </div>
                </div>
            ) : (
                <div className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <FontAwesomeIcon icon={faCrown} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">No Active Premium Plan</p>
                        <p className="text-xs text-gray-500 mt-0.5">Upgrade to unlock AI-powered features</p>
                    </div>
                </div>
            )}

            {/* All Plans */}
            <div>
                <h3 className="text-base font-bold text-gray-700 mb-5">
                    {userPremiumPlan ? "Explore Other Plans" : "Choose a Plan"}
                </h3>
                <StaggerContainer className="flex flex-wrap justify-center gap-6">
                    {premiumCards.map((card, index) => (
                        <StaggerItem key={index}>
                            <PremiumCard premiumCardData={card} />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </AnimatedPage>
    );
};
