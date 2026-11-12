import { useState } from "react";
import { AlertOctagon, Eye, ShieldCheck, Info } from "lucide-react";
import { ScanResult } from "../types";
import { SAMPLE_AUTHENTIC_PRODUCTS } from "../sampleData";

interface SplitComparisonProps {
  result: ScanResult;
}

export default function SplitComparison({ result }: SplitComparisonProps) {
  const [hoveredAnomalyId, setHoveredAnomalyId] = useState<string | null>(null);

  // Fallback authentic image
  const authenticBase = SAMPLE_AUTHENTIC_PRODUCTS.find(p => p.brand === result.brand) || SAMPLE_AUTHENTIC_PRODUCTS[0];

  const hasAnomalies = result.anomalies && result.anomalies.length > 0;

  return (
    <div className="space-y-6 text-white bg-[#05060b] p-2 rounded-xl">
      
      {/* Visual HUD header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4 text-left">
        <div>
          <h3 className="text-md font-black tracking-tight text-white flex items-center gap-2 uppercase">
            <Eye className="h-5 w-5 text-[#00f2ff] neon-text-blue" />
            <span>Bilateral Vision Overlay Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">Side-by-side visual analysis. Comparing uploaded asset signature against registered Brand standards.</p>
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-[#39ff14] animate-pulse" />
          <span className="text-slate-400 font-bold uppercase">Node Status: Calibrated</span>
        </div>
      </div>

      {/* Main Split Screens layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* ORIGINAL MASTER REFERENCE SCREEN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs font-black text-[#39ff14] uppercase tracking-widest flex items-center gap-1.5 neon-text-green">
              <ShieldCheck className="h-4 w-4 animate-pulse" />
              <span>Genuine Standard Blueprint</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">REF_ID: #{authenticBase.id}</span>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 border border-[#39ff14]/20 flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.05)]">
            
            {/* Cyber Reticles and Dimensions */}
            <div className="absolute inset-0 border border-[#39ff14]/10 [mask-image:radial-gradient(circle,_transparent_40%,#000_100%)] pointer-events-none" />
            <div className="absolute top-2 left-2 text-[9px] font-mono text-[#39ff14]/40 tracking-wider font-bold">SECURE REGISTERED TEMPLATE</div>
            
            <img 
              src={authenticBase.imageUrl} 
              alt="Authentic standard reference box" 
              className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />

            {/* Simulated green verification vector grids */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none stroke-[#39ff14]/15 fill-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="10%" y1="0" x2="10%" y2="100%" />
              <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="4 4" stroke="rgba(57,255,20,0.35)" />
              <line x1="90%" y1="0" x2="90%" y2="100%" />
              <line x1="0" y1="10%" x2="100%" y2="10%" />
              <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4 4" stroke="rgba(57,255,20,0.35)" />
              <line x1="0" y1="90%" x2="100%" y2="90%" />
            </svg>

            {/* Glowing Authentic center target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <div className="h-14 w-14 rounded-full border border-[#39ff14]/25 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute text-[8px] font-mono text-[#39ff14]/50 font-bold uppercase tracking-widest bg-slate-950/85 border border-[#39ff14]/25 px-2 py-0.5 rounded leading-none whitespace-nowrap">Standard Align</span>
            </div>
          </div>

          {/* Genuine registry parameters */}
          <div className="rounded-xl bg-[#101223]/70 p-4 border border-[rgba(100,116,139,0.2)] text-left space-y-2 text-xs glass">
            <span className="block font-mono text-[9px] text-[#39ff14] font-black tracking-wider uppercase">SECURE VERIFIED BLUEPRINTS:</span>
            {Object.entries(authenticBase.specs).map(([key, val], i) => (
              <div key={i} className="flex justify-between items-start gap-4 py-1 border-b border-slate-800/60 last:border-0 font-semibold text-slate-300">
                <span className="text-slate-500 shrink-0 font-bold">{key}:</span>
                <span className="text-slate-300 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* UPLOADED AUDIT SUSPECT SCREEN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className={`font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${hasAnomalies ? 'text-[#ff3131] neon-text-red' : 'text-[#39ff14] neon-text-green'}`}>
              <AlertOctagon className="h-4 w-4" />
              <span>Uploaded Client Asset</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">AUDIT_LOG: #{result.id}</span>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 border border-[#ff3131]/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,49,49,0.05)]">
            
            {/* Cyber Scan line effect */}
            <div className="absolute inset-x-0 h-0.5 bg-[#ff3131]/55 shadow-[0_0_12px_rgba(255,49,49,0.6)] top-[40%] pointer-events-none" />
            <div className="absolute inset-0 border border-[#ff3131]/10 [mask-image:radial-gradient(circle,_transparent_40%,#000_100%)] pointer-events-none" />

            <img 
              src={result.imageUrl} 
              alt="Uploaded user item for comparison check" 
              className="h-full w-full object-cover opacity-80"
            />

            {/* Simulated red failure grid overlay if counterfeit */}
            {hasAnomalies && (
              <svg className="absolute inset-0 h-full w-full pointer-events-none stroke-[#ff3131]/15 fill-none" xmlns="http://www.w3.org/2000/svg">
                <line x1="25%" y1="0" x2="25%" y2="100%" />
                <line x1="75%" y1="0" x2="75%" y2="100%" />
                <line x1="0" y1="25%" x2="100%" y2="25%" />
                <line x1="0" y1="75%" x2="100%" y2="75%" />
              </svg>
            )}

            {/* Coordinate markers pins for anomalies */}
            {(result.anomalies || []).map((an) => {
              const isActive = hoveredAnomalyId === an.id;
              return (
                <div
                  key={an.id}
                  className="absolute cursor-pointer group"
                  style={{ left: `${an.coordinates.x}%`, top: `${an.coordinates.y}%` }}
                  onMouseEnter={() => setHoveredAnomalyId(an.id)}
                  onMouseLeave={() => setHoveredAnomalyId(null)}
                  id={`anomaly-pin-${an.id}`}
                >
                  <div className="relative flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${an.severity === 'high' ? 'bg-[#ff3131]' : 'bg-[#bc13fe]'}`} />
                    <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border border-white items-center justify-center text-[7px] font-black text-white shadow-lg ${an.severity === 'high' ? 'bg-[#ff3131]' : 'bg-[#bc13fe]'}`}>
                      !
                    </span>
                  </div>

                  {/* Tiny floating labels over coordinate pins */}
                  <div className={`absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-950/95 border border-[#ff3131]/30 px-2 py-1 rounded text-[9px] font-mono font-black uppercase tracking-wider text-[#ff3131] whitespace-nowrap transition-all duration-300 shadow-[0_0_15px_rgba(255,49,49,0.3)] ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                  }`}>
                    {an.feature}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suspect findings table descriptions list */}
          <div className="space-y-2 text-left">
            <span className="block font-mono text-[9px] text-[#ff3131] font-black tracking-wider uppercase">
              {hasAnomalies ? "DETECTION WARNINGS REPORT:" : "NO ANOMALIES RECORDED ON-DEVICE"}
            </span>

            {hasAnomalies ? (
              <div className="grid grid-cols-1 gap-2.5">
                {result.anomalies.map((an) => {
                  const isHovered = hoveredAnomalyId === an.id;
                  return (
                    <div 
                      key={an.id}
                      onMouseEnter={() => setHoveredAnomalyId(an.id)}
                      onMouseLeave={() => setHoveredAnomalyId(null)}
                      className={`p-3 rounded-lg border bg-[#101223]/75 transition-all duration-200 glass text-left shadow-sm ${
                        isHovered 
                          ? "border-[#ff3131]/80 bg-[#ff3131]/10 shadow-[0_0_12px_rgba(255,49,49,0.15)]" 
                          : "border-[rgba(100,116,139,0.2)] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-white uppercase">{an.feature}</span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          an.severity === 'high' 
                            ? 'bg-[#ff3131]/15 text-[#ff3131] border border-[#ff3131]/30' 
                            : 'bg-[#bc13fe]/15 text-[#bc13fe] border border-[#bc13fe]/30'
                        }`}>
                          {an.severity} RISK
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">{an.description}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-[#39ff14]/30 bg-[#39ff14]/10 p-4 text-center glass">
                <p className="text-xs text-[#39ff14] leading-relaxed font-mono font-semibold">Bilateral visual overlay confirms perfect symmetrical logo alignment, coloring integrity, and typography packaging indices. Counterfeiting chance is calculated below 0.5%.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Helper info overlay explaining pin interactions */}
      {hasAnomalies && (
        <div className="rounded-xl border border-[rgba(100,116,139,0.20)] bg-[#101223]/50 border-l-4 border-l-cyan-500 p-4 text-left flex gap-3.5 items-start glass">
          <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs">
            <h4 className="font-bold text-white uppercase tracking-tight">Dynamic Coordinate Interactions Enabled</h4>
            <p className="text-slate-400 mt-1 font-medium leading-relaxed">Hover over any interactive warn details block or suspect pin coordinate pointers in the panel above. The coordinate alignment systems automatically highlight and target visual discrepancies for analysis.</p>
          </div>
        </div>
      )}

    </div>
  );
}
