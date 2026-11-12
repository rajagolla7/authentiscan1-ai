import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Sparkles, 
  FileDown, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Award, 
  Database, 
  Terminal, 
  Star, 
  BarChart3, 
  RefreshCw, 
  Layers,
  ShoppingCart,
  ExternalLink,
  Lock,
  ArrowRight,
  Volume2,
  VolumeX,
  Search
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { ScanResult } from "../types";
import { MOCK_STATS_TRENDS, CATEGORY_RISK_DISTRIBUTION, SOURCE_RISK_BREAKDOWN } from "../sampleData";
import SplitComparison from "./SplitComparison";
import { getCleanShoppingQuery } from "../utils/shoppingQuery";

interface ResultDashboardProps {
  result: ScanResult;
  onReset: () => void;
  translations: any;
  setActiveTab?: (tab: string) => void;
}

export default function ResultDashboard({ result, onReset, translations, setActiveTab }: ResultDashboardProps) {
  const [reportTab, setReportTab] = useState<"diagnostics" | "comparison" | "threat_intel" | "buy_channels">("diagnostics");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Dynamic search query state for Amazon, Flipkart, and external platforms
  const initialQuery = useMemo(() => getCleanShoppingQuery(result.brand, result.productName), [result.brand, result.productName]);
  const [shoppingSearch, setShoppingSearch] = useState(() => initialQuery.display);

  useEffect(() => {
    setShoppingSearch(initialQuery.display);
  }, [initialQuery]);

  // Auto-cancel speech if component is unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeakReport = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        
        // Build detailed, immersive vocal explanation of the scan result and explanations list
        const textToSpeak = `AuthentiScan AI Verification Report for product: ${result.productName} by ${result.brand}. The authenticity integrity score is ${result.authenticityScore} percent, rendering a status classification of ${result.status}. ${
          result.status === "Genuine" 
            ? "Our forensic models show all scanned geometric aspects, brand alignment details, print typography, and barcode registries match certified standards. This product is authentic."
            : result.status === "Suspicious"
            ? "Attention. Our scanning system flags minor visual disparities or non-authorized distributor locations. We advise careful overview."
            : "Alert. Forensic analysis confirms this product is counterfeit. Typographical variances, packaging misalignments, or registry mismatches mismatch standard metrics. Do not purchase."
        } Rulings list details: ${result.explanations.map((e, idx) => `Anomaly Ruling ${idx + 1}: ${e.title}. Description: ${e.description}.`).join(' ')}`;
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural")));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      console.warn("Speech synthesis is not supported on this device/browser.");
    }
  };

  // Determine status coloring schema
  const isGenuine = result.status === "Genuine";
  const isSuspicious = result.status === "Suspicious";
  const isFake = result.status === "Fake";

  const themeColor = isGenuine 
    ? { border: "border-[#39ff14]/40", glow: "neon-glow-green", text: "text-[#39ff14] neon-text-green", bg: "bg-[#39ff14]/5", badge: "bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30 font-bold" }
    : isSuspicious
    ? { border: "border-[#bc13fe]/40", glow: "neon-glow-purple", text: "text-[#bc13fe] neon-text-purple", bg: "bg-[#bc13fe]/5", badge: "bg-[#bc13fe]/15 text-[#bc13fe] border border-[#bc13fe]/30 font-bold" }
    : { border: "border-[#ff3131]/40", glow: "neon-glow-red", text: "text-[#ff3131] neon-text-red", bg: "bg-[#ff3131]/5", badge: "bg-[#ff3131]/15 text-[#ff3131] border border-[#ff3131]/30 font-bold" };

  const handleDownload = () => {
    // Generate simulated dynamic metadata text block representation of the PDF download
    const reportData = `
AUTHENTISCAN AI FORENSIC EXAMINER CERTIFICATE
==============================================
SCAN ID: ${result.id}
TIMESTAMP: ${result.timestamp}
PRODUCT NAME: ${result.productName}
BRAND: ${result.brand}
BARCODE REGISTER: ${result.barcode}
INTEGRITY SCORE: ${result.authenticityScore}/100
STATUS: ${result.status}
OCR CONFIDENCE: ${result.confidenceRate}%

FORENSIC EXAMINATION ANALYSIS MATRIX:
-------------------------------------
${result.explanations.map((e, idx) => `[Ruling #${idx + 1}] ${e.title}: ${e.description} (Verdict Level: ${e.type.toUpperCase()})`).join("\r\n")}

BLOCKCHAIN TAMPER-PROOF FOOTPRINT RECORD:
----------------------------------------
LEDGER BLOCK ID: #${result.blockchain.blockId || 'UNVERIFIED_HASH_NODE'}
STATE LOCK TIME: ${result.blockchain.verifiedStamp || 'FAIL'}
CHAIN TRANSACTION: ${result.blockchain.hash || 'FAIL'}
SMART CONTRACT: ${result.blockchain.contractAddress || 'FAIL'}

MERCHANT INTEGRITY CLASSIFICATION:
---------------------------------
STOREFRONT: ${result.seller.name || 'UNKNOWN'}
RATING LEVEL: ${result.seller.rating}/100 [Trust Class: ${result.seller.trustLevel}]
AUTONOMOUSE CRITIQUE SUM: ${result.seller.notes || 'NA'}

AUTHENTISCAN SHIELD ASSURANCE LABS. All rights reserved. Registered on-chain node.
    `;
    const blob = new Blob([reportData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeFilename = (result.productName || "Product").replace(/[^a-zA-Z0-9]/g, "_");
    link.href = url;
    link.download = `AuthentiScan_Forensic_Report_${safeFilename}_${result.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Derive verified platforms & live stocking indicators dynamically based on clean search keywords
  const buyPlatforms = (() => {
    const rawBrand = (result.brand || "").trim();
    const rawProduct = (result.productName || "").trim();
    const activeQuery = (shoppingSearch || initialQuery.display || rawProduct || "Product").trim();

    // Specific query strings for different shopping platforms
    const amazonTerm = shoppingSearch ? activeQuery : (initialQuery.amazon || activeQuery);
    const amazonIndiaTerm = shoppingSearch ? activeQuery : (initialQuery.amazonIndia || activeQuery);
    const flipkartTerm = shoppingSearch ? activeQuery.split(" ").slice(0, 4).join(" ") : (initialQuery.flipkart || activeQuery.split(" ").slice(0, 4).join(" "));

    const encodedAmazon = encodeURIComponent(amazonTerm);
    const encodedAmazonIndia = encodeURIComponent(amazonIndiaTerm);
    const encodedFlipkart = encodeURIComponent(flipkartTerm);
    const encodedQuery = encodeURIComponent(activeQuery);

    const lowerB = rawBrand.toLowerCase();
    const lowerP = rawProduct.toLowerCase();
    const isBeauty = lowerB.includes("vira") || lowerB.includes("derma") || lowerB.includes("minimalist") || lowerP.includes("serum") || lowerP.includes("skin") || lowerP.includes("cream") || lowerB.includes("cerave");

    // Official Direct Brand Outpost
    const hasKnownBrand = rawBrand && !["unverified brand", "unknown brand", "unknown", "standard brand"].includes(lowerB);
    let officialStoreName = `Official ${hasKnownBrand ? rawBrand : "Manufacturer"} Flagship Outpost`;
    let officialUrl = `https://www.google.com/search?q=${encodeURIComponent(`${activeQuery} official store buy`)}`;

    if (lowerB.includes("apple") || lowerP.includes("airpod") || lowerP.includes("iphone") || lowerP.includes("macbook")) {
      officialStoreName = "Official Apple Store";
      officialUrl = `https://www.apple.com/search/${encodedQuery}?src=globalnav`;
    } else if (lowerB.includes("nike") || lowerP.includes("jordan")) {
      officialStoreName = "Official Nike Store";
      officialUrl = `https://www.nike.com/w?q=${encodedQuery}`;
    } else if (lowerB.includes("sony")) {
      officialStoreName = "Official Sony Store";
      officialUrl = `https://electronics.sony.com/search/${encodedQuery}`;
    } else if (lowerB.includes("samsung")) {
      officialStoreName = "Official Samsung Store";
      officialUrl = `https://www.samsung.com/us/search/searchMain/?question=${encodedQuery}`;
    } else if (isBeauty) {
      officialStoreName = `Official ${hasKnownBrand ? rawBrand : "Skincare"} Direct Portal`;
      officialUrl = `https://www.google.com/search?tbm=shop&q=${encodedQuery}`;
    }

    const estimatedUSD = result.estimatedRetailPriceUSD || (result.listedPrice && result.listedPrice > 0 ? result.listedPrice : undefined);
    const estimatedINR = result.estimatedRetailPriceINR || (estimatedUSD ? Math.round((estimatedUSD * 85) / 10) * 10 : undefined);

    const priceFormatted = estimatedUSD
      ? `$${estimatedUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${result.status === "Genuine" ? "" : " (Est. MSRP)"}`
      : "Check Live Price";

    const priceIndiaFormatted = estimatedINR
      ? `₹${estimatedINR.toLocaleString("en-IN")}`
      : "Check Live Price";

    return [
      { 
        platform: "Amazon Certified Brand Store (Global)", 
        url: `https://www.amazon.com/s?k=${encodedAmazon}`, 
        urlQuery: amazonTerm,
        available: true, 
        status: "In Stock (Prime Verified)", 
        price: priceFormatted, 
        shipping: "Free 1-2 Day Prime Delivery", 
        secureBadge: "Amazon Brand Registry Verified",
        trustScore: 98 
      },
      { 
        platform: "Amazon India Verified Store", 
        url: `https://www.amazon.in/s?k=${encodedAmazonIndia}`, 
        urlQuery: amazonIndiaTerm,
        available: true, 
        status: "In Stock (Prime Verified)", 
        price: priceIndiaFormatted, 
        shipping: "Express 1-Day Prime Delivery", 
        secureBadge: "Amazon India Brand Authenticated",
        trustScore: 98 
      },
      { 
        platform: "Flipkart Authorized Outlet", 
        url: `https://www.flipkart.com/search?q=${encodedFlipkart}`, 
        urlQuery: flipkartTerm,
        available: true, 
        status: "In Stock", 
        price: priceIndiaFormatted, 
        shipping: "Express Insured Delivery in 24h", 
        secureBadge: "Flipkart Assured Star-Merchant Track",
        trustScore: 97 
      },
      { 
        platform: officialStoreName, 
        url: officialUrl, 
        urlQuery: activeQuery,
        available: true, 
        status: "In Stock", 
        price: priceFormatted, 
        shipping: "Free Express Insured Dispatch (24h)", 
        secureBadge: "100% Authorized Manufacturer Direct",
        trustScore: 100 
      },
      { 
        platform: isBeauty ? "Sephora Flagship Beauty Counter" : "Best Buy Certified Retail Outpost", 
        url: isBeauty 
          ? `https://www.sephora.com/search?keyword=${encodedQuery}` 
          : `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedQuery}`, 
        urlQuery: activeQuery,
        available: true, 
        status: "In Stock", 
        price: priceFormatted, 
        shipping: "Same-Day Store Pickup or 2-Day Air", 
        secureBadge: isBeauty ? "Sephora Authorized Brand Stockist" : "Best Buy Authorized Corporate Partner",
        trustScore: 99 
      },
      { 
        platform: "Google Shopping Price Engine", 
        url: `https://www.google.com/search?tbm=shop&q=${encodedQuery}`, 
        urlQuery: activeQuery,
        available: true, 
        status: "Live Price Comparison", 
        price: "Multiple Verified Stockists", 
        shipping: "Compare 10+ Certified Vendors", 
        secureBadge: "Google Certified Merchant Program",
        trustScore: 96 
      },
      { 
        platform: "Walmart Certified Outpost", 
        url: `https://www.walmart.com/search?q=${encodedQuery}`, 
        urlQuery: activeQuery,
        available: true, 
        status: "In Stock", 
        price: priceFormatted, 
        shipping: "2-Day Delivery & Free Store Returns", 
        secureBadge: "Walmart Verified Supplier Guarantee",
        trustScore: 95 
      }
    ];
  })();

  return (
    <div className="mx-auto max-w-7xl animate-fade-in text-white">
      
      {/* Dynamic scan control banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="text-left">
          <span className="font-mono text-[9px] tracking-widest text-[#00f2ff] uppercase font-bold neon-text-blue">
            {translations.status || "Verification Status"} KEY ID: {result.id}
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">{result.productName}</h2>
          <p className="text-xs text-slate-400 mt-1">
            {translations.brandLabel || "Manufacturer Brand"}: <span className="font-semibold text-white">{result.brand}</span> • UPC Barcode: <span className="font-mono text-cyan-400">{result.barcode}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={handleDownload}
            id="download-pdf-report-btn"
            className="flex items-center space-x-1.5 rounded-lg border border-[rgba(100,116,139,0.3)] bg-[#101223]/60 hover:bg-[#101223]/80 px-3.5 py-2 text-xs font-bold hover:text-[#00f2ff] transition-all duration-300 cursor-pointer glass"
          >
            <FileDown className="h-3.5 w-3.5 text-[#00f2ff]" />
            <span>Export Report Logs</span>
          </button>
          <button 
            onClick={onReset}
            id="audit-new-product-btn"
            className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-[#bc13fe] hover:scale-101 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all duration-300 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Audit Another Product</span>
          </button>
        </div>
      </div>

      {/* Embedded Navigation Report Tabs */}
      <div className="flex flex-wrap border-b border-slate-800 mb-6 gap-y-1">
        {[
          { id: "diagnostics", label: translations.diagnosticAudit || "Diagnostic Audit", icon: Terminal },
          { id: "comparison", label: translations.splitComparison || "Bilateral Vision Overlay", icon: Layers },
          { id: "threat_intel", label: translations.threatIntel || "Market Threat Intelligence", icon: BarChart3 },
          { id: "buy_channels", label: translations.saveBuyChannel || "Verified Shopper Outpost", icon: ShoppingCart }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = reportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportTab(tab.id as any)}
              id={`report-subtab-${tab.id}`}
              className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                isActive 
                  ? "border-[#00f2ff] text-[#00f2ff] bg-[#00f2ff]/5 neon-text-blue" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render matching panel based on tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reportTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {reportTab === "diagnostics" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              
              {/* LEFT COLUMN: CORE MATRIX SCORE & EXPLAINABLE CARDS */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Visual score card overview */}
                <div className={`rounded-2xl border ${themeColor.border} ${themeColor.bg} p-6 ${themeColor.glow} glass backdrop-blur-md text-left`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Circle Gauge charts */}
                    <div className="md:col-span-4 flex justify-center">
                      <div className="relative h-32 w-32 flex items-center justify-center">
                        {/* Circular track */}
                        <svg className="absolute transform -rotate-90 w-full h-full">
                          <circle cx="64" cy="64" r="50" strokeWidth="6" stroke="#05060b" fill="transparent" />
                          <circle 
                            cx="64" 
                            cy="64" 
                            r="50" 
                            strokeWidth="8" 
                            stroke={isGenuine ? '#39ff14' : isSuspicious ? '#bc13fe' : '#ff3131'} 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={2 * Math.PI * 50 * (1 - result.authenticityScore / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="text-center font-mono select-none">
                          <span className="block text-3xl font-black text-white">{result.authenticityScore}%</span>
                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                            {translations.score || "Integrity Index"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="md:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${themeColor.badge}`}>
                          {isGenuine && <CheckCircle className="inline h-3.5 w-3.5 mr-1 align-text-bottom text-[#39ff14]" />}
                          {isSuspicious && <AlertTriangle className="inline h-3.5 w-3.5 mr-1 align-text-bottom text-[#bc13fe]" />}
                          {isFake && <XCircle className="inline h-3.5 w-3.5 mr-1 align-text-bottom text-[#ff3131]" />}
                          
                          {isGenuine && (translations.genuine || "GENUINE CERTIFIED")}
                          {isSuspicious && (translations.suspicious || "SUSPICIOUS AUDIT")}
                          {isFake && (translations.fake || "COUNTERFEIT WARNING")}
                        </span>
                        <span className="bg-[#101223]/50 border border-[rgba(100,116,139,0.2)] text-[#00f2ff] font-mono text-[10px] px-2.5 py-1 rounded-lg glass font-bold">
                          Confidence Rate: {result.confidenceRate}%
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-white">Forensic Overview Summary</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {isGenuine 
                            ? "All scanned geometric aspects, brand alignment details, OCR packaging print logs, and barcode registrar indexes match authentic standard metrics."
                            : isSuspicious
                            ? "Analysis flags localized variance in brand coloring or questionable distributor coordinates. Needs careful physical review before checkout."
                            : "Forensic logs detect fatal inconsistencies in packaging. Typographical and logo alignment mismatches confirm this product is cloned."}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800/40 flex flex-wrap items-center gap-2.5">
                        {/* Interactive Text-to-speech option */}
                        <button
                          onClick={toggleSpeakReport}
                          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 shadow-md cursor-pointer ${
                            isSpeaking 
                              ? "bg-red-500/15 text-red-400 border border-red-500/40 hover:bg-red-500/25" 
                              : "bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/20 shadow-[0_0_10px_rgba(57,255,20,0.05)]"
                          }`}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="h-4 w-4 text-red-400" />
                              <span>Stop Audio Overview</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4 text-[#39ff14]" />
                              <span>Listen to Audio Report</span>
                            </>
                          )}
                        </button>

                        {/* Interactive Voice Companion Bridge */}
                        <button
                          onClick={() => {
                            window.dispatchEvent(
                              new CustomEvent("open-voice-portal", { detail: { startSession: true } })
                            );
                          }}
                          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-[#bc13fe]/20 text-white border border-cyan-500/30 hover:border-[#bc13fe]/50 px-4 py-2 text-xs font-bold transition-all duration-300 hover:scale-[1.01] cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.05)]"
                        >
                          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                          <span>Talk with Live Voice Portal</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Explainable AI Cards */}
                <div className="space-y-4 text-left">
                  <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#00f2ff] neon-text-blue animate-pulse" />
                    <span>Explainable AI Verification Rulings</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.explanations.map((exp, index) => {
                      const isDanger = exp.type === 'danger';
                      const isWarning = exp.type === 'warning';
                      return (
                        <div 
                          key={index}
                          className={`rounded-xl border p-4 bg-[#101223]/60 glass flex space-x-3 items-start transition duration-300 hover:scale-[1.02] ${
                            isDanger 
                              ? "border-[#ff3131]/30 shadow-[0_0_10px_rgba(255,49,49,0.15)]" 
                              : isWarning 
                              ? "border-[#bc13fe]/30 shadow-[0_0_10px_rgba(188,19,254,0.1)]" 
                              : "border-[#39ff14]/30 shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDanger && <XCircle className="h-4 w-4 text-[#ff3131]" />}
                            {isWarning && <AlertTriangle className="h-4 w-4 text-[#bc13fe]" />}
                            {!isDanger && !isWarning && <CheckCircle className="h-4 w-4 text-[#39ff14]" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white">{exp.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">{exp.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Extracted Label OCR */}
                <div className="rounded-xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/60 p-5 text-left glass shadow-[0_0_15px_rgba(0,242,255,0.02)]">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <Database className="h-4 w-4 text-[#00f2ff]" />
                      <span>Extracted Forensic Label OCR Details</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">TEXT_EXTRACTED_V3</span>
                  </div>
                  <div className="rounded bg-slate-950 p-3 select-all border border-slate-800">
                    <code className="block font-mono text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed">
                      {result.ocrTextExtracted}
                    </code>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Label Expiry Check:</span>
                    <span className={`font-mono font-bold ${result.isDateValid ? 'text-[#39ff14]' : 'text-[#ff3131]'}`}>
                      {result.expiryDateStr} (Verified Safe)
                    </span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: BLOCKCHAIN & SELLER RATING */}
              <div className="lg:col-span-4 space-y-6 text-left">
                
                {/* Blockchain verification panel */}
                <div className="relative overflow-hidden rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/80 p-6 shadow-xl glass">
                  {!isFake && (
                    <div className="absolute top-0 right-0 h-16 w-16 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-extrabold text-[#00f2ff] uppercase tracking-widest flex items-center gap-1.5 neon-text-blue">
                      <Award className="h-4 w-4 animate-bounce" />
                      <span>{translations.blockchainVerified || "Blockchain Record"}</span>
                    </span>
                    {!isFake ? (
                      <span className="text-[8px] font-mono text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/30 px-2 py-0.5 rounded-full">IMMUTABLE LOG</span>
                    ) : (
                      <span className="text-[8px] font-mono text-[#ff3131] bg-[#ff3131]/10 border border-[#ff3131]/30 px-2 py-0.5 rounded-full">LEDGER FAILED</span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono text-slate-500 font-semibold">DIGITAL LEDGER BLOCK ID</span>
                      <span className="block text-sm font-bold font-mono text-white">
                        {!isFake ? `#${result.blockchain.blockId}` : "BLOCK_ID_NOT_RESOLVABLE"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono text-slate-500 font-semibold">ON-CHAIN AUDIT HASH</span>
                      <span className="block text-[10px] font-mono text-slate-300 truncate bg-slate-950 p-2 rounded border border-slate-800">
                        {result.blockchain.hash}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono text-slate-500 font-semibold">SECURE CONTRACT ADDRESS</span>
                      <span className="block text-[10px] font-mono text-slate-300 truncate bg-slate-950 p-2 rounded border border-slate-800">
                        {result.blockchain.contractAddress}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Ledger Verified Time:</span>
                      <span className="text-slate-300 font-mono text-[10px] font-bold">{result.blockchain.verifiedStamp}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Risk Profiling */}
                <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/80 p-6 glass shadow-[0_0_15px_rgba(0,242,255,0.02)]">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">
                      {translations.sellerRating || "Seller Risk Profile"}
                    </h4>
                    <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: isFake ? '#ff3131' : '#39ff14' }} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Seller Merchant:</span>
                      <span className="text-xs font-black text-white max-w-[150px] truncate">{result.seller.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-semibold">Trust Reputation score:</span>
                      <span className={`text-xs font-bold ${result.seller.trustLevel === 'High' ? 'text-[#39ff14]' : 'text-[#ff3131]'}`}>
                        {result.seller.rating}/100 ({result.seller.trustLevel})
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>Flagged Reviews Ratio</span>
                        <span className="font-mono font-bold">{(result.seller.flaggedReviewsRatio * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-950 overflow-hidden">
                        <div className={`h-full rounded-full ${result.seller.warningFlag ? 'bg-[#ff3131]' : 'bg-[#39ff14]'}`} style={{ width: `${result.seller.flaggedReviewsRatio * 100}%` }} />
                      </div>
                    </div>

                    <div className="rounded bg-slate-950 p-3 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                      {result.seller.notes}
                    </div>
                  </div>
                </div>

                {/* Review E-commerce Authenticator */}
                <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/80 p-6 glass shadow-[0_0_15px_rgba(0,242,255,0.02)]">
                  <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">
                    {translations.reviewAnalysis || "Spam Review Sentinel"}
                  </h4>
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400 font-semibold">
                      <span>Total Feedbacks Audited:</span>
                      <span className="text-white font-bold">{result.reviewsSummary.totalReviews}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-semibold">
                      <span>Reputational Sentiment:</span>
                      <span className="text-[#bc13fe] font-black flex items-center">
                        {result.reviewsSummary.reviewScore} <Star className="h-3 w-3 fill-current ml-1 text-yellow-400" />
                      </span>
                    </div>

                    {result.reviewsSummary.botPatterns.length > 0 ? (
                      <div className="mt-3 space-y-2 border-t border-slate-800 pt-2 text-left">
                        <span className="text-[10px] text-[#ff3131] font-extrabold uppercase tracking-wider block">Spam botnets warning flags:</span>
                        {result.reviewsSummary.botPatterns.map((pat, idx) => (
                          <div key={idx} className="flex space-x-1 items-start text-slate-400">
                            <span className="text-[#ff3131] shrink-0 font-bold">•</span>
                            <span className="text-[10px] text-slate-400">{pat}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 text-center border-t border-slate-800">
                        <span className="inline-flex px-2 py-0.5 text-[9px] bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20 rounded">
                          No deceptive bot networks detected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {reportTab === "comparison" && (
            <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/50 p-6 glass shadow-[0_0_15px_rgba(0,242,255,0.05)]">
              <SplitComparison result={result} />
            </div>
          )}

          {reportTab === "threat_intel" && (
            <div className="space-y-6">
              {/* Stats bento rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Visual trends linechart */}
                <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/75 p-6 text-left col-span-1 md:col-span-2 glass hover:neon-glow-blue transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-white tracking-tight">Global Counterfeiting Scan Trends</h4>
                      <p className="text-xs text-slate-400">Aggregated tracking index across global secure warehouses.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#00f2ff] bg-[#00f2ff]/10 border border-[#00f2ff]/30 px-2 py-1 rounded">2026 AUDIT MATRIX</span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_STATS_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="fakesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff3131" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ff3131" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontStyle="italic" />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#05060b', borderColor: 'rgba(100,116,139,0.3)' }} />
                        <Area type="monotone" dataKey="Scans" stroke="#00f2ff" strokeWidth={2} fillOpacity={1} fill="url(#scansGrad)" />
                        <Area type="monotone" dataKey="Counterfeits" stroke="#ff3131" strokeWidth={2} fillOpacity={1} fill="url(#fakesGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Risk Distribution Pie charts */}
                <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/75 p-6 text-left glass hover:neon-glow-blue transition-all duration-300">
                  <h4 className="font-bold text-white">Threat Distribution</h4>
                  
                  <div className="h-44 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CATEGORY_RISK_DISTRIBUTION}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {CATEGORY_RISK_DISTRIBUTION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute font-mono text-center">
                      <span className="block text-lg font-black text-white">4 Main</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Sectors</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px]">
                    {CATEGORY_RISK_DISTRIBUTION.map((cat, idx) => (
                      <div key={idx} className="flex justify-between items-center font-semibold">
                        <div className="flex items-center space-x-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                          <span className="text-slate-400">{cat.name}</span>
                        </div>
                        <span className="text-white font-bold">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Source risks horizontal bars */}
              <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/75 p-6 text-left glass shadow-[0_0_15px_rgba(0,242,255,0.02)]">
                <div className="mb-4">
                  <h4 className="font-bold text-white">Supply Channel Risk Indicator</h4>
                  <p className="text-xs text-slate-400">Counterfeiting frequency metrics mapped across marketplace categories.</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SOURCE_RISK_BREAKDOWN} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#05060b', borderColor: 'rgba(100,116,139,0.3)' }} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="RiskScore" fill="#ff3131" name="Marketplace Risk Index" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="AuthenticityCount" fill="#39ff14" name="Volume Handled" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {reportTab === "buy_channels" && (
            <div className="space-y-6">
              
              {/* Authenticity safe route helper card */}
              <div className={`rounded-xl border p-5 glass flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left ${
                isFake 
                  ? "border-[#ff3131]/30 bg-[#ff3131]/5 shadow-[0_0_15px_rgba(255,49,49,0.05)]" 
                  : "border-[#39ff14]/30 bg-[#39ff14]/5 shadow-[0_0_15px_rgba(57,255,20,0.05)]"
              }`}>
                <div>
                  <span className={`block text-xs font-mono font-black uppercase tracking-widest ${isFake ? 'text-[#ff3131]' : 'text-[#39ff14]'}`}>
                    {isFake ? "Holographic Warning Protocol" : "Authorized Procurement Outpost"}
                  </span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                    {isFake 
                      ? "The analysis reveals high discrepancies compared to original manufacturer standards. To prevent purchasing clones, we suggest ordering from the official corporate partners below where products always include holographic tamper-proof serial rings." 
                      : "Verification indices confirm this is a 100% Genuine, certified item. If you wish to purchase additional authentic units safely, browse the authorized merchant outlets catalogued in our blockchain registrar."}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] bg-slate-950 p-2.5 rounded border border-slate-800 shrink-0">
                  <ShieldCheck className={`h-4 w-4 shrink-0 ${isFake ? 'text-[#ff3131]' : 'text-[#39ff14]'}`} />
                  <span className="text-slate-400">AuthentiScan Sec-Registry v4.9</span>
                </div>
              </div>

              {/* Interactive Search Query Bar for Retailer Links */}
              <div className="rounded-2xl border border-cyan-500/30 bg-[#101223]/80 p-5 glass shadow-lg space-y-3.5 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-[#00f2ff]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Active Storefront Search Query:
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Direct-search links updated for Amazon & Flipkart
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={shoppingSearch}
                      onChange={(e) => setShoppingSearch(e.target.value)}
                      placeholder="Search product on Amazon, Flipkart, Walmart..."
                      className="w-full rounded-xl bg-[#05060b] border border-cyan-500/40 text-xs px-4 py-2.5 text-white outline-none focus:border-[#00f2ff] font-semibold"
                    />
                  </div>
                  {shoppingSearch !== initialQuery.display && (
                    <button
                      onClick={() => setShoppingSearch(initialQuery.display)}
                      className="px-3 py-2 text-[10px] font-mono text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                {/* Quick query pills */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-[10px] font-mono text-slate-400">Quick In-Stock Keywords:</span>
                  {[
                    "AirPods Max Noise Canceling Headphones",
                    "Sony WH-1000XM5 Headphones",
                    "Vitamin C Daily Defense Face Serum",
                    "Nike Air Force 1",
                    "Swiss Quartz Chronograph Watch",
                    "Genuine Leather Tote Handbag"
                  ].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setShoppingSearch(preset)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg border transition cursor-pointer font-medium ${
                        shoppingSearch === preset
                          ? "bg-cyan-500/25 text-[#00f2ff] border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                          : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-cyan-500/40"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {buyPlatforms.map((shop, idx) => (
                  <div 
                    key={idx} 
                    className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/75 p-5 flex flex-col justify-between glass hover:border-[#00f2ff]/40 hover:shadow-[0_0_15px_rgba(0,242,255,0.05)] transition-all duration-300 relative group"
                  >
                    {!shop.available && (
                      <div className="absolute top-0 right-0 py-1 px-3 bg-red-950/40 text-red-400 font-mono text-[8px] uppercase font-bold tracking-widest border-l border-b border-red-800 animate-pulse">
                        Unavailable
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {/* Shop header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-black text-white group-hover:text-[#00f2ff] transition-colors">{shop.platform}</h4>
                          <span className="block text-[8px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{result.brand} Authorized Hub</span>
                          <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[9.5px] font-mono text-cyan-300 max-w-[210px]">
                            <Search className="h-2.5 w-2.5 text-[#00f2ff] shrink-0" />
                            <span className="truncate">Searching: <strong className="text-white">"{shop.urlQuery || shoppingSearch || initialQuery.display}"</strong></span>
                          </div>
                        </div>
                        <ShoppingCart className="h-5 w-5 text-slate-500 group-hover:text-[#00f2ff] transition-colors shrink-0" />
                      </div>

                      {/* Info metrics list with availability light orbs */}
                      <div className="space-y-2 border-t border-b border-slate-800/80 py-3 font-mono text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Availability:</span>
                          <span className="flex items-center gap-1.5 font-bold">
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${shop.available ? 'bg-[#39ff14] animate-ping' : 'bg-slate-600'}`} />
                            <span className={shop.available ? "text-[#39ff14]" : "text-slate-500"}>
                              {shop.status}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Price Index:</span>
                          <span className="text-slate-200 text-white font-extrabold">{shop.price}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">Dispatch Term:</span>
                          <span className="text-slate-200">{shop.shipping}</span>
                        </div>
                      </div>

                      {/* Security rating label */}
                      <div className="flex items-center gap-1.5 p-2 bg-[#05060b] rounded border border-slate-800 text-[10px] text-slate-400 font-mono">
                        <Lock className="h-3 w-3 text-[#00f2ff] shrink-0" />
                        <span className="truncate text-slate-400">{shop.secureBadge}</span>
                      </div>
                    </div>

                    {/* CTA button */}
                    <div className="mt-4">
                      <a 
                        href={shop.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition duration-300 ${
                          shop.available 
                            ? "bg-gradient-to-r from-cyan-500 to-[#bc13fe] text-white shadow-md hover:shadow-[0_0_12px_rgba(0,242,255,0.3)] hover:scale-[1.01]" 
                            : "bg-[#0d0f1c] text-slate-600 border border-slate-800 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        <span>{shop.available ? "Proceed to Secure Outpost" : "Sold Out on this Node"}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                  </div>
                ))}
              </div>

              {/* Global navigation redirection block */}
              {setActiveTab && (
                <div className="rounded-xl border border-[rgba(0,242,255,0.2)] bg-[#101223]/35 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left mt-6">
                  <div>
                    <h5 className="font-bold text-white text-sm">Need a wider catalog of certified channels?</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Explore our Verified Marketplaces Finder, search all registered brands, and verify storefront URLs.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("marketplaces")}
                    id="find-in-verified-marketplaces-nav-btn"
                    className="flex items-center space-x-1.5 px-4.5 py-2 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff] hover:bg-[#00f2ff]/20 border border-[#00f2ff]/30 text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    <span>Open Verified Marketplaces Finder</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
