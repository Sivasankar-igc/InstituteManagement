import { NavLink } from "react-router-dom";
import { useAuthenticateContext } from "../Context_API/Authentication";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUser } from "@fortawesome/free-solid-svg-icons";

const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
];

export default () => {
    const { successAuthentication, accountUrl } = useAuthenticateContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-[999] flex items-center justify-between
                        px-6 md:px-10 h-[70px]
                        bg-white/75 backdrop-blur-xl border-b border-white/60
                        shadow-[0_2px_24px_rgba(180,120,110,0.08)]">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 no-underline">
                <img src="/logo_black.png" alt="Insti360" className="h-9 w-auto object-contain" />
            </NavLink>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
                {navLinks.map(({ to, label, end }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 no-underline
                                 ${isActive
                                    ? "text-rose bg-peach font-semibold"
                                    : "text-gray-600 hover:text-rose hover:bg-peach/60"}`
                            }
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
                <li>
                    {successAuthentication ? (
                        <NavLink
                            to={accountUrl}
                            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full
                                       bg-gradient-to-r from-blush to-rose text-white no-underline
                                       shadow-luxury transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
                        >
                            <FontAwesomeIcon icon={faUser} /> My Account
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/login/Institute"
                            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full
                                       bg-gradient-to-r from-blush to-rose text-white no-underline
                                       shadow-luxury transition-all duration-300 hover:-translate-y-0.5 hover:shadow-luxury-lg"
                        >
                            Institute Login
                        </NavLink>
                    )}
                </li>
            </ul>

            {/* Hamburger */}
            <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl
                           bg-peach/60 border-none cursor-pointer text-rose transition-all duration-200
                           hover:bg-peach"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[70px] left-0 right-0 bg-white border-b border-gray-100
                                   shadow-luxury-lg px-5 py-4 flex flex-col gap-1 md:hidden z-50"
                    >
                        {navLinks.map(({ to, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `text-sm font-medium px-4 py-3 rounded-xl transition-all duration-200 no-underline block
                                     ${isActive ? "text-rose bg-peach font-semibold" : "text-gray-600 hover:text-rose hover:bg-peach/60"}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                        {successAuthentication ? (
                            <NavLink
                                to={accountUrl}
                                onClick={() => setIsOpen(false)}
                                className="mt-2 text-sm font-semibold px-4 py-3 rounded-xl text-center
                                           bg-gradient-to-r from-blush to-rose text-white no-underline block"
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2" /> My Account
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/login/Institute"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 text-sm font-semibold px-4 py-3 rounded-xl text-center
                                           bg-gradient-to-r from-blush to-rose text-white no-underline block"
                            >
                                Institute Login
                            </NavLink>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
