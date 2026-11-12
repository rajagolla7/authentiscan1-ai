/**
 * AuthentiScan AI - Type Definitions
 */

export type Language = 'en' | 'hi' | 'te';

export interface TranslationDict {
  heroTitle: string;
  heroSub: string;
  scanNow: string;
  features: string;
  howItWorks: string;
  dashboard: string;
  community: string;
  admin: string;
  uploadImage: string;
  webcamScan: string;
  dragDrop: string;
  analyzing: string;
  score: string;
  status: string;
  genuine: string;
  suspicious: string;
  fake: string;
  blockchainVerified: string;
  sellerRating: string;
}

export interface SellerAnalysis {
  name: string;
  rating: number; // 0 to 100
  trustLevel: 'High' | 'Medium' | 'Low';
  flaggedReviewsRatio: number; // e.g. 0.35
  warningFlag: boolean;
  notes: string;
}

export interface ImageAnomaly {
  id: string;
  feature: string; // e.g. 'Logo Positioning'
  description: string;
  coordinates: { x: number; y: number }; // Relative coordinates for pinning (0-100)
  severity: 'high' | 'medium' | 'low';
}

export interface ScanResult {
  id: string;
  productName: string;
  brand: string;
  barcode: string;
  timestamp: string;
  imageUrl: string;
  status: 'Genuine' | 'Suspicious' | 'Fake';
  authenticityScore: number; // 0 to 100
  confidenceRate: number; // 0 to 100
  ocrTextExtracted: string;
  expiryDateStr: string;
  isDateValid: boolean;
  listedPrice?: number;
  estimatedRetailPriceUSD?: number;
  estimatedRetailPriceINR?: number;
  
  // High-level explanations (Explainable AI)
  explanations: {
    title: string;
    description: string;
    type: 'success' | 'warning' | 'danger';
  }[];

  // Seller Reputation Analysis
  seller: SellerAnalysis;

  // Visual Anomaly Points for Split Comparison
  anomalies: ImageAnomaly[];

  // Simulated Blockchain records
  blockchain: {
    blockId: number;
    hash: string;
    parentHash: string;
    verifiedStamp: string;
    contractAddress: string;
  };

  // Simulated Review Analyser
  reviewsSummary: {
    totalReviews: number;
    fakeReviewsDetected: number;
    ratio: number;
    botPatterns: string[];
    reviewScore: number; // overall product sentiment
  };
}

export interface AuthenticProduct {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  imageUrl: string;
  retailPrice: number;
  description: string;
  specs: Record<string, string>;
}

export interface CommunityReport {
  id: string;
  productName: string;
  brand: string;
  reportedBy: string;
  location: string;
  evidenceType: 'image' | 'seller' | 'price';
  description: string;
  scamDate: string;
  upvotes: number;
}
