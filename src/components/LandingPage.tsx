import { motion } from "motion/react";
import { ShieldCheck, Zap, Cpu, CircleDot, Activity, Smartphone, Eye, ArrowRight, Star } from "lucide-react";
import { TRANSLATIONS } from "../sampleData";
import { Language } from "../types";

interface LandingPageProps {
  language: Language;
  onScanCTA: () => void;
}

export default function LandingPage({ language, onScanCTA }: LandingPageProps) {
  const trans = TRANSLATIONS[language];

  // Futuristic features array
  const features = [
    {
      icon: Cpu,
      title: "Vision Neural Engine",
      desc: "Super-resolution pixel analysis compares brand logos down to sub-pixel coordinates."
    },
    {
      icon: Eye,
      title: "OCR Label Forensics",
      desc: "Instantly extracts ingredients, regulatory stamps, typos, and serial records automatically."
    },
    {
      icon: Smartphone,
      title: "Unified Scanning Channels",
      desc: "Upload box photos, scan live stream QR/Barcodes, or initialize real-time web camera feeds."
    },
    {
      icon: Zap,
      title: "Seller Reputation Sentinel",
      desc: "Mines millions of e-commerce feedback ratings with automated NLP spam-bot detectors."
    },
    {
      icon: CircleDot,
      title: "Blockchain Badges",
      desc: "Simulates tamper-proof registration ledgers providing decentralized certifiably genuine lookup IDs."
    },
    {
      icon: ShieldCheck,
      title: "Explainable AI Logs",
      desc: "Transparency is our priority. We pinpoint exactly why a product is rated fake with 3D overlays."
    }
  ];

  const stats = [
    { value: "48M+", label: "Verified Shipments" },
    { value: "99.8%", label: "Deception Accuracy" },
    { value: "0.2s", label: "Analysis Latency" },
    { value: "₹240Cr+", label: "Losses Averted" }
  ];

  return (
    <div className="relative overflow-hidden bg-[#05060b] pb-20 text-white min-h-screen">
      {/* Background Cyber-Grid Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#05060b] to-[#05060b] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-[#bc13fe]/10 via-transparent to-transparent pointer-events-none" />

      {/* Cybernetic Tech-Grid Design */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 rounded-full border border-[#00f2ff]/30 bg-[#00f2ff]/5 px-3.5 py-1.5 text-xs text-[#00f2ff] font-mono glass"
            >
              <Activity className="h-4 w-4 animate-pulse" />
              <span>SECURITY PROTOCOL LEVEL 5 INITIATED</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#00f2ff]"
            >
              {trans.heroTitle}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-md sm:text-lg text-slate-300 max-w-xl leading-relaxed"
            >
              {trans.heroSub}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                id="cta-scan-now-hero"
                onClick={onScanCTA}
                className="group relative flex items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-cyan-500 to-[#bc13fe] px-8 py-4 text-sm font-bold text-white shadow-[0_0_25px_rgba(0,242,255,0.4)] hover:shadow-[0_0_35px_rgba(188,19,254,0.6)] hover:scale-103 transition-all duration-300 cursor-pointer"
              >
                <span>{trans.scanNow}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

          </div>

          {/* Interactive Demo mockup / visualization */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative mx-auto max-w-[380px] rounded-3xl border border-[rgba(100,116,139,0.3)] bg-[#101223]/80 p-5 shadow-2xl backdrop-blur-2xl glass neon-glow-blue"
            >
              {/* Device Frame Ambient Light */}
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-tr from-cyan-400 to-[#bc13fe] opacity-20 blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-[#39ff14] animate-ping" />
                  <span className="font-mono text-[9px] tracking-widest text-[#00f2ff] uppercase font-bold">Neural Feed (Active Demo)</span>
                </div>
                <span className="font-mono text-[9px] text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/25 px-2 py-0.5 rounded-full font-bold">SCAN COMPLETE</span>
              </div>

              {/* Product Card simulation */}
              <div className="relative overflow-hidden rounded-xl bg-[#05060b]/50 p-4 border border-[rgba(100,116,139,0.15)] glass">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-950">
                  <img 
                    src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80" 
                    alt="Mock skin product scan" 
                    className="h-full w-full object-cover opacity-80"
                  />
                  
                  {/* Glowing Laser Scan lines */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff3131] to-transparent shadow-[0_0_12px_rgba(255,49,49,1)] top-1/3 animate-bounce" />
                  
                  {/* Detected coordinates pins */}
                  <div className="absolute top-[35%] left-[50%] flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff3131] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ff3131] border-2 border-white"></span>
                  </div>
                </div>

                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-tight text-white uppercase">ViraShield Defence Serum</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">S/N: VR-1029-FAKE • Barcode mismatch</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-0.5 text-[9px] font-mono rounded bg-red-950/40 text-[#ff3131] shrink-0 border border-red-500/20 uppercase font-bold">
                      Counterfeit
                    </span>
                  </div>
                </div>

                {/* Score analysis bar */}
                <div className="mt-3.5 pt-3.5 border-t border-slate-900">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Authenticity Index</span>
                    <span className="font-mono font-bold text-[#ff3131] text-xs">24%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#05060b] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff3131] to-orange-500 rounded-full" style={{ width: '24%' }} />
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Statistics board */}
      <div className="mt-20 border-y border-[rgba(100,116,139,0.15)] bg-[#101223]/30 py-12 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center md:text-left space-y-1">
                <span className="block text-3xl font-black tracking-tight text-[#00f2ff] md:text-4xl neon-text-blue">{stat.value}</span>
                <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Futuristic Features Section */}
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-[#00f2ff] uppercase font-mono neon-text-blue">NEXT-GEN DEFENSE SHIELD</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Platform Features</h2>
          <p className="text-sm text-slate-300">AuthentiScan merges military-grade classification models, review parsing, and ledger tracking into a single unified verification workstation.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(0, 242, 255, 0.4)', transition: { duration: 0.2 } }}
                className="relative rounded-2xl border border-[rgba(100,116,139,0.15)] bg-[#101223]/40 p-6 backdrop-blur-md glass group hover:neon-glow-blue text-left transition-all duration-300"
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#00f2ff]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-2xl pointer-events-none" />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101223]/85 border border-[#00f2ff]/30 text-[#00f2ff] mb-5 relative glass">
                  <Icon className="h-5 w-5 stroke-[1.5]" />
                  <div className="absolute inset-0 rounded-xl bg-[#00f2ff]/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-md font-bold tracking-tight text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold tracking-widest text-[#bc13fe] uppercase font-mono neon-text-purple">STAKEHOLDER TRUST</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Startup & Investor Accolades</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[rgba(100,116,139,0.15)] bg-[#101223]/30 p-6 flex flex-col justify-between text-left glass">
            <p className="text-xs leading-relaxed text-slate-300 italic">"The speed of packaging validation is phenomenal. We simulated logo variations inside supply logistics; AuthentiScan spotted them in 200 milliseconds. Investor-friendly startup design at its finest."</p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-[#bc13fe] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_8px_rgba(0,242,255,0.3)]">VP</div>
              <div>
                <h4 className="text-xs font-bold text-white">Vikram Patel</h4>
                <p className="text-[10px] text-slate-500 font-mono">Lead Supply Auditor • BrandSafely</p>
              </div>
            </div>
            <div className="flex space-x-0.5 text-[#00f2ff] mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current text-[#00f2ff]" />)}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(100,116,139,0.15)] bg-[#101223]/30 p-6 flex flex-col justify-between text-left glass">
            <p className="text-xs leading-relaxed text-slate-300 italic">"As a cosmetic distributor, replica goods were eating 15% of our net margins. Using AuthentiScan AI, our warehouse staff can verify high-value drops before checking them into the inventory database."</p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#39ff14] to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_8px_rgba(57,255,20,0.3)]">SK</div>
              <div>
                <h4 className="text-xs font-bold text-white">Shalini Kapoor</h4>
                <p className="text-[10px] text-slate-500 font-mono">Founder • GlamChain Logistics</p>
              </div>
            </div>
            <div className="flex space-x-0.5 text-[#00f2ff] mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current text-[#00f2ff]" />)}
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(100,116,139,0.15)] bg-[#101223]/30 p-6 flex flex-col justify-between text-left glass">
            <p className="text-xs leading-relaxed text-slate-300 italic">"AuthentiScan AI provides outstanding transparency. It doesn't just score authenticity - it labels anomalies like typography flaws visually using an intuitive explainable overlay."</p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#bc13fe] to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_8px_rgba(188,19,254,0.3)]">JM</div>
              <div>
                <h4 className="text-xs font-bold text-white">John M.</h4>
                <p className="text-[10px] text-slate-500 font-mono">Tech Scout • FutureVC</p>
              </div>
            </div>
            <div className="flex space-x-0.5 text-[#00f2ff] mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current text-[#00f2ff]" />)}
            </div>
          </div>
        </div>
      </div>


      {/* Dynamic CTA Banner */}
      <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6">
        <div className="relative rounded-3xl border border-[rgba(100,116,139,0.25)] bg-gradient-to-br from-cyan-950/20 via-[#101223]/70 to-[#bc13fe]/15 p-10 text-center shadow-2xl backdrop-blur-2xl glass hover:neon-glow-blue transition-all duration-300">
          <div className="absolute -inset-0.5 rounded-3xl bg-cyan-500/10 blur-xl pointer-events-none" />
          <h3 className="text-2xl font-bold tracking-tight text-white mb-4 sm:text-3xl">Secure Your Distribution Channels Now</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto mb-8">Deploy automated verification node endpoints across your physical supply warehouses within minutes. Protect brand capital, lock out boot networks, and build consumer trust.</p>
          <button 
            onClick={onScanCTA}
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-[#bc13fe] px-6 py-3.5 text-xs font-bold text-white hover:scale-103 transition-all duration-300 shadow-[0_0_20px_rgba(0,242,255,0.35)] cursor-pointer"
          >
            Launch Free Scan Dashboard
          </button>
        </div>
      </div>

      {/* Futuristic footer */}
      <footer className="mt-32 border-t border-slate-900 pt-12 text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-6 sm:px-6 lg:px-8">
          <span className="text-xs font-mono tracking-wider">© 2026 AUTHENTISCAN AI PLATFORM. DECRYPING COUNTERFEITS SECURELY.</span>
          <div className="flex space-x-6 text-xs text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Forensic Whitepaper</span>
            <span className="hover:text-white cursor-pointer transition-colors">API Docs</span>
            <span className="hover:text-white cursor-pointer transition-colors">Legal Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
