import React, { useState, useRef, useEffect } from "react";
import { Upload, Camera, AlertTriangle, Cpu, QrCode, CheckCircle, ShieldCheck, Sparkles } from "lucide-react";
import LiveWebcamScanner from "./LiveWebcamScanner";
import { ScanResult } from "../types";
import { isFilenameJunk } from "../utils/shoppingQuery";

interface ScannerWorkspaceProps {
  onScanResult: (result: ScanResult) => void;
  translations: any;
  language: string;
}

export default function ScannerWorkspace({ onScanResult, translations, language }: ScannerWorkspaceProps) {
  const [useWebcam, setUseWebcam] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  // Scans history state
  const [historyList, setHistoryList] = useState<ScanResult[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Scans control states
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [forceFake, setForceFake] = useState(false);
  
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState("");
  const [visionEnabled, setVisionEnabled] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load backend vision status and scan history on mount
  useEffect(() => {
    let active = true;
    fetch("/api/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((status) => {
        if (active && status && typeof status.visionEnabled === "boolean") {
          setVisionEnabled(status.visionEnabled);
        }
      })
      .catch(() => {
        if (active) setVisionEnabled(false);
      });

    fetch("/api/scan-history")
      .then((res) => {
        if (!res.ok) throw new Error("History fetch error");
        return res.json();
      })
      .then((data) => {
        if (active) {
          // Keep only the previous 5 scans
          setHistoryList(data.slice(0, 5));
        }
      })
      .catch((err) => console.error("[ScannerWorkspace history load]", err));
    return () => {
      active = false;
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const applyPresetCategory = (type: "headphones" | "serum" | "watch" | "sneakers" | "phone") => {
    if (type === "headphones") {
      setProdName("AirPods Max Wireless Headphones");
      setProdBrand("Apple");
      if (forceFake) {
        setBarcode("7612345674441");
        setPrice("45");
        setSellerName("DiscountGadgets-Online");
      } else {
        setBarcode("8901234567890");
        setPrice("549");
        setSellerName("Apple Authorized Reseller");
      }
    } else if (type === "serum") {
      setProdName("Vitamin C Daily Defense Serum 30ml");
      setProdBrand("ViraDerma");
      if (forceFake) {
        setBarcode("7612345674441");
        setPrice("18");
        setSellerName("GlobexCosmeticDeals");
      } else {
        setBarcode("8901234567890");
        setPrice("85");
        setSellerName("ViraDerma Labs Direct");
      }
    } else if (type === "watch") {
      setProdName("Swiss Quartz Chronograph Watch");
      setProdBrand("ApexHorology");
      if (forceFake) {
        setBarcode("7612345674441");
        setPrice("89");
        setSellerName("CheapLuxuryOutpost");
      } else {
        setBarcode("4001293817162");
        setPrice("1200");
        setSellerName("Apex Horology Swiss Atelier");
      }
    } else if (type === "sneakers") {
      setProdName("Nike Air Force 1 '07 Sneakers");
      setProdBrand("Nike");
      if (forceFake) {
        setBarcode("7612345674441");
        setPrice("32");
        setSellerName("DiscountSneakersWarehouse");
      } else {
        setBarcode("8901234567890");
        setPrice("115");
        setSellerName("Nike Official Store");
      }
    } else if (type === "phone") {
      setProdName("Apple iPhone 15 Pro 128GB");
      setProdBrand("Apple");
      if (forceFake) {
        setBarcode("7612345674441");
        setPrice("220");
        setSellerName("ThirdPartyUnverifiedShop");
      } else {
        setBarcode("8901234567890");
        setPrice("999");
        setSellerName("Apple Flagship Direct");
      }
    }
  };

  const inferBrandFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("aura")) return "AuraAudio";
    if (lowerName.includes("vira")) return "ViraDerma";
    if (lowerName.includes("apex")) return "ApexHorology";
    if (lowerName.includes("apple") || lowerName.includes("airpod") || lowerName.includes("iphone") || lowerName.includes("macbook")) return "Apple";
    if (lowerName.includes("sony")) return "Sony";
    if (lowerName.includes("nike") || lowerName.includes("jordan")) return "Nike";
    if (lowerName.includes("adidas")) return "Adidas";
    if (lowerName.includes("samsung") || lowerName.includes("galaxy")) return "Samsung";
    if (lowerName.includes("rolex")) return "Rolex";
    if (lowerName.includes("cerave")) return "CeraVe";
    if (lowerName.includes("minimalist")) return "Minimalist";
    if (lowerName.includes("boat")) return "boAt";
    if (lowerName.includes("jbl")) return "JBL";
    if (lowerName.includes("bose")) return "Bose";
    if (lowerName.includes("dyson")) return "Dyson";
    if (lowerName.includes("oneplus")) return "OnePlus";
    if (lowerName.includes("puma")) return "Puma";
    return "";
  };

  const runAnalysisWithData = async (
    nameP?: string,
    brandP?: string,
    barcodeP?: string,
    priceP?: string,
    sellerP?: string,
    imgStrP?: string,
    fakeOverride?: boolean
  ) => {
    const isFakeMode = fakeOverride !== undefined ? fakeOverride : forceFake;
    const effectiveImg = imgStrP ?? uploadedImgUrl ?? "";
    const hasRealUpload = Boolean(effectiveImg && !effectiveImg.startsWith("http"));

    const rawName = (nameP !== undefined ? nameP : prodName).trim();
    const rawBrand = (brandP !== undefined ? brandP : prodBrand).trim();
    const rawBarcode = (barcodeP !== undefined ? barcodeP : barcode).trim();
    const rawPrice = (priceP !== undefined ? priceP : price).trim();
    const rawSeller = (sellerP !== undefined ? sellerP : sellerName).trim();

    if (hasRealUpload && visionEnabled === false && (!rawName || isFilenameJunk(rawName)) && !rawBrand) {
      setWarningMsg("AI image auto-recognition requires GEMINI_API_KEY in .env. Please enter the Product Name (and optional Listed Price) on the right, then click Verify.");
      return;
    }

    setIsAnalyzing(true);
    setWarningMsg("");

    const targetName = hasRealUpload
      ? rawName
      : (rawName || (isFakeMode ? "Suspected Counterfeit Replica" : "Genuine Standard Stock"));
    const targetBrand = hasRealUpload
      ? rawBrand
      : (rawBrand || (isFakeMode ? "Unverified Brand" : "Authorized Brand"));
    const targetBarcode = hasRealUpload
      ? rawBarcode
      : (rawBarcode || (isFakeMode ? "7612345674441" : "8901234567890"));
    const targetPrice = hasRealUpload
      ? rawPrice
      : (rawPrice || (isFakeMode ? "24" : "299"));
    const targetSeller = hasRealUpload
      ? rawSeller
      : (rawSeller || (isFakeMode ? "Unverified Marketplace Reseller" : "Official Brand Outlet"));

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: targetName,
          brand: targetBrand,
          barcode: targetBarcode,
          listedPrice: targetPrice,
          seller: targetSeller,
          imageBase64: effectiveImg || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80",
          forceFake: isFakeMode,
          language: language
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.productName && !isFilenameJunk(data.productName)) {
          setProdName(data.productName);
        }
        if (data.brand && !isFilenameJunk(data.brand)) {
          setProdBrand(data.brand);
        }
        // Artificial delay optimized for snappy interactive responses (150ms)
        setTimeout(() => {
          onScanResult(data);
          setIsAnalyzing(false);
          
          // Prepend newly scanned item to local history list state for immediate view update
          setHistoryList((prev) => {
            const exists = prev.some((item) => item.id === data.id);
            if (exists) return prev;
            return [data, ...prev].slice(0, 5);
          });
        }, 150);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (err) {
      console.error(err);
      setWarningMsg("Calibration pipeline timed out. Ensure back-end core is responsive.");
      setIsAnalyzing(false);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setWarningMsg("Unsupported file type. Please upload a high-contrast packaging PNG/JPG.");
      return;
    }
    setWarningMsg("");
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedImgUrl(base64);

      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
      let autoName = prodName.trim();
      let autoBrand = prodBrand.trim();

      if (!autoName || isFilenameJunk(autoName)) {
        if (!isFilenameJunk(baseName)) {
          autoName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
        } else {
          autoName = "";
        }
      }

      if (autoName && (!autoBrand || isFilenameJunk(autoBrand))) {
        autoBrand = inferBrandFromName(autoName);
      }

      setProdName(autoName);
      setProdBrand(autoBrand);

      // If AI Vision is active OR the file/user already supplied a valid product name, run analysis automatically.
      // Otherwise keep the preview ready and ask the user for the product name (or GEMINI_API_KEY).
      if (visionEnabled !== false || (autoName && !isFilenameJunk(autoName))) {
        runAnalysisWithData(autoName, autoBrand, barcode.trim(), price.trim(), sellerName.trim(), base64, forceFake);
      } else {
        setWarningMsg("Photo uploaded! AI auto-detection is offline because GEMINI_API_KEY is not set in .env. Please type the Product Name (and optional Brand/Price) on the right, then click Verify.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const triggerAnalysis = () => {
    runAnalysisWithData(prodName, prodBrand, barcode, price, sellerName, uploadedImgUrl || "", forceFake);
  };

  // Pre-load mock scans parameters instantly to make exploration simple and friendly
  const loadQuickDemoSpec = (idx: number) => {
    if (idx === 1) {
      setProdName("AuraPod Max Noise-Canceling Headphones");
      setProdBrand("AuraAudio");
      setBarcode("8901234567890");
      setPrice("299");
      setSellerName("AuraAudio Authorized Reseller");
      setUploadedImgUrl("https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80");
      setForceFake(false);
    } else if (idx === 2) {
      setProdName("ViraShield Daily Defense Serum 30ml");
      setProdBrand("ViraDerma");
      setBarcode("7612345674441");
      setPrice("22"); // low price triggers suspicious counterfeit indicators
      setSellerName("GlobexCosmeticDeals");
      setUploadedImgUrl("https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80");
      setForceFake(true);
    } else if (idx === 3) {
      setProdName("ApexPro Quartz Chronograph Watch");
      setProdBrand("ApexHorology");
      setBarcode("4001293817162");
      setPrice("1200");
      setSellerName("Apex Horology Swiss Atelier");
      setUploadedImgUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80");
      setForceFake(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-white text-left animate-fade-in bg-[#05060b]">
      
      {/* Dynamic Sandbox preloads section */}
      <div className="mb-6 rounded-xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/60 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass shadow-[0_0_15px_rgba(0,242,255,0.05)]">
        <div className="max-w-xl">
          <span className="block text-[10px] font-mono text-[#00f2ff] font-extrabold tracking-widest uppercase neon-text-blue">
            {translations.sandboxTitle || "Quick Audits Sandbox"}
          </span>
          <p className="text-xs text-slate-400 mt-1 leading-snug">
            {translations.sandboxDesc || "Preload high-fidelity benchmark references to test genuine vs counterfeit detection."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto shrink-0">
          <button 
            type="button" 
            onClick={() => loadQuickDemoSpec(1)}
            id="preload-genuine-btn"
            className="rounded bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 px-3.5 py-2 text-xs font-bold cursor-pointer transition hover:bg-[#39ff14]/20 hover:scale-101 duration-150 text-center"
          >
            {translations.loadGenuine || "Load Genuine AuraPod (98%)"}
          </button>
          <button 
            type="button" 
            onClick={() => loadQuickDemoSpec(2)}
            id="preload-fake-btn"
            className="rounded bg-[#ff3131]/10 text-[#ff3131] border border-[#ff3131]/30 px-3.5 py-2 text-xs font-bold cursor-pointer transition hover:bg-[#ff3131]/20 hover:scale-101 duration-150 text-center"
          >
            {translations.loadFake || "Load Counterfeit Serum (24%)"}
          </button>
          <button 
            type="button" 
            onClick={() => loadQuickDemoSpec(3)}
            id="preload-watch-btn"
            className="rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 px-3.5 py-2 text-xs font-bold cursor-pointer transition hover:bg-cyan-900/30 hover:scale-101 duration-150 text-center"
          >
            Load Swiss Watch (Genuine)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: UPLOAD CHANNELS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Channel selector header tabs */}
          <div className="flex bg-[#101223]/40 border border-[rgba(100,116,139,0.15)] rounded-xl p-1 glass">
            <button
              onClick={() => { setUseWebcam(false); setUploadedImgUrl(null); }}
              id="scantab-file"
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                !useWebcam 
                  ? 'bg-gradient-to-r from-cyan-500 to-[#bc13fe] text-white shadow-[0_0_12px_rgba(0,242,255,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>{translations.staticUpload || "Static File upload"}</span>
            </button>
            <button
              onClick={() => { setUseWebcam(true); }}
              id="scantab-webcam"
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                useWebcam 
                  ? 'bg-gradient-to-r from-cyan-500 to-[#bc13fe] text-white shadow-[0_0_12px_rgba(0,242,255,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="h-4 w-4" />
              <span>{translations.webcamScan || "Webcam Vision Scanner"}</span>
            </button>
          </div>

          {!useWebcam ? (
            /* FILE OVER DROP HOVER DRAGS BOX */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="drag-drop-upload-box"
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer min-h-[240px] flex flex-col justify-center items-center transition glass ${
                dragOver 
                  ? 'border-[#00f2ff] bg-[#00f2ff]/10 neon-glow-blue' 
                  : uploadedImgUrl 
                  ? 'border-[rgba(100,116,139,0.2)] bg-[#101223]/30' 
                  : 'border-[rgba(100,116,139,0.2)] hover:border-[#00f2ff]/60 hover:bg-[#101223]/40'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="file-choose-hidden-elem"
              />

              {uploadedImgUrl ? (
                <div className="relative aspect-video max-h-[220px] rounded-lg overflow-hidden border border-[rgba(100,116,139,0.2)] bg-slate-950 scan-overlay">
                  <img src={uploadedImgUrl} alt="Product file thumbnail upload" className="h-full w-full object-contain" />
                  <div className="scan-line" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white px-3 py-1.5 rounded bg-[#101223] border border-[#00f2ff]/30 shadow-md">Replace Snapshot</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 border border-[rgba(100,116,139,0.2)] text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.1)]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{translations.dragDrop || "Drag & drop files here"}</p>
                    <p className="text-xs text-slate-400 mt-1">High-contrast branding snapshots from product contours yield max neural classification accuracy.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* WEBCAM ACTIVE VIDEO RENDERER */
            <LiveWebcamScanner 
              onCapture={(base64) => { 
                setUploadedImgUrl(base64); 
                setUseWebcam(false); 
                const autoName = prodName || "Webcam Scanned Product";
                setProdName(autoName);
                runAnalysisWithData(autoName, prodBrand, barcode || "7612345674441", price || "24", sellerName || "Unverified Marketplace Reseller", base64, forceFake);
              }}
              isScanning={isAnalyzing}
            />
          )}

          {/* Dedicated Snapshot Calibration & Audit Action Bar */}
          {uploadedImgUrl && (
            <div className="rounded-xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/60 p-4 space-y-3 glass">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-[#00f2ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>Product Preset Autofill:</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Match genuine catalog items</span>
              </div>

              {/* Quick Category Chips */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPresetCategory("headphones")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <span>🎧 AirPods Max</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCategory("serum")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <span>💧 Face Serum</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCategory("watch")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <span>⌚ Swiss Watch</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCategory("sneakers")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <span>👟 Nike Air Force</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetCategory("phone")}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition flex items-center gap-1"
                >
                  <span>📱 iPhone 15 Pro</span>
                </button>
              </div>

              {/* Instant 1-Click Scan Action Buttons */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => {
                    setForceFake(true);
                    runAnalysisWithData(prodName, prodBrand, "7612345674441", "24", "Unverified Marketplace Reseller", uploadedImgUrl, true);
                  }}
                  className="p-3 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/50 text-red-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,49,49,0.2)] hover:scale-101 cursor-pointer disabled:opacity-50"
                >
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <div className="text-left">
                    <span className="block font-black text-[12px] leading-tight">Scan as Counterfeit</span>
                    <span className="block text-[9px] text-red-300 font-mono">Audit replica flaws (Fake ~24%)</span>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => {
                    setForceFake(false);
                    runAnalysisWithData(prodName, prodBrand, "8901234567890", "299", "Official Brand Outlet", uploadedImgUrl, false);
                  }}
                  className="p-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/50 text-emerald-200 text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:scale-101 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <span className="block font-black text-[12px] leading-tight">Verify Genuine Stock</span>
                    <span className="block text-[9px] text-emerald-300 font-mono">Verify on-chain seal (Genuine ~98%)</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Quick analysis loader indicator overlay */}
          {isAnalyzing && (
            <div className="rounded-2xl border border-[#00f2ff]/30 bg-[#101223]/90 p-8 text-center space-y-4 shadow-xl flex flex-col items-center justify-center min-h-[140px] glass neon-glow-blue">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-75"></span>
                <Cpu className="relative h-6 w-6 text-[#00f2ff]" />
              </div>
              <p className="text-xs font-mono text-[#00f2ff] font-bold animate-pulse">{translations.analyzing || "Deconstructing brand grids..."}</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: MANUAL SPECS DETAILS FORM */}
        <div className="lg:col-span-5 rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/70 p-6 space-y-5 glass shadow-[0_0_15px_rgba(0,242,255,0.05)]">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <QrCode className="h-4 w-4 text-[#00f2ff]" />
              <span>{translations.targetParams || "Target Parameters Metadata"}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">AUDIT_REG_V3</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">{translations.productNameLabel || "Product Name *"}</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Product Name / Label details"
                className="w-full rounded-lg bg-[#05060b] border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">{translations.brandLabel || "Manufacturer Brand"}</label>
              <input
                type="text"
                value={prodBrand}
                onChange={(e) => setProdBrand(e.target.value)}
                placeholder="e.g. AuraAudio"
                className="w-full rounded-lg bg-[#05060b] border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">{translations.barcodeLabel || "Barcode Registration (UPC Hash)"}</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="UPC/EAN registration reference"
                className="w-full rounded-lg bg-[#05060b] border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">{translations.priceLabel || "Listed Market price ($)"}</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full rounded-lg bg-[#05060b] border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white transition animate-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">{translations.sellerLabel || "Seller / Merchant Outlet"}</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Globally cosmetics"
                  className="w-full rounded-lg bg-[#05060b] border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white transition"
                />
              </div>
            </div>

            {/* Forensic Audit Intent Selector */}
            <div className="pt-3.5 border-t border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold uppercase text-slate-300">Forensic Audit Intent</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${forceFake ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                  {forceFake ? "🔴 SUSPECTED FAKE" : "🟢 GENUINE STOCK"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setForceFake(true);
                    if (!sellerName || sellerName.includes("Official")) setSellerName("Unverified Marketplace Reseller");
                    if (!barcode || barcode === "8901234567890") setBarcode("7612345674441");
                    if (!price || price === "299") setPrice("24");
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                    forceFake 
                      ? 'border-red-500/60 bg-red-950/40 text-red-300 shadow-[0_0_12px_rgba(255,49,49,0.25)]' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-[11px] leading-tight">Suspected Fake</div>
                    <div className="text-[9px] text-slate-400 font-normal">Detect replica flaws</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForceFake(false);
                    if (!sellerName || sellerName.includes("Unverified")) setSellerName("Official Authorized Reseller");
                    if (!barcode || barcode === "7612345674441") setBarcode("8901234567890");
                    if (!price || price === "24") setPrice("299");
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-bold text-left transition flex items-center gap-2 cursor-pointer ${
                    !forceFake 
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(57,255,20,0.25)]' 
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-[11px] leading-tight">Genuine Stock</div>
                    <div className="text-[9px] text-slate-400 font-normal">Verify authentic hash</div>
                  </div>
                </button>
              </div>
            </div>

            {warningMsg && <p className="text-xs text-[#ff3131] font-mono text-left font-bold">{warningMsg}</p>}

            <button
              id="execute-verification-analysis-btn"
              onClick={triggerAnalysis}
              disabled={isAnalyzing}
              className={`w-full flex items-center justify-center space-x-2 rounded-xl py-3.5 font-bold text-white shadow-xl hover:scale-101 disabled:opacity-40 transition-all duration-300 cursor-pointer text-xs ${
                forceFake 
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-[#bc13fe] hover:shadow-[0_0_20px_rgba(255,49,49,0.4)]' 
                  : 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-[#bc13fe] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]'
              }`}
            >
              {forceFake ? <AlertTriangle className="h-4 w-4" /> : <Cpu className="h-4 w-4" />}
              <span>{forceFake ? "Detect Counterfeit Anomalies (Scan Fake)" : (translations.quickAnalyze || "Verify Genuine Status Indices")}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
