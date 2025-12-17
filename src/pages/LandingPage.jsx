import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Palette,
  BarChart3,
  ShoppingBag,
  Layers,
  Globe,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { SEO } from "../components/seo/SEO";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingPage() {
  const { session } = useAuthStore();

  // --- UPDATED NAVBAR STATE LOGIC ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Track visibility
  const lastScrollY = useRef(0); // Track last scroll position

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic: Hide if scrolling DOWN, Show if scrolling UP
      // We also check if the Mobile Menu is closed (so we don't hide the menu while using it)
      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > 50 &&
        !isMobileMenuOpen
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Logic: Glass effect background
      setIsScrolled(currentScrollY > 20);

      // Update the "last" position for the next calculation
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Reviews", href: "#reviews" },
    { name: "Pricing", href: "#pricing" },
  ];
  // ----------------------------------

  return (
    <>
      <SEO
        title="Home"
        description="The only link you'll ever need. Connect your audience to all of your content with just one URL."
        url={window.location.origin}
      />

      {/* --- NAVBAR SECTION (DARK THEME) --- */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? // 1. Change 'py-3' to 'py-2' (Makes it thinner when scrolling)
              "bg-black/80 backdrop-blur-md border-b border-white/10 py-2 shadow-lg shadow-black/20"
            : // 2. Change 'py-5' to 'py-3' (Makes it thinner when at the top)
              "bg-black py-3 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* 1. LOGO SECTION */}
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* REPLACE 'src' WITH YOUR ACTUAL LOGO PATH */}
            <img
              src="/logo.png"
              alt="ReachMe Logo"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = "none"; // Hides image if broken
                e.target.nextSibling.style.display = "flex"; // Shows fallback icon
              }}
            />
            {/* Fallback Icon if no image found (You can remove this div once you have a real logo) */}
            <div className="w-8 h-8 bg-white rounded-lg hidden items-center justify-center text-black font-bold">
              R
            </div>

            <span className="font-heading font-bold text-xl tracking-tight text-white">
              ReachMe
            </span>
          </div>

          {/* 2. DESKTOP LINKS (WHITE TEXT) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* 3. AUTH BUTTONS & MOBILE TOGGLE */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <Link
                  to="/dashboard"
                  className="font-bold text-sm bg-white text-black px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-bold text-sm text-white hover:text-slate-300 transition-colors"
                  >
                    Log in
                  </Link>

                  {/* SPECIALLY DESIGNED 'GET STARTED' BUTTON */}
                  <Link
                    to="/register"
                    className="relative group font-bold text-sm bg-white text-black px-6 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden"
                  >
                    <span className="relative z-10">Get Started</span>
                    {/* Subtle gradient sheen effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent transition-transform duration-500" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Icon (White) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN (DARK MODE) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 inset-x-0 z-40 bg-zinc-900 border-b border-white/10 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-white py-1 border-b border-white/10"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                {session ? (
                  <Link
                    to="/dashboard"
                    className="w-full justify-center font-bold text-lg bg-white text-black px-4 py-3 rounded-xl flex items-center gap-2"
                  >
                    Dashboard <ChevronRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full justify-center font-bold text-lg border border-white/20 text-white px-6 py-3 rounded-xl"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full justify-center font-bold text-lg bg-brand-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-brand-500/20"
                    >
                      Get Started Free <ChevronRight size={18} />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ---------------------- */}

      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
        {/* HERO SECTION */}
        <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-200/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] -z-10" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-8 hover:bg-brand-100 transition-colors cursor-default">
                  <Zap size={14} className="fill-brand-700" />
                  v2.0 is Live
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl lg:text-7xl font-heading font-bold leading-[1.1] mb-6 tracking-tight text-balance text-slate-900"
              >
                One Link to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 bg-[length:200%_auto] animate-gradient">
                  Rule Them All.
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg text-balance"
              >
                Consolidate your digital presence. Connect your audience to all
                of your content, products, and socials with just one beautiful
                URL.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-xl shadow-slate-900/20 w-full sm:w-auto"
                >
                  Claim your ReachMe
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto"
                >
                  View Demo
                </Link>
              </motion.div>

              {/* Social Proof Text */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/100?img=${
                          i + 10
                        })`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <p>
                  Trusted by{" "}
                  <span className="text-slate-900 font-bold">10,000+</span>{" "}
                  creators
                </p>
              </motion.div>
            </motion.div>

            {/* Right: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block perspective-1000"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10"
              >
                {/* The Phone */}
                <div className="w-[340px] h-[680px] mx-auto bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-900 shadow-2xl relative overflow-hidden ring-1 ring-slate-900/50 rotate-[-6deg] hover:rotate-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20"></div>

                  {/* Screen Content */}
                  <div className="w-full h-full bg-slate-50 overflow-hidden flex flex-col items-center pt-14 px-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="w-24 h-24 bg-gradient-to-tr from-brand-300 to-purple-300 rounded-full mb-4 shadow-inner"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="w-32 h-4 bg-slate-200 rounded-full mb-2"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="w-48 h-3 bg-slate-100 rounded-full mb-8"
                    />

                    <div className="w-full space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.15 }}
                          className="w-full h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-4 gap-3 hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              i === 1
                                ? "bg-red-100 text-red-500"
                                : i === 2
                                ? "bg-blue-100 text-blue-500"
                                : i === 3
                                ? "bg-pink-100 text-pink-500"
                                : "bg-brand-100 text-brand-500"
                            }`}
                          >
                            {i === 1 ? (
                              <ShoppingBag size={18} />
                            ) : i === 2 ? (
                              <Globe size={18} />
                            ) : (
                              <Layers size={18} />
                            )}
                          </div>
                          <div className="w-24 h-3 bg-slate-100 rounded-full" />
                          <div className="ml-auto opacity-0 group-hover:opacity-100">
                            <ArrowRight size={14} className="text-slate-300" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Analytics Cards */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-40 -left-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex items-center gap-4 z-20"
                >
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Profile Views
                    </div>
                    <div className="text-lg font-bold text-slate-900">8.5k</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* LOGO CLOUD */}
        <section className="py-10 border-y border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
              Powering next-gen creators
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <h3 className="text-2xl font-bold text-slate-800">Spotify</h3>
              <h3 className="text-2xl font-bold text-slate-800">Twitch</h3>
              <h3 className="text-2xl font-bold text-slate-800">TikTok</h3>
              <h3 className="text-2xl font-bold text-slate-800">Medium</h3>
              <h3 className="text-2xl font-bold text-slate-800">Substack</h3>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 mb-6 tracking-tight">
                Everything you need to grow.
              </h2>
              <p className="text-slate-500 text-xl leading-relaxed">
                ReachMe gives you the tools to connect, sell, and grow your
                audience from one simple link. No coding required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <Palette size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Custom Appearance
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Match your brand perfectly. Choose from themes, custom fonts,
                  and animated backgrounds.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-brand-500" /> Custom
                    Hex Colors
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-brand-500" /> Button
                    Animations
                  </li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <BarChart3 size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Deep Analytics
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Track your views, clicks, and CTR with beautiful charts.
                  Understand what your audience loves.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-brand-500" />{" "}
                    Real-time data
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-brand-500" />{" "}
                    Location tracking
                  </li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={28} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Sell Products
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Showcase your eBooks, courses, or merchandise directly on your
                  profile with our Shop grid.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-brand-500" /> 0%
                    Transaction Fees
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-brand-500" />{" "}
                    Instant Payouts
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 tracking-tight">
              Ready to claim your link?
            </h2>
            <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of creators who use ReachMe to share more, sell
              more, and grow more.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-brand-500 transition-all hover:scale-105 shadow-2xl shadow-brand-500/50"
              >
                Get Started for Free <ArrowRight />
              </Link>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
              <p>© 2025 ReachMe. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
