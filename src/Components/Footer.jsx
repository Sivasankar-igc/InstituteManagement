import { Link } from 'react-router-dom';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const Footer = () => {
    const quickLinks = [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/services", label: "Services" },
        { to: "/contact", label: "Contact" },
    ];

    const legalLinks = [
        { to: "/terms&conditions", label: "Terms & Conditions" },
        { to: "/privacyPolicy", label: "Privacy Policy" },
        { to: "/cancellationAndRefunding", label: "Cancellation & Refund" },
        { to: "/shippingAndDelivery", label: "Shipping & Delivery" },
    ];

    const socials = [
        { icon: faFacebook, href: "#", label: "Facebook" },
        { icon: faInstagram, href: "#", label: "Instagram" },
        { icon: faTwitter, href: "#", label: "Twitter" },
        { icon: faLinkedin, href: "https://www.linkedin.com/in/siva-sankar-sahoo-6b648a23a", label: "LinkedIn" },
    ];

    return (
        <footer className="bg-gray-800 text-gray-300 relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-[3px] bg-gradient-to-r from-blush via-rose to-nude" />

            <div className="max-w-6xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* About */}
                    <div className="lg:col-span-1">
                        <img src="/logo.png" alt="Insti360"
                             className="h-9 w-auto object-contain mb-5 brightness-0 invert opacity-80" />
                        <p className="text-sm text-gray-400 leading-relaxed mb-5">
                            A comprehensive institute management platform to manage departments,
                            assignments, exams, and student profiles.
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { icon: faMapMarkerAlt, text: "Chandrasekhar Pur, Bhubaneswar, India" },
                                { icon: faPhone, text: "+91 7609097828" },
                                { icon: faEnvelope, text: "contact.insti360@gmail.com" },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex items-start gap-3 text-sm text-gray-400">
                                    <FontAwesomeIcon icon={icon} className="text-blush mt-0.5 flex-shrink-0" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-5">
                            Quick Links
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {quickLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-gray-400 no-underline transition-all duration-200
                                                   hover:text-blush-light hover:translate-x-1 inline-block"
                                    >
                                        → {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-5">
                            Legal
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {legalLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="text-sm text-gray-400 no-underline transition-all duration-200
                                                   hover:text-blush-light hover:translate-x-1 inline-block"
                                    >
                                        → {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-5">
                            Follow Us
                        </h3>
                        <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                            Stay connected for updates and announcements.
                        </p>
                        <div className="flex gap-3">
                            {socials.map(({ icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-10 h-10 rounded-xl bg-white/8 border border-white/12
                                               flex items-center justify-center text-gray-400 text-sm
                                               no-underline transition-all duration-200
                                               hover:bg-gradient-to-br hover:from-blush hover:to-rose
                                               hover:text-white hover:border-transparent"
                                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)" }}
                                >
                                    <FontAwesomeIcon icon={icon} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/8 px-8 py-5 text-center text-xs text-gray-500"
                 style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                &copy; 2024 insti360.com &nbsp;·&nbsp; Designed with ♥ by Siva Sankar Sahoo
            </div>
        </footer>
    );
};

export default Footer;
