import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoadingContext } from "../../Context_API/LoadingContext";
import { faCheck, faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { HoverButton } from "./AnimatedPage";

export default ({ children, onClose, onSubmit, formElems }) => {
    const { isloading } = useLoadingContext();

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
                    onClick={() => !isloading && onClose()}
                />

                {/* Dialog */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative bg-white rounded-3xl shadow-luxury-xl border border-gray-100
                               w-full max-w-md max-h-[85vh] overflow-y-auto z-10"
                >
                    {/* Top bar */}
                    <div className="h-1.5 bg-gradient-to-r from-blush to-rose rounded-t-3xl" />

                    {/* Close */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isloading}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 border-none
                                   flex items-center justify-center text-gray-500 cursor-pointer
                                   hover:bg-red-50 hover:text-red-500 transition-all duration-200 z-10"
                    >
                        <FontAwesomeIcon icon={faXmark} className="text-sm" />
                    </button>

                    <form onSubmit={onSubmit} className="p-8">
                        {formElems.length > 0 && formElems.map(({ label, onChange, name, type, placeholder, defaultValue, disabled }, index) => (
                            <div key={`${index}${name}`} className="form-group-luxury">
                                <label className="form-label-luxury" htmlFor={name}>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    id={name}
                                    defaultValue={defaultValue}
                                    placeholder={placeholder}
                                    onChange={onChange}
                                    disabled={disabled || isloading}
                                    className="input-luxury"
                                />
                            </div>
                        ))}

                        {children}

                        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                            <HoverButton
                                type="submit"
                                disabled={isloading}
                                className="flex-1 py-3 rounded-full font-outfit font-bold text-sm text-white
                                           bg-gradient-to-r from-emerald-400 to-emerald-600 border-none cursor-pointer
                                           shadow-luxury flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={isloading ? faSpinner : faCheck} spin={isloading} />
                                {isloading ? "Submitting..." : "Submit"}
                            </HoverButton>
                            <HoverButton
                                type="button"
                                onClick={onClose}
                                disabled={isloading}
                                className="flex-1 py-3 rounded-full font-outfit font-semibold text-sm text-gray-600
                                           bg-white border border-gray-200 cursor-pointer
                                           flex items-center justify-center gap-2
                                           hover:border-blush hover:text-rose transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faXmark} /> Cancel
                            </HoverButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
