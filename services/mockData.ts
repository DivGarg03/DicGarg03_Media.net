
import { Campaign, CampaignStatus, Industry, FunnelStage, Channel, Platform } from "../types";

export const INITIAL_CAMPAIGN: Campaign = {
  id: 'temp-1',
  name: 'New Campaign',
  startDate: new Date().toISOString(),
  businessName: '',
  websiteUrl: '',
  industry: Industry.RETAIL,
  companyOverview: {
    summary: '',
    businessType: '',
    services: [],
    location: ''
  },
  funnelStage: FunnelStage.AWARENESS,
  channel: Channel.SOCIAL,
  platform: Platform.META_ADS,
  status: CampaignStatus.DRAFT,
  targeting: {
    locations: [],
    interests: [],
    ageRange: '18-65+',
    gender: 'All',
    devices: ['Mobile', 'Desktop'],
    keywords: []
  },
  creative: {
    headline: '',
    headlinePart2: '',
    description: '',
    primaryColor: '#3b82f6',
    ctaText: 'Shop Now',
    layoutTemplate: 'classic',
    backgroundImageUrl: ''
  },
  budget: {
    dailyLimit: 50,
    hardCap: 500,
    currency: 'USD',
    duration: 30
  },
  metrics: {
    impressions: 0,
    clicks: 0,
    cpc: 0,
    ctr: 0,
    spend: 0,
    conversions: 0,
    dates: [],
    dailySpend: []
  }
};

// Demo data for a single campaign
export const DEMO_CAMPAIGN_DATA: Campaign = {
  ...INITIAL_CAMPAIGN,
  id: 'demo-123',
  name: 'Summer Sale - Pizza Place',
  startDate: '2023-10-01',
  businessName: 'Joe\'s Pizza',
  industry: Industry.FOOD_BEVERAGE,
  companyOverview: {
    summary: 'Joe\'s Pizza is a beloved local pizzeria serving authentic New York-style slices and whole pies. Known for their secret family sauce and hand-tossed dough, they offer a casual dining experience and fast delivery.',
    businessType: 'Restaurant / Pizzeria',
    services: ['Dine-in', 'Takeout', 'Delivery', 'Catering'],
    location: 'New York, NY'
  },
  funnelStage: FunnelStage.ACTION,
  channel: Channel.SOCIAL,
  platform: Platform.META_ADS,
  status: CampaignStatus.ACTIVE,
  creative: {
    headline: 'Best Pizza in Town',
    headlinePart2: 'Order Online Today',
    description: 'Authentic NY Style Pizza. Order online now!',
    primaryColor: '#ef4444',
    ctaText: 'Order Now',
    layoutTemplate: 'bold',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&h=400'
  },
  budget: {
    dailyLimit: 100,
    hardCap: 2000,
    currency: 'USD',
    duration: 30
  },
  metrics: {
    impressions: 45000,
    clicks: 1200,
    cpc: 0.85,
    ctr: 2.66,
    spend: 1020,
    conversions: 85,
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dailySpend: [120, 145, 130, 160, 150, 180, 135]
  }
};

// List of mock campaigns for the Dashboard List View
export const MOCK_CAMPAIGNS_LIST: Campaign[] = [
  DEMO_CAMPAIGN_DATA,
  {
    ...DEMO_CAMPAIGN_DATA,
    id: 'demo-456',
    name: 'Retargeting - Website Visitors',
    startDate: '2023-10-15',
    funnelStage: FunnelStage.ACTION,
    status: CampaignStatus.ACTIVE,
    metrics: {
      ...DEMO_CAMPAIGN_DATA.metrics,
      impressions: 12500,
      clicks: 450,
      spend: 540,
      conversions: 32
    },
    budget: {
      dailyLimit: 40,
      hardCap: 800,
      currency: 'USD',
      duration: 30
    }
  },
  {
    ...DEMO_CAMPAIGN_DATA,
    id: 'demo-789',
    name: 'Brand Awareness - Local',
    startDate: '2023-09-01',
    funnelStage: FunnelStage.AWARENESS,
    status: CampaignStatus.PAUSED,
    metrics: {
      ...DEMO_CAMPAIGN_DATA.metrics,
      impressions: 80000,
      clicks: 900,
      spend: 1200,
      conversions: 15
    },
    budget: {
      dailyLimit: 60,
      hardCap: 1200,
      currency: 'USD',
      duration: 60
    }
  }
];
