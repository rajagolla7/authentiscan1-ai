import { motion } from "motion/react";
import { ShieldCheck, Languages, User, LayoutDashboard, Globe, ShieldAlert, Cpu, Sun, Moon } from "lucide-react";
import { Language } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: any;
  onOpenHistory: () => void;
  onOpenSignIn: () => void;
  isLoggedIn: boolean;
  onSignOut: () => void;
  userEmail: string;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  translations,
  onOpenHistory,
  onOpenSignIn,
  isLoggedIn,
  onSignOut,
  userEmail,
  theme,
  setTheme
}: NavbarProps) {
  const tabs = [
    { id: "landing", label: translations.home || "Home", icon: Cpu },
    { id: "workspace", label: translations.dashboard || "Scan Workspace", icon: LayoutDashboard },
    { id: "marketplaces", label: "Verified Marketplaces", icon: Globe },
    { id: "admin", label: translations.admin || "Admin Console", icon: ShieldAlert }
  ];

  const handleActiveTab = (id: string) => {
    setActiveTab(id);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(100,116,139,0.2)] bg-[#101223]/70 backdrop-blur-xl glass shadow-[0_0_15px_rgba(0,242,255,0.05)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Futuristic Brand Logo */}
        <div 
          onClick={() => handleActiveTab("landing")}
          className="flex cursor-pointer items-center space-x-3 group"
          id="nav-logo-group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,242,255,0.4)] bg-[#101223]/80 text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.25)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(0,242,255,0.5)] transition-all duration-300">
            <ShieldCheck className="h-6 w-6 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
            </span>
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white">
              AUTHENTI<span className="text-[#00f2ff] font-extrabold neon-text-blue">SCAN</span>
            </span>
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-mono text-[9px] tracking-widest text-[#bc13fe] uppercase font-bold">Neural Audit v3</span>
            </div>
          </div>
        </div>

        {/* Dynamic High-Tech Navigation Tabs */}
        <nav className="hidden md:flex space-x-1 p-1 rounded-xl bg-zinc-950/60 border border-[rgba(100,116,139,0.15)] glass">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`navbar-tab-${tab.id}`}
                onClick={() => handleActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                  isActive
                    ? "text-[#00f2ff] font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-glow"
                    className="absolute inset-0 rounded-lg border border-[#00f2ff]/40 bg-[#00f2ff]/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_12px_rgba(0,242,255,0.25)] pointer-events-none"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#00f2ff]' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Control Desk: Language Selection & Logged User Info */}
        <div className="flex items-center space-x-3.5">
          
          {/* Quick-Shift Language Selector */}
          <div className="relative flex items-center space-x-1 rounded-lg border border-[rgba(100,116,139,0.3)] bg-[#101223]/50 px-2.5 py-1.5 text-xs font-semibold glass">
            <Languages className="h-3.5 w-3.5 text-[#00f2ff]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              id="lang-select-elem"
              className="bg-transparent text-xs font-bold text-[#00f2ff] outline-none cursor-pointer focus:ring-0 pr-1"
            >
              <option value="en" className="bg-[#101223] text-white">EN</option>
              <option value="hi" className="bg-[#101223] text-white">HI (हिंदी)</option>
              <option value="te" className="bg-[#101223] text-white">TE (తెలుగు)</option>
            </select>
          </div>

          {/* Theme Toggler Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            id="theme-toggler-btn"
            className="flex h-[32px] w-[32px] items-center justify-center rounded-lg border border-[rgba(100,116,139,0.3)] bg-[#101223]/50 hover:bg-[#101223]/80 text-[#00f2ff] cursor-pointer transition-all duration-200"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* History Button (Futuristic LED look) */}
          <button
            onClick={onOpenHistory}
            id="nav-history-trigger"
            className="flex items-center space-x-1 rounded-lg border border-cyan-500/25 bg-cyan-950/15 hover:bg-cyan-950/30 text-cyan-400 px-3 py-1.5 text-xs font-extrabold shadow-[0_0_8px_rgba(0,242,255,0.1)] transition hover:scale-101 cursor-pointer"
          >
            <span>{translations.historyBtn || "History"}</span>
          </button>

          {/* User Sign In / Profile */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2.5">
              <div className="hidden lg:flex items-center space-x-2.5 rounded-full border border-[rgba(100,116,139,0.2)] bg-[#101223]/40 py-1 pl-1 pr-3 glass">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-[#bc13fe] text-xs font-bold text-white uppercase shadow-[0_0_8px_rgba(0,242,255,0.4)]">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="text-left select-none max-w-[130px] overflow-hidden text-ellipsis">
                  <span className="block text-[10px] leading-tight font-bold text-slate-200 truncate">{userEmail}</span>
                  <span className="block text-[8px] font-mono leading-none tracking-widest text-[#39ff14] uppercase">Secured</span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                id="nav-sign-out-btn"
                className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 hover:text-[#ff3131] transition duration-200 cursor-pointer"
              >
                {translations.signOutBtn || "Sign Out"}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenSignIn}
              id="nav-sign-in-btn"
              className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#bc13fe] to-[#ff3131] hover:scale-101 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_12px_rgba(188,19,254,0.3)] transition cursor-pointer"
            >
              <User className="h-3.5 w-3.5" />
              <span>{translations.signInBtn || "Sign In"}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
