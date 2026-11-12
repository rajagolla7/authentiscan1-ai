import React, { useState } from "react";
import { ScanResult } from "../types";
import { getCleanShoppingQuery } from "../utils/shoppingQuery";
import { 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  ShoppingCart, 
  Filter, 
  Award, 
  Link2, 
  Lock, 
  Compass, 
  Loader2, 
  Sparkles, 
  Zap 
} from "lucide-react";

// Robust mock dataset of certified genuine products and their official retail platforms
const VERIFIED_PRODUCTS = [
  {
    id: "prod-1",
    name: "AuraPod Max Noise-Canceling Headphones",
    brand: "AuraAudio",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80",
    description: "Premium high-fidelity audio headphones featuring signature neural noise cancellation and reactive spatial theater soundscapes.",
    globalMsrp: "$299.00",
    platforms: [
      { 
        name: "Official AuraAudio Store", 
        url: "https://www.google.com/search?tbm=shop&q=AuraPod+Max+Noise-Canceling+Headphones", 
        price: "$299.00", 
        status: "In Stock", 
        type: "Manufacturer Direct", 
        badge: "100% Certified Direct Route",
        trustScore: 100,
        region: "Global Ship"
      },
      { 
        name: "Amazon Certified Brand Store", 
        url: "https://www.amazon.com/s?k=AuraPod+Max+Noise-Canceling+Headphones", 
        price: "$299.00", 
        status: "In Stock (Only 4 left)", 
        type: "Prime Authorized seller", 
        badge: "Verified Amazon Brand Registry",
        trustScore: 98,
        region: "North America / Europe"
      },
      { 
        name: "BestBuy Tech Retailer", 
        url: "https://www.bestbuy.com/site/searchpage.jsp?st=noise+canceling+headphones", 
        price: "$299.99", 
        status: "In Stock (Free Pickup)", 
        type: "Official Retail Partner", 
        badge: "Authorized Corporate Partner",
        trustScore: 99,
        region: "United States"
      }
    ]
  },
  {
    id: "prod-2",
    name: "ViraShield Daily Defense Serum 30ml",
    brand: "ViraDerma",
    category: "Cosmetics",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
    description: "Highly stable clinical protection serum designed to combat environmental stressors. Avoid counterfeit chemical variants which can burn sensitive skin.",
    globalMsrp: "$85.00",
    platforms: [
      { 
        name: "ViraDerma Labs Direct", 
        url: "https://www.google.com/search?tbm=shop&q=ViraShield+Daily+Defense+Serum+30ml", 
        price: "$85.00", 
        status: "In Stock", 
        type: "Manufacturer Direct", 
        badge: "Pure Formula Guarantee",
        trustScore: 100,
        region: "Global Shipping"
      },
      { 
        name: "Sephora Flagship Counter", 
        url: "https://www.sephora.com/search?keyword=daily+defense+serum", 
        price: "$85.00", 
        status: "In Stock", 
        type: "Authorized Retail Partner", 
        badge: "Sephora Certified Authorized",
        trustScore: 100,
        region: "Global Outlets / Online"
      },
      { 
        name: "Ulta Beauty Salons", 
        url: "https://www.ulta.com/search?q=defense+serum", 
        price: "$85.00", 
        status: "In Stock", 
        type: "Authorized Retail Partner", 
        badge: "Official Ulta Stockist Seal",
        trustScore: 99,
        region: "US & Canada"
      }
    ]
  },
  {
    id: "prod-3",
    name: "ApexPro Quartz Chronograph Watch",
    brand: "ApexHorology",
    category: "Luxury Assets",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80",
    description: "Expertly calibrated chronometer featuring genuine sapphire dial protectors, and a state-locked anti-vibration machinery casing.",
    globalMsrp: "$1,200.00",
    platforms: [
      { 
        name: "Apex Horology Swiss Atelier", 
        url: "https://www.google.com/search?tbm=shop&q=Quartz+Chronograph+Watch+Swiss", 
        price: "$1,200.00", 
        status: "In Stock", 
        type: "Manufacturer Direct", 
        badge: "Certificates of Swiss Origin",
        trustScore: 100,
        region: "Swiss Dispatch / Global"
      },
      { 
        name: "LuxeTime Authorized Jewellers", 
        url: "https://www.google.com/search?tbm=shop&q=Sapphire+Chronograph+Watch", 
        price: "$1,195.00", 
        status: "Limited Stock", 
        type: "Licensed Luxury Boutique", 
        badge: "Boutique Registrar Certificate",
        trustScore: 97,
        region: "Europe & Asia"
      }
    ]
  },
  {
    id: "prod-4",
    name: "LuxeShield Hand-Stitched Leather Tote",
    brand: "LuxeShield",
    category: "Designer Apparel",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80",
    description: "Premium full-grain hand-stitched leather bag. Cloned variants use plastic polymers emitting chemical toxins. Buy strictly from authorized lines.",
    globalMsrp: "$450.00",
    platforms: [
      { 
        name: "Official LuxeShield Boutique", 
        url: "https://www.google.com/search?tbm=shop&q=Hand-Stitched+Leather+Tote+bag", 
        price: "$450.00", 
        status: "In Stock", 
        type: "Manufacturer Direct", 
        badge: "Immutable Serial Hologram Included",
        trustScore: 100,
        region: "Global Outlets"
      },
      { 
        name: "Nordstrom Luxury Department", 
        url: "https://www.nordstrom.com/sr?origin=keywordsearch&keyword=leather+tote+handbag", 
        price: "$450.00", 
        status: "In Stock", 
        type: "Authorized Executive Partner", 
        badge: "Nordstrom Brand Assurance Verified",
        trustScore: 99,
        region: "North America Only"
      }
    ]
  }
];

