import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSideBarActiveContext } from "../../Context_API/SideBarActivation";
import { AnimatedPage } from "./AnimatedPage";

/**
 * Reusable dashboard layout with animated sidebar.
 * 
 * @param {Object} props
 * @param {string} props.title - Sidebar brand title
 * @param {string} props.subtitle - Sidebar brand subtitle
 * @param {React.ReactNode} props.icon - Brand icon (FontAwesome icon)
 * @param {Array} props.navItems - [{ key, label, icon, onClick, danger?, disabled? }]
 * @param {Array} props.bottomItems - Same shape, shown at bottom
 * @param {string} props.activeKey - Currently active panel key
 * @param {React.ReactNode} props.children - Main content
 * @param {string} props.pageTitle - Mobile top bar title
 */
const DashboardLayout = ({
    title, subtitle, icon,
    navItems = [], bottomItems = [],
    activeKey, children, pageTitle
}) => {
    const { activeSideBar, setActiveSideBar } = useSideBarActiveContext();

    return (
        <div className="flex min-h-[calc(100vh-70px)] bg-gray-50">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {activeSideBar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[198] md:hidden"
                        onClick={() => setActiveSideBar(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar — always visible on desktop, slide-in on mobile */}
            <aside className={`
                fixed md:sticky top-0 md:top-[70px] left-0
                h-screen md:h-[calc(100vh-70px)]
                w-72 bg-white border-r border-gray-100 shadow-luxury-sm
                flex-col z-[199] md:z-auto overflow-y-auto
                transition-transform duration-300 ease-in-out
                ${activeSideBar ? "flex translate-x-0" : "-translate-x-full md:translate-x-0 hidden md:flex"}
            `}>
                {/* Brand */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blush to-rose
                                        flex items-center justify-center text-white text-base shadow-luxury">
                            <FontAwesomeIcon icon={icon} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800 leading-none">{title}</p>
                            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle.firstName}</p>}
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-400 px-3 py-2">
                        Navigation
                    </p>
                    {navItems.map(({ key, label, icon: itemIcon, onClick, disabled }) => (
                        <button
                            key={key}
                            onClick={() => { onClick?.(); setActiveSideBar(false); }}
                            disabled={disabled}
                            className={`sidebar-item ${activeKey === key ? "active" : ""}`}
                        >
                            <FontAwesomeIcon icon={itemIcon} className="w-4 flex-shrink-0" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                {/* Bottom Items */}
                {bottomItems.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
                        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 px-3 py-2">
                            Actions
                        </p>
                        {bottomItems.map(({ key, label, icon: itemIcon, onClick, danger, disabled }) => (
                            <button
                                key={key}
                                onClick={() => { onClick?.(); setActiveSideBar(false); }}
                                disabled={disabled}
                                className={`sidebar-item ${danger ? "danger" : ""}`}
                            >
                                <FontAwesomeIcon icon={itemIcon} className="w-4 flex-shrink-0" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </aside>

            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-[70px] left-0 right-0 z-[100]
                            flex items-center justify-between px-5 py-3
                            bg-white border-b border-gray-100 shadow-luxury-sm">
                <span className="text-sm font-bold text-gray-800">{pageTitle || title}</span>
                <button
                    onClick={() => setActiveSideBar(!activeSideBar)}
                    className="w-9 h-9 rounded-xl bg-peach border-none cursor-pointer
                               flex items-center justify-center text-rose transition-all duration-200
                               hover:bg-blush-light"
                >
                    <FontAwesomeIcon icon={activeSideBar ? faXmark : faBars} />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 mt-[52px] md:mt-0 overflow-y-auto">
                <AnimatedPage key={activeKey}>
                    {children}
                </AnimatedPage>
            </main>
        </div>
    );
};

export default DashboardLayout;
