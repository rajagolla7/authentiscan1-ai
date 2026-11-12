import React, { useState, useEffect } from "react";
import { Plus, Database, Activity, Users, Send, List } from "lucide-react";
import { AuthenticProduct } from "../types";

interface AdminConsoleProps {
  translations: any;
}

export default function AdminConsole({ translations }: AdminConsoleProps) {
  const [genuineProducts, setGenuineProducts] = useState<AuthenticProduct[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");

  // Create product form states
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodBarcode, setProdBarcode] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImg, setProdImg] = useState("");
  
  // Dynamic specifications tags list
  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([
    { key: "Logo Position", value: "Exact 3.2mm offset" },
    { key: "Material Wrap", value: "Unibody alloy" }
  ]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecVal, setNewSpecVal] = useState("");

  useEffect(() => {
    fetchGenuineDB();
  }, []);

  const fetchGenuineDB = async () => {
    try {
      const response = await fetch("/api/registered-products");
      const data = await response.json();
      setGenuineProducts(data);
    } catch (err) {
      console.error("Error loading genuine products:", err);
    }
  };

  const addSpec = () => {
    if (newSpecKey && newSpecVal) {
      setSpecsList(prev => [...prev, { key: newSpecKey, value: newSpecVal }]);
      setNewSpecKey("");
      setNewSpecVal("");
    }
  };

  const removeSpec = (index: number) => {
    setSpecsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodBarcode) {
      setMessageStatus("Error: Name and Barcode are required parameters");
      return;
    }

    // Convert specs list array to map
    const specsMap: Record<string, string> = {};
    specsList.forEach(s => {
      specsMap[s.key] = s.value;
    });

    try {
      const response = await fetch("/api/registered-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          brand: prodBrand,
          barcode: prodBarcode,
          retailPrice: Number(prodPrice) || 120,
          description: prodDesc,
          specs: specsMap,
          imageUrl: prodImg
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGenuineProducts(prev => [data, ...prev]);
        setIsRegistering(false);
        // Reset
        setProdName("");
        setProdBrand("");
        setProdBarcode("");
        setProdPrice("");
        setProdDesc("");
        setProdImg("");
        setSpecsList([
          { key: "Logo Position", value: "Exact 3.2mm offset" },
          { key: "Material Wrap", value: "Unibody alloy" }
        ]);
        setMessageStatus("");
      }
    } catch (err) {
      console.error("Error submitting post product:", err);
    }
  };

  // Mock standard users desk ledger
  const mockUsers = [
    { email: "rajagolla52@gmail.com", credential: "Chief Sec Analyst", status: "Active Node" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-white text-left animate-fade-in space-y-8 bg-[#05060b]">
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-[#39ff14] uppercase flex items-center gap-1 font-bold neon-text-green">
            <Activity className="h-3.5 w-3.5" />
            <span>{translations?.adminControlDesk || "AUTHENTISCAN ADMIN CONTROL DESK"}</span>
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">{translations?.adminConsoleTitle || "Platform Command Center"}</h2>
          <p className="text-xs text-slate-400 mt-1">{translations?.adminConsoleSub || "Manage standard product parameters blueprints, calibrate detection thresholds, and audit active workspace nodes."}</p>
        </div>
        
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          id="toggle-register-product-btn"
          className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-[#bc13fe] hover:scale-101 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,242,255,0.4)] transition shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{translations?.calibrateNewProduct || "Calibrate New Product"}</span>
        </button>
      </div>

      {isRegistering && (
        <form 
          onSubmit={handleSubmit}
          id="admin-product-registration-form"
          className="rounded-2xl border border-[rgba(100,116,139,0.25)] bg-[#101223]/80 p-6 space-y-5 glass shadow-[0_0_20px_rgba(0,242,255,0.05)]"
        >
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-400 neon-text-blue" />
              <span className="tracking-tight text-white font-black uppercase text-sm">{translations?.recordBenchmarks || "Record Standard Genuine Benchmarks"}</span>
            </h3>
            <p className="text-[11px] text-slate-400">{translations?.provideDimensions || "Provide the dimension blueprint standards so our computer vision algorithms can identify replicas."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase">{translations?.formName || "Product Name *"}</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="Product Name"
                className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase">{translations?.formBrand || "Manufacturer Brand *"}</label>
              <input
                type="text"
                required
                value={prodBrand}
                onChange={(e) => setProdBrand(e.target.value)}
                placeholder="e.g. AuraAudio"
                className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase">{translations?.barcodeLabel || "UPC Barcode Registration *"}</label>
              <input
                type="text"
                required
                value={prodBarcode}
                onChange={(e) => setProdBarcode(e.target.value)}
                placeholder="e.g. 8901234567890"
                className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase">{translations?.priceLabel || "Standard Retail Price ($)"}</label>
              <input
                type="number"
                value={prodPrice}
                onChange={(e) => setProdPrice(e.target.value)}
                placeholder="e.g. 299"
                className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase">{translations?.pictureReference || "Standard Picture Reference Link"}</label>
              <input
                type="url"
                value={prodImg}
                onChange={(e) => setProdImg(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase">{translations?.blueprintDescription || "Standard Blueprint Descriptions"}</label>
            <textarea
              rows={2}
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder="e.g. Official factory packaging dimensions, hologram placements details."
              className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3 outline-none focus:border-[#00f2ff] text-white"
            />
          </div>

          {/* Calibrate Specs Lists */}
          <div className="space-y-3 pt-2">
            <label className="block text-[10px] font-mono text-slate-400 font-semibold uppercase border-b border-slate-800 pb-1">{translations?.subpixelCalibration || "Subpixel Spec Calibration Lists"}</label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Feature label (e.g. Logo offset)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="flex-1 rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-2.5 outline-none text-white focus:border-[#00f2ff]"
              />
              <input
                type="text"
                placeholder="Exact Specification parameter (e.g. 3.2mm)"
                value={newSpecVal}
                onChange={(e) => setNewSpecVal(e.target.value)}
                className="flex-1 rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-2.5 outline-none text-white focus:border-[#00f2ff]"
              />
              <button
                type="button"
                onClick={addSpec}
                className="rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] hover:bg-[#101223] text-[#00f2ff] px-4 py-2 text-xs font-bold font-mono tracking-wider cursor-pointer duration-200 glass font-semibold"
              >
                {translations?.compileSpec || "COMPILE_SPEC"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {specsList.map((sp, idx) => (
                <div key={idx} className="flex items-center space-x-2 rounded bg-[#39ff14]/10 text-[#39ff14] text-[10px] font-mono px-2.5 py-1.5 border border-[#39ff14]/35 font-bold">
                  <span>{sp.key}: {sp.value}</span>
                  <button 
                    type="button" 
                    onClick={() => removeSpec(idx)}
                    className="text-[#ff3131] hover:text-[#ff3131]/80 font-black ml-1 scale-110"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {messageStatus && <p className="text-xs text-[#ff3131] font-mono font-bold">{messageStatus}</p>}

          <div className="flex items-center space-x-3 pt-3">
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#39ff14] to-cyan-500 font-bold px-5 py-2.5 text-xs text-slate-950 shadow-[0_0_15px_rgba(57,255,20,0.4)] transition cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{translations?.recordCalibrations || "Record Registry Calibrations"}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="rounded-lg border border-[rgba(100,116,139,0.3)] bg-slate-900/40 hover:bg-slate-900/60 px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer glass"
            >
              {translations?.cancel || "Cancel"}
            </button>
          </div>
        </form>
      )}

      {/* Admin Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Genuine products inventory catalogs database */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2 font-black">
            <List className="h-4 w-4" />
            <span>{translations?.masterDb || "Master Calibration Database"} ({genuineProducts.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {genuineProducts.map((prod) => (
              <div 
                key={prod.id}
                id={`admin-db-product-${prod.id}`}
                className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/75 p-4 transition duration-300 flex flex-col justify-between glass hover:neon-glow-blue"
              >
                <div>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-[#05060b] mb-3 border border-slate-800">
                    <img 
                      src={prod.imageUrl} 
                      alt="" 
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[8px] font-mono bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30 rounded px-2 py-0.5 uppercase tracking-widest font-bold">CALIBRATED</span>
                  </div>

                  <h4 className="text-xs font-black text-white tracking-tight">{prod.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase font-bold">BRAND: {prod.brand} • SKU: {prod.barcode}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-semibold">Benchmark Price:</span>
                  <span className="font-black text-white font-mono">${prod.retailPrice} USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Node Management desk */}
        <div className="lg:col-span-4 space-y-4 text-left">
          <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2 font-black">
            <Users className="h-4 w-4" />
            <span>{translations?.calibratedNodes || "Calibrated Auditor Nodes"}</span>
          </h3>

          <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/60 p-4 space-y-3.5 glass">
            {mockUsers.map((usr, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <div className="text-left font-mono">
                  <span className="block text-[10px] text-white font-bold leading-none">{usr.email}</span>
                  <span className="block text-[8px] text-zinc-400 mt-1 uppercase leading-none font-semibold">{translations?.authNodeLabel || usr.credential}</span>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  usr.status === 'Active Node' ? 'bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30' : 'bg-[#bc13fe]/15 text-[#bc13fe] border border-[#bc13fe]/30'
                }`}>
                  {usr.status}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[rgba(100,116,139,0.2)] bg-[#101223]/40 p-5 mt-4 space-y-2.5 border-l-4 border-l-[#bc13fe] glass shadow-lg">
            <span className="block text-[10px] font-mono text-[#bc13fe] font-extrabold tracking-widest uppercase neon-text-purple">{translations?.systemIntegrity || "System Integrity"}</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{translations?.systemIntegrityDesc || "Platform security standards enforce absolute tamper resistance. All calibration changes registered by active partner auditor nodes are logged instantaneously on-chain to prevent rogue standard manipulations."}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