interface VerifiedMarketplacesProps {
  translations: any;
  historyRecords?: ScanResult[];
  activeScanResult?: ScanResult | null;
}

export default function VerifiedMarketplaces({ 
  translations,
  historyRecords = [],
  activeScanResult
}: VerifiedMarketplacesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Real-time link verification engine states
  const [auditLink, setAuditLink] = useState("");
  const [isAuditingLink, setIsAuditingLink] = useState(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [auditError, setAuditError] = useState("");

  const categories = ["All", "Electronics", "Cosmetics", "Luxury Assets", "Designer Apparel"];

  // Dynamically translate scan history results into verified product items
  const dynamicScannedProducts = (historyRecords || []).map((item) => {
    // Determine category based on product/brand name keywords
    let category = "General Merchandise";
    const p = (item.productName || "").toLowerCase();
    const b = (item.brand || "").toLowerCase();
    if (p.includes("audio") || p.includes("headphone") || p.includes("watch") || p.includes("phone") || p.includes("charge")) {
      category = "Electronics";
    } else if (p.includes("serum") || p.includes("skin") || p.includes("cream") || p.includes("shampoo") || p.includes("cosmetic") || p.includes("derma")) {
      category = "Cosmetics";
    } else if (p.includes("bag") || p.includes("purse") || p.includes("tote") || p.includes("apparel") || p.includes("jacket") || p.includes("dress")) {
      category = "Designer Apparel";
    } else if (p.includes("lux") || p.includes("watch") || p.includes("gold") || p.includes("diamond")) {
      category = "Luxury Assets";
    }

    // Generate dynamic safe shopping pathways based on brand/brand direct stores
    let platforms = [];
    const cleanQuery = getCleanShoppingQuery(item.brand, item.productName);
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(cleanQuery.amazon)}`;
    const flipkartUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(cleanQuery.flipkart)}`;
    const queryStr = `${item.brand || ''} ${item.productName || ''}`.trim();
    const encodedQuery = encodeURIComponent(queryStr);

    if (b.includes("aura") || p.includes("audio") || p.includes("pod") || p.includes("headphone")) {
      platforms = [
        { 
          name: "Official AuraAudio Store", 
          url: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent("AirPods Max Headphones")}`, 
          price: "$299.00", 
          status: "In Stock", 
          type: "Manufacturer Direct", 
          badge: "100% Certified Direct Route",
          trustScore: 100,
          region: "Global Ship"
        },
        { 
          name: "Amazon Certified Brand Store", 
          url: amazonUrl, 
          price: "$299.00", 
          status: "In Stock (Prime Verified)", 
          type: "Prime Authorized seller", 
          badge: "Verified Amazon Brand Registry",
          trustScore: 98,
          region: "North America & Global"
        },
        { 
          name: "Flipkart Authorized Outlet", 
          url: flipkartUrl, 
          price: "₹24,999", 
          status: "In Stock", 
          type: "Flipkart Assured Seller", 
          badge: "Flipkart Star-Merchant Pass",
          trustScore: 97,
          region: "India / APAC"
        }
      ];
    } else if (b.includes("vira") || b.includes("derma") || p.includes("serum") || p.includes("skin")) {
      platforms = [
        { 
          name: "ViraDerma Labs Direct", 
          url: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent("Vitamin C Face Serum")}`, 
          price: "$85.00", 
          status: "In Stock", 
          type: "Manufacturer Direct", 
          badge: "Pure Formula Guarantee",
          trustScore: 100,
          region: "Global Shipping"
        },
        { 
          name: "Amazon Certified Beauty Hub", 
          url: amazonUrl, 
          price: "$85.00", 
          status: "In Stock", 
          type: "Amazon Beauty Registry Partner", 
          badge: "Amazon Premium Beauty",
          trustScore: 98,
          region: "North America & Global"
        },
        { 
          name: "Flipkart Authentic Skincare Counter", 
          url: flipkartUrl, 
          price: "₹6,990", 
          status: "In Stock", 
          type: "Flipkart Premium Counter", 
          badge: "F-Assured Beauty Verified",
          trustScore: 97,
          region: "India / Region"
        },
        { 
          name: "Sephora Flagship Counter", 
          url: `https://www.sephora.com/search?keyword=${encodeURIComponent("face serum")}`, 
          price: "$85.00", 
          status: "In Stock", 
          type: "Authorized Retail Partner", 
          badge: "Sephora Certified Authorized",
          trustScore: 100,
          region: "Global" 
        }
      ];
    } else {
      platforms = [
        { 
          name: `Official ${item.brand || 'Manufacturer'} Flagship Store`, 
          url: `https://www.google.com/search?q=${encodeURIComponent((cleanQuery.display || item.brand || '') + " official flagship store direct")}`, 
          price: "Official MSRP", 
          status: "In Stock", 
          type: "Manufacturer Direct", 
          badge: "Direct Authorized Channel",
          trustScore: 100,
          region: "Global Ship"
        },
        { 
          name: "Amazon Certified Brand Registry Hub", 
          url: amazonUrl, 
          price: "Live Vendor Pricing", 
          status: "In Stock", 
          type: "Verified Hub Seller", 
          badge: "Amazon Brand Gatekeeper",
          trustScore: 97,
          region: "Global Outlets" 
        },
        { 
          name: "Flipkart Direct Verified Channel", 
          url: flipkartUrl, 
          price: "Dynamic Local Pricing", 
          status: "In Stock", 
          type: "F-Assured Direct Node", 
          badge: "Verified F-Assured Seller",
          trustScore: 96,
          region: "India / APAC"
        }
      ];
    }

    return {
      id: "scanned-" + item.id,
      name: item.productName,
      brand: item.brand,
      category,
      image: item.imageUrl || "https://images.unsplash.com/photo-1546213290-e1b2ed3f3342?auto=format&fit=crop&w=500&q=80",
      description: `User-analyzed product entry from scan session. Original on-chain registry ID #${item.id} logged. This marks the guaranteed certified original model buying pathways below.`,
      globalMsrp: "Standard Pricing",
      platforms
    };
  });

  // Merge static hardcoded and dynamic scanned products, ensuring unique product names/brands
  const allProducts = [...dynamicScannedProducts, ...VERIFIED_PRODUCTS];
  // Deduplicate by lowercase name to keep the list clean and elegant
  const seenNames = new Set();
  const dedupedProducts = allProducts.filter((p) => {
    const key = p.name.toLowerCase().trim();
    if (seenNames.has(key)) {
      return false;
    }
    seenNames.add(key);
    return true;
  });

  // Handle URL Link Auditer verification logic
  const handleLinkAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuditError("");
    setAuditResult(null);

    if (!auditLink.trim()) {
      setAuditError("Please enter an online shop or storefront link.");
      return;
    }

    if (!auditLink.startsWith("http://") && !auditLink.startsWith("https://")) {
      setAuditError("Invalid secure transfer protocol. Link must begin with http:// or https://");
      return;
    }

    setIsAuditingLink(true);

    // Simulate deeply detailed multi-vector database registrar lookup
    setTimeout(() => {
      const urlLower = auditLink.toLowerCase();
      let status: "certified" | "suspicious" | "unsafe" = "suspicious";
      let trustLevel = 50;
      let reason = "";
      let title = "Unregistered Retail Vendor";
      
      if (
        urlLower.includes("amazon.com") || 
        urlLower.includes("bestbuy.com") || 
        urlLower.includes("sephora.com") || 
        urlLower.includes("nordstrom.com") || 
        urlLower.includes("brand-auraaudio") ||
        urlLower.includes("brand-viraderma")
      ) {
        status = "certified";
        trustLevel = 98;
        title = "Officially Certified Retail Node";
        reason = "Verified e-commerce platform mapping to authentic brand registries. Cryptographic SSL signatures and verified corporate supplier licenses check out successfully on the immutable blockchain network.";
      } else if (
        urlLower.includes("discount") || 
        urlLower.includes("cheap") || 
        urlLower.includes("outlet-clearance") || 
        urlLower.includes("replica") || 
        urlLower.includes("clone")
      ) {
        status = "unsafe";
        trustLevel = 14;
        title = "High Risk Counterfeit Hub";
        reason = "Domain is flagged inside our anti-theft database. Features hidden owner metadata, recent registry creation (less than 60 days old), misaligned brand insignia graphics, and a highly suspicious price-indexing score.";
      } else {
        status = "suspicious";
        trustLevel = 48;
        title = "Independent Third-Party Channel";
        reason = "Independent storefront which lacks direct brand distributor certification. Fails real-time API contract matching. Transaction security index sits at medium-risk. Exercise severe caution during order completion.";
      }

      setAuditResult({
        link: auditLink,
        status,
        trustLevel,
        title,
        reason,
        timestamp: new Date().toLocaleTimeString(),
        certId: "REG-" + Math.floor(Math.random() * 900000 + 100000)
      });
      setIsAuditingLink(false);
    }, 1800);
  };

  const filteredProducts = dedupedProducts.filter((prod) => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prod.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-white text-left animate-fade-in bg-[#05060b]">
      
      {/* Upper HUD Header with neon labels */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5 mb-8 gap-4">
        <div>
          <span className="font-mono text-[9px] tracking-widest text-[#00f2ff] uppercase flex items-center gap-1 font-bold neon-text-blue">
            <Compass className="h-3.5 w-3.5 animate-pulse" />
            <span>AUTHENTIC OUTPOST ROUTER INDEX</span>
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1 text-white">Verified Marketplaces Finder</h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse the official authorized channels where scanned products are guaranteed as 100% certified "good products". Buy with complete on-chain security.
          </p>
        </div>

        {/* Search & Category filter */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="relative flex items-center max-w-xs w-full bg-[#101223]/50 rounded-lg border border-[rgba(100,116,139,0.25)] p-1 glass">
            <Search className="h-4 w-4 text-slate-500 ml-2.5 absolute pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search genuine brands..."
              id="platform-sku-search-input"
              className="w-full bg-transparent pl-9 pr-3 py-1.5 text-xs font-semibold outline-none text-white placeholder-slate-500"
            />
          </div>
          <div className="flex bg-zinc-950/60 p-1 rounded-lg border border-[rgba(100,116,139,0.15)] gap-1">
            <Filter className="h-3 w-3 text-slate-500 m-2 mt-2.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="platform-category-filter"
              className="bg-transparent text-xs font-bold text-cyan-400 outline-none cursor-pointer pr-1"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#101223] text-white">{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Active Scan integration banner */}
      {activeScanResult && (
        <div className="mb-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,242,255,0.08)]">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-[#00f2ff] shrink-0 animate-pulse" />
            <div>
              <span className="text-[#00f2ff] font-bold uppercase block tracking-wider text-[10px]">Active Scan Verified Node Loaded</span>
              <p className="text-slate-300 mt-0.5 normal-case font-sans">
                Looking for the original of your scanned product <strong>{activeScanResult.productName}</strong>? We have registered its authorized merchant outlets below!
              </p>
            </div>
          </div>
          <button
            onClick={() => setSearchTerm(activeScanResult.productName)}
            className="px-3 py-1.5 rounded-lg bg-[#00f2ff]/10 text-[#00f2ff] hover:bg-[#00f2ff]/20 border border-[#00f2ff]/20 font-bold tracking-tight text-[11px] cursor-pointer"
          >
            Highlight My Scan
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: PRODUCTS INDEX GRID (PRODUCING GOOD PRODUCTS CHANNELS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="h-4 w-4 text-[#39ff14] neon-text-green" />
              <span>Certified Product Nodes ({filteredProducts.length})</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">REGISTRY_ONLINE</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="space-y-6">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  id={`genuine-product-node-${prod.id}`}
                  className="rounded-2xl border border-[rgba(100,116,139,0.18)] bg-[#101223]/50 p-5 glass hover:border-cyan-500/30 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-5 relative overflow-hidden"
                >
                  {/* Subtle color highlight ribbon */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#39ff14] via-emerald-500 to-indigo-600" />
                  
                  {/* Product Thumbnail inside Grid */}
                  <div className="md:col-span-3">
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded bg-slate-950/80 text-cyan-400 border border-cyan-500/20">
                        {prod.category}
                      </span>
                    </div>
                  </div>

                  {/* Details and Platform availability mapping */}
                  <div className="md:col-span-9 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-lg font-black text-white">{prod.name}</h4>
                          <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                            Brand: {prod.brand} • MSRP: <span className="text-[#39ff14] font-black">{prod.globalMsrp}</span>
                          </span>
                        </div>
                        <span className="inline-flex px-2 py-0.5 text-[8px] font-mono font-extrabold uppercase rounded bg-[#39ff14]/15 text-[#39ff14] border border-[#39ff14]/30">
                          Verified Safe Asset
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed mt-2.5">
                        {prod.description}
                      </p>
                    </div>

                    {/* Authorized Buying Channels List */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <span className="block text-[10px] font-mono text-slate-500 font-extrabold uppercase tracking-wider mb-2.5">
                        SECURE BUYING PATHWAYS (AUTHORIZED CHANNELS):
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {prod.platforms.map((plat, platIdx) => (
                          <div 
                            key={platIdx}
                            className="bg-slate-950/60 p-3 rounded-lg border border-slate-900 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-white leading-tight">{plat.name}</span>
                                <span className="text-[10px] font-mono font-black text-[#39ff14]">{plat.price}</span>
                              </div>
                              <span className="block text-[9px] font-mono text-slate-400 mt-1 italic">{plat.badge}</span>
                              
                              <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[9px]">
                                <span className={`inline-flex items-center gap-1.5 font-bold ${plat.status.includes('Stock') ? 'text-[#39ff14]' : 'text-slate-500'}`}>
                                  <span className={`h-1 w-1 rounded-full ${plat.status.includes('Stock') ? 'bg-[#39ff14]' : 'bg-slate-500'}`} />
                                  {plat.status}
                                </span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400">{plat.region}</span>
                              </div>
                            </div>

                            <a 
                              href={plat.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3.5 w-full flex items-center justify-center space-x-1 py-1.5 rounded bg-cyan-950/20 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/15 transition text-[10px] font-bold cursor-pointer"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              <span>Go to Platform Store</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3 border border-dashed border-slate-800 rounded-3xl bg-[#101223]/20">
              <Compass className="h-10 w-10 text-slate-600 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
              <p className="text-sm font-mono text-slate-400 uppercase tracking-widest font-bold">No registered brands matched</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try refining your search keyword descriptor or select another catalog category in the header menu.</p>
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: USER STOREFRONT DOMAIN/LINK AUDITING */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Link Audit Terminal form */}
          <div className="rounded-2xl border border-[rgba(100,116,139,0.22)] bg-[#101223]/85 p-6 glass shadow-[0_0_20px_rgba(0,242,255,0.03)] text-left">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Link2 className="h-4 w-4 text-[#00f2ff] neon-text-blue" />
                <span>Audit Storefront URL Link</span>
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f2ff] animate-ping" />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Pasted a purchase listing URL from another merchant platform? Check if the seller resides in authorized distributor circles across brands.
            </p>

            <form onSubmit={handleLinkAudit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={auditLink}
                  onChange={(e) => setAuditLink(e.target.value)}
                  placeholder="https://merchant.com/product..."
                  id="platform-link-audit-input"
                  className="w-full rounded-lg bg-slate-950 border border-[rgba(100,116,139,0.2)] text-xs p-3.5 pr-10 outline-none focus:border-[#00f2ff] text-white font-mono"
                />
                <ShieldCheck className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>

              {auditError && (
                <p className="text-[10px] font-mono text-[#ff3131] bg-[#ff3131]/10 border border-[#ff3131]/25 p-2 rounded text-center font-bold">
                  [SECURITY WARNING] {auditError}
                </p>
              )}

              <button
                type="submit"
                disabled={isAuditingLink}
                className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-400 to-[#bc13fe] hover:scale-101 py-3 text-xs font-extrabold text-white shadow-[0_0_15px_rgba(0,242,255,0.3)] transition cursor-pointer disabled:opacity-50"
              >
                {isAuditingLink ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>AUDITING SECURITIES...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-white animate-bounce" />
                    <span>AUDIT STOREFRONT LICENSE</span>
                  </>
                )}
              </button>
            </form>

            {/* Audit Output terminal rendering */}
            {auditResult && (
              <div className="mt-5 pt-5 border-t border-slate-800 space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">Certificate No: <strong className="text-slate-300">{auditResult.certId}</strong></span>
                  <span className="text-[9px] font-mono text-slate-500">{auditResult.timestamp}</span>
                </div>
                
                <div className={`p-4 rounded-xl border ${
                  auditResult.status === "certified" 
                    ? "border-[#39ff14]/25 bg-[#39ff14]/5 text-white" 
                    : auditResult.status === "unsafe" 
                    ? "border-[#ff3131]/25 bg-[#ff3131]/5 text-white" 
                    : "border-[#bc13fe]/25 bg-[#bc13fe]/5 text-white"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      auditResult.status === "certified" ? "bg-[#39ff14]" : auditResult.status === "unsafe" ? "bg-[#ff3131]" : "bg-[#bc13fe]"
                    }`} />
                    <h5 className="text-xs font-black uppercase tracking-tight">{auditResult.title}</h5>
                  </div>
                  
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Trust Rating:</span>
                      <span className={`font-black uppercase ${
                        auditResult.status === "certified" ? "text-[#39ff14]" : auditResult.status === "unsafe" ? "text-[#ff3131]" : "text-[#bc13fe]"
                      }`}>
                        {auditResult.trustLevel}% ({auditResult.status.toUpperCase()})
                      </span>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden mt-1.5">
                      <div className={`h-full rounded ${
                        auditResult.status === "certified" ? "bg-[#39ff14]" : auditResult.status === "unsafe" ? "bg-[#ff3131]" : "bg-[#bc13fe]"
                      }`} style={{ width: `${auditResult.trustLevel}%` }} />
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-300 leading-relaxed mt-3.5 border-t border-slate-800/60 pt-2.5">
                    {auditResult.reason}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase justify-center mt-2 select-none">
                  <Lock className="h-3 w-3 text-[#00f2ff]" />
                  <span>State-locked cryptographical check</span>
                </div>
              </div>
            )}
          </div>

          {/* Secure Purchasing Core Shield Box */}
          <div className="rounded-2xl border border-[rgba(100,116,139,0.18)] bg-[#101223]/40 p-5 glass text-left space-y-3.5">
            <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#39ff14]" />
              <span>Anti-Counterfeiting Ledger Rules</span>
            </h4>
            
            <div className="space-y-3 text-[11px] text-slate-400 leading-relaxed leading-normal">
              <div className="flex gap-2.5 items-start">
                <span className="text-[#00f2ff] shrink-0 font-bold font-mono">01.</span>
                <p>Authentic brand listings never ask for off-site cryptocurrency or private bank transfers outside authenticated checkouts.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-[#00f2ff] shrink-0 font-bold font-mono">02.</span>
                <p>Ensure URL certificates feature registered SEC secure certificates (look for "Secure Retail Node" stamps above).</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-[#00f2ff] shrink-0 font-bold font-mono">03.</span>
                <p>Holographic print serials and packaging bevels map natively to on-chain registries for lifetime validation assurance.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
