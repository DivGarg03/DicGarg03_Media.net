
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CAP_REACHED = 'CAP_REACHED' // Specific hard cap status
}

export enum Industry {
  RETAIL = 'Retail',
  SERVICES = 'Services',
  FOOD_BEVERAGE = 'Food & Beverage',
  TECH = 'Technology',
  OTHER = 'Other'
}

export enum FunnelStage {
  AWARENESS = 'Awareness',
  INTEREST = 'Interest',
  DESIRE = 'Desire',
  ACTION = 'Action'
}

export enum Channel {
  SEARCH = 'Paid Search (SEM)',
  SOCIAL = 'Social Advertising',
  DISPLAY = 'Display Advertising',
  VIDEO = 'Video Advertising'
}

export enum Platform {
  GOOGLE_ADS = 'Google Ads',
  META_ADS = 'Meta Ads',
  LINKEDIN_ADS = 'LinkedIn Ads',
  GOOGLE_DISPLAY = 'Google Display Network',
  YOUTUBE = 'YouTube Ads'
}

export interface TargetingCriteria {
  locations: string[];
  interests: string[];
  ageRange: string;
  gender: 'All' | 'Male' | 'Female';
  devices: ('Mobile' | 'Desktop' | 'Tablet')[];
  keywords: string[];
}

export interface CreativeAsset {
  headline: string;
  headlinePart2?: string; // For Search Ads
  description: string;
  primaryColor: string;
  ctaText: string;
  layoutTemplate: 'classic' | 'bold' | 'minimal';
  backgroundImageUrl?: string; // New field for AI Image
}

export interface BudgetConfig {
  dailyLimit: number;
  hardCap: number; // The safety lock
  currency: string;
  duration: number; // Duration in days
}

export interface CompanyOverview {
  summary: string;
  businessType: string;
  services: string[];
  location: string;
}

export interface Campaign {
  id: string;
  name: string;
  startDate: string; // ISO Date String
  businessName: string;
  websiteUrl: string;
  industry: Industry;
  
  // New AI Analysis Field
  companyOverview: CompanyOverview;

  // New fields
  funnelStage: FunnelStage;
  channel: Channel;
  platform: Platform;
  
  status: CampaignStatus;
  targeting: TargetingCriteria;
  creative: CreativeAsset;
  budget: BudgetConfig;
  metrics: CampaignMetrics;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  cpc: number;
  ctr: number;
  spend: number;
  conversions: number;
  dates: string[]; // For charts
  dailySpend: number[]; // For charts
}

export interface Insight {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string; // Plain English message
  metric?: string;
  change?: number;
}

export interface Anomaly {
  detected: boolean;
  description: string;
  severity: 'low' | 'medium' | 'high';
}
