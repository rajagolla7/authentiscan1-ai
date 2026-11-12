import React, { useState, useEffect } from "react";
import { Language, ScanResult } from "./types";
import { TRANSLATIONS } from "./sampleData";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ScannerWorkspace from "./components/ScannerWorkspace";
import ResultDashboard from "./components/ResultDashboard";
import VerifiedMarketplaces from "./components/VerifiedMarketplaces";
import AdminConsole from "./components/AdminConsole";
import Chatbot from "./components/Chatbot";
import { X, Clock, AlertTriangle, CheckCircle, ArrowRight, ShieldCheck, Mail, Lock, LogIn, Fingerprint } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [language, setLanguage] = useState<Language>("en");
  
  // Theme Toggle State
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("authentiscan-theme") as "dark" | "light") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("authentiscan-theme", theme);
  }, [theme]);

  // Scans history registry
  const [activeScanResult, setActiveScanResult] = useState<ScanResult | null>(null);

  // Sign-in and History states
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default true for audit node, can log out / in
  const [userEmail, setUserEmail] = useState("rajagolla52@gmail.com");
  const [historyRecords, setHistoryRecords] = useState<ScanResult[]>([]);

  // Sign-in form states
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const trans = TRANSLATIONS[language];

  // Load and refresh scan history
  useEffect(() => {
    fetchHistory();
  }, [activeScanResult]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/scan-history");
      if (res.ok) {
        const data = await res.json();
        setHistoryRecords(data);
      }
    } catch (err) {
      console.error("Error fetching scan history:", err);
    }
  };

  const handleScanResult = (result: ScanResult) => {
    setActiveScanResult(result);
  };

  const handleResetScan = () => {
    setActiveScanResult(null);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.includes("@")) {
      setAuthError("Invalid decryption key structure. Must be a valid email.");
      return;
    }
    if (inputPassword.length < 4) {
      setAuthError("Unauthorized key duration. Secret code must exceed 4 digits.");
      return;
    }
    
    // Successful login simulation
    setIsLoggedIn(true);
    setUserEmail(inputEmail);
    setIsSignInOpen(false);
    setAuthError("");
    setInputEmail("");
    setInputPassword("");
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  const selectHistoryItem = (item: ScanResult) => {
    setActiveScanResult(item);
    setActiveTab("workspace");
    setIsHistoryOpen(false);
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-slate-50 text-slate-900"} font-sans flex flex-col justify-between selection:bg-indigo-500/35 selection:text-indigo-200`}>
      
      {/* Dynamic Navigation Console */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        language={language}
        setLanguage={setLanguage}
        translations={trans}
        onOpenHistory={() => {
          fetchHistory();
          setIsHistoryOpen(true);
        }}
        onOpenSignIn={() => setIsSignInOpen(true)}
        isLoggedIn={isLoggedIn}
        onSignOut={handleSignOut}
        userEmail={userEmail}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main viewport panels */}
      <main className="flex-1 relative">
        {activeTab === "landing" && (
          <LandingPage 
            language={language} 
            onScanCTA={() => setActiveTab("workspace")} 
          />
        )}

        {activeTab === "workspace" && (
          <div className="py-8">
            {activeScanResult ? (
              <ResultDashboard 
                result={activeScanResult} 
                onReset={handleResetScan} 
                translations={trans}
                setActiveTab={setActiveTab}
              />
            ) : (
              <ScannerWorkspace 
                onScanResult={handleScanResult} 
                translations={trans}
                language={language}
              />
            )}
          </div>
        )}

        {activeTab === "marketplaces" && (
          <VerifiedMarketplaces 
            translations={trans} 
            historyRecords={historyRecords} 
            activeScanResult={activeScanResult} 
          />
        )}

        {activeTab === "admin" && (
          <AdminConsole translations={trans} />
        )}

        {/* Global Sidebar: Scan Ledger / History Slideout */}
        {isHistoryOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden text-left" id="sidebar-ledger-wrapper">
            {/* Backdrop blur */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsHistoryOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-[#101223]/95 border-l border-slate-800 shadow-[0_0_50px_rgba(0,242,255,0.15)] overflow-y-scroll text-white scrollbar-thin">
                  
                  {/* Ledger Header */}
                  <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Clock className="h-5 w-5 text-[#00f2ff] neon-text-blue animate-pulse" />
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-cyan-400 uppercase block font-extrabold">{trans.scanHistoryTitle || "Scan History Logs"}</span>
                        <h2 className="text-md font-black tracking-tight text-white uppercase mt-0.5">Audit Record Ledger</h2>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsHistoryOpen(false)}
                      className="p-1 px-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 duration-200 cursor-pointer"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Ledger List */}
                  <div className="flex-1 p-5 space-y-4">
                    {historyRecords.length > 0 ? (
                      historyRecords.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          onClick={() => selectHistoryItem(item)}
                          id={`history-ledger-item-${item.id}`}
                          className="group border border-[rgba(100,116,139,0.15)] bg-slate-950/40 hover:bg-slate-950/80 p-4 rounded-xl cursor-pointer hover:border-cyan-500/40 transition duration-200 text-left relative overflow-hidden"
                        >
                          <div className="flex items-start space-x-3">
                            <img 
                              src={item.imageUrl} 
                              alt="" 
                              className="w-12 h-12 rounded bg-slate-900 object-cover border border-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                                  item.status === "Genuine" 
                                    ? "bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30" 
                                    : item.status === "Suspicious" 
                                    ? "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30" 
                                    : "bg-[#ff3131]/15 text-[#ff3131] border border-[#ff3131]/30"
                                }`}>
                                  {item.status}
                                </span>
                                <span className="text-[9px] font-mono text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition">{item.productName}</h4>
                              <p className="text-[10px] font-mono text-slate-400 uppercase truncate mt-0.5">MFR: {item.brand} • UPC: {item.barcode}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-mono">INTEGRITY INDEX: <strong className="text-white">{item.authenticityScore}%</strong></span>
                            <span className="flex items-center space-x-1 font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition duration-200 font-extrabold uppercase text-[9px]">
                              <span>LOAD RECORD</span>
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 space-y-2 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                        <Clock className="h-8 w-8 text-slate-600 mx-auto" />
                        <p className="text-xs font-mono text-slate-400 uppercase font-bold">Registry Ledger Empty</p>
                        <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">Once products undergo AI deconstruction scan analyses, their logs record here indefinitely.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Modal: Secure User Sign-In Dialog */}
        {isSignInOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left" id="modal-signin-root">
            {/* Backdrop blur */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
              onClick={() => setIsSignInOpen(false)}
            />

            <div className="relative transform overflow-hidden rounded-2xl border border-[rgba(100,116,139,0.35)] bg-[#101223] px-6 py-8 text-white shadow-[0_0_50px_rgba(188,19,254,0.15)] transition-all w-full max-w-sm glass animate-fade-in">
              <button 
                onClick={() => setIsSignInOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg border border-slate-800 hover:bg-slate-900 duration-200 cursor-pointer"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#bc13fe]/10 border border-[#bc13fe]/40 text-[#bc13fe] shadow-[0_0_15px_rgba(188,19,254,0.25)]">
                  <Fingerprint className="h-6 w-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white uppercase mt-3">Auditor Node Register</h3>
                <p className="text-[11px] text-slate-400 mt-1">Acquire cryptographic permissions to authenticate distributed regional logs.</p>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Auditor Email Node *</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="e.g. inspector@domain.com"
                      className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 pl-11 outline-none focus:border-[#bc13fe] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Cryptographic Pass Token *</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 pl-11 outline-none focus:border-[#bc13fe] text-white"
                    />
                  </div>
                </div>

                {authError && (
                  <p className="text-[10px] font-mono text-[#ff3131] bg-[#ff3131]/10 border border-[#ff3131]/25 p-2 rounded text-center font-bold">
                    [ERROR] {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#bc13fe] to-[#ff3131] hover:scale-101 py-3 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(188,19,254,0.3)] transition cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>DECRYPT & REGISTER SESSION</span>
                </button>
              </form>

              <div className="mt-5 border-t border-slate-800 pt-4 text-center leading-relaxed">
                <span className="block text-[8px] font-mono text-slate-500 uppercase">Secure Sandbox Node access point</span>
                <span className="block text-[9px] text-[#39ff14] font-black mt-1 uppercase">Ready for connection</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dynamic Floating Chatbot */}
      <Chatbot 
        lastScanResult={activeScanResult} 
        translations={trans} 
      />

    </div>
  );
}
