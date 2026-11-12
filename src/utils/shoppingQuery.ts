/**
 * Clean shopping query resolver for AuthentiScan AI
 * Translates simulated brand/model names, arbitrary image filenames, and system tags into
 * real-world, highly available search terms for Amazon (US & India) and Flipkart.
 */

export interface CleanShoppingQuery {
  display: string;
  amazon: string;
  amazonIndia: string;
  flipkart: string;
}

/**
 * Checks if a string looks like a camera snapshot, screenshot, timestamp, or system placeholder
 */
export function isFilenameJunk(str: string): boolean {
  if (!str) return true;
  const s = str.trim().toLowerCase();
  
  // Empty or very short
  if (s.length < 3) return true;

  // System placeholders
  if (
    s === "unverified brand" ||
    s === "unverified manufacturer" ||
    s === "authorized brand" ||
    s === "unknown brand" ||
    s === "brandcorp" ||
    s === "scanned branding unit" ||
    s === "scanned product" ||
    s === "counterfeit replica sample" ||
    s === "genuine standard stock" ||
    s === "custom upload fake item" ||
    s === "webcam scanned product" ||
    s === "image" ||
    s === "photo" ||
    s === "download" ||
    s === "screenshot" ||
    s === "test"
  ) {
    return true;
  }

  // Matches timestamps like "11 10 at 4", "11 10 at 4 15 22", "at 4.15", "pm", "am"
  if (/\b\d{1,2}\s+\d{1,2}\s+at\s+\d{1,2}\b/.test(s)) return true;
  if (/\bat\s+\d{1,2}\b/.test(s)) return true;
  if (/^screenshot\b/.test(s)) return true;
  if (/^img[_-]?\d+/i.test(s)) return true;
  if (/^pxl[_-]?\d+/i.test(s)) return true;
  if (/^dsc[_-]?\d+/i.test(s)) return true;
  if (/^whatsapp\s+image/i.test(s)) return true;
  if (/^\d{4}[-_]\d{2}[-_]\d{2}/.test(s)) return true;
  if (/^\d+$/.test(s.replace(/[\s\-_]/g, ""))) return true;

  return false;
}

export function getCleanShoppingQuery(rawBrand?: string, rawProduct?: string): CleanShoppingQuery {
  let brand = (rawBrand || "").trim();
  let product = (rawProduct || "").trim();

  const bLower = brand.toLowerCase();
  const pLower = product.toLowerCase();

  // Only remap internal demo placeholder brands so real products/brands keep their exact names
  if (bLower.includes("auraaudio") || pLower.includes("aurapod")) {
    return {
      display: "Sony WH-1000XM5 Wireless Headphones",
      amazon: "Sony WH-1000XM5 Wireless Headphones",
      amazonIndia: "Sony WH-1000XM5 Wireless Headphones",
      flipkart: "Sony WH-1000XM5"
    };
  }

  if (bLower.includes("viraderma") || pLower.includes("virashield")) {
    return {
      display: "Vitamin C Daily Defense Face Serum",
      amazon: "Vitamin C Face Serum",
      amazonIndia: "Vitamin C Face Serum",
      flipkart: "Vitamin C Face Serum"
    };
  }

  if (bLower.includes("apexhorology") || pLower.includes("apexpro")) {
    return {
      display: "Swiss Quartz Chronograph Watch",
      amazon: "Chronograph Watch Men",
      amazonIndia: "Chronograph Watch Men",
      flipkart: "Chronograph Watch"
    };
  }

  if (bLower.includes("luxeshield") || pLower.includes("luxeshield")) {
    return {
      display: "Genuine Leather Tote Handbag",
      amazon: "Genuine Leather Tote Handbag",
      amazonIndia: "Leather Tote Handbag",
      flipkart: "Leather Tote Bag"
    };
  }

  // Check if both product and brand are generic camera junk or placeholders
  const brandIsJunk = isFilenameJunk(brand);
  const productIsJunk = isFilenameJunk(product);

  if (brandIsJunk && productIsJunk) {
    return {
      display: "",
      amazon: "",
      amazonIndia: "",
      flipkart: ""
    };
  }

  // Strip system placeholders from brand
  let cleanB = brand
    .replace(/^(unverified|unknown|authorized|scanned|custom|sample|test)\s+(brand|manufacturer|vendor|reseller|shop|direct)$/i, "")
    .replace(/^(brandcorp|scanned branding unit)$/i, "")
    .replace(/^img[_-]?\d+/i, "")
    .trim();

  // Strip junk words, dates, timestamps from product name
  let cleanP = product
    .replace(/^screenshot\s*[\d\s\-_.:apm]*/i, "")
    .replace(/^img[_-]?\d+/i, "")
    .replace(/^pxl[_-]?\d+/i, "")
    .replace(/^dsc[_-]?\d+/i, "")
    .replace(/^download\b/i, "")
    .replace(/^whatsapp\s+image\s*\d*/i, "")
    .replace(/\b\d{1,2}\s+\d{1,2}\s+at\s+\d{1,2}\b/gi, "")
    .replace(/\bat\s+\d{1,2}\b/gi, "")
    .replace(/\.(png|jpe?g|webp|gif|avif)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/•\s*S\/N.*$/i, "")
    .replace(/LOT-?\d+/i, "")
    .replace(/SKU-?\d+/i, "")
    .replace(/Batch:?.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

  // Combine cleanly
  let combined = "";
  if (cleanB && cleanP) {
    if (cleanP.toLowerCase().includes(cleanB.toLowerCase())) {
      combined = cleanP;
    } else {
      combined = `${cleanB} ${cleanP}`.trim();
    }
  } else if (cleanP) {
    combined = cleanP;
  } else if (cleanB) {
    combined = cleanB;
  }

  // Final check: if combined is still empty, or just numbers/symbols
  if (!combined || combined.length < 3 || isFilenameJunk(combined)) {
    return {
      display: "",
      amazon: "",
      amazonIndia: "",
      flipkart: ""
    };
  }

  // Prepare tailored strings
  const flipkartShort = combined.split(" ").slice(0, 4).join(" ");

  return {
    display: combined,
    amazon: combined,
    amazonIndia: combined,
    flipkart: flipkartShort || combined
  };
}
