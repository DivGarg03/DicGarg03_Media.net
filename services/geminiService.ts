
import { GoogleGenAI, Type } from "@google/genai";
import { TargetingCriteria, CreativeAsset, CampaignMetrics, Insight, Anomaly, CompanyOverview } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ---------------------------------------------------------
// 0. Company Overview Analysis
// ---------------------------------------------------------

export const generateCompanyOverview = async (
  businessName: string,
  websiteUrl: string,
  industry: string
): Promise<CompanyOverview> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Analyze the business name "${businessName}", industry "${industry}", and website URL "${websiteUrl}".
    
    1. Generate a brief, professional summary of what the business likely does (max 2 sentences).
    2. Determine the specific Business Type (e.g., 'Italian Restaurant', 'SaaS Platform').
    3. List 3-5 key services or products they likely offer.
    4. Infer the likely location or Service Area (default to 'United States' or 'Global' if unknown).
    
    Return ONLY JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          businessType: { type: Type.STRING },
          services: { type: Type.ARRAY, items: { type: Type.STRING } },
          location: { type: Type.STRING }
        }
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate company overview");
  
  const raw = JSON.parse(text);
  
  return {
    summary: raw.summary || `A ${industry} business operating as ${businessName}.`,
    businessType: raw.businessType || industry,
    services: Array.isArray(raw.services) ? raw.services : ['Service 1', 'Service 2'],
    location: raw.location || 'United States'
  };
};

// ---------------------------------------------------------
// 1. Context-Aware Setup & NLT (Natural Language Targeting)
// ---------------------------------------------------------

const TARGETING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    locations: { type: Type.ARRAY, items: { type: Type.STRING } },
    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
    ageRange: { type: Type.STRING },
    gender: { type: Type.STRING, enum: ["All", "Male", "Female"] },
    devices: { type: Type.ARRAY, items: { type: Type.STRING, enum: ["Mobile", "Desktop", "Tablet"] } },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

export const generateTargetingFromBusinessInfo = async (
  businessName: string,
  industry: string,
  websiteUrl: string,
  platform: string // Added Platform Context
): Promise<TargetingCriteria> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    Act as an expert ad targeting specialist for ${platform}.
    Context: Business "${businessName}" in industry "${industry}" with website URL "${websiteUrl}".
    
    Based on this information and the chosen platform (${platform}), infer the specific targeting criteria (Demographics, Interests, Devices).
    For example, if the platform is LinkedIn, focus on job titles or industries. If Meta, focus on interests.
    If the location is not obvious from the name, default to "United States".
    Return ONLY JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: TARGETING_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate targeting");
  
  const raw = JSON.parse(text);
  
  // Sanitize response to prevent undefined errors
  return {
    locations: Array.isArray(raw.locations) ? raw.locations : [],
    interests: Array.isArray(raw.interests) ? raw.interests : [],
    ageRange: raw.ageRange || '18-65+',
    gender: raw.gender || 'All',
    devices: Array.isArray(raw.devices) ? raw.devices : ['Mobile', 'Desktop'],
    keywords: Array.isArray(raw.keywords) ? raw.keywords : []
  };
};

export const generateTargetingFromText = async (
  businessName: string,
  industry: string,
  description: string,
  platform: string // Added Platform Context
): Promise<TargetingCriteria> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Act as an expert ad targeting specialist (NLT Engine) for ${platform}. 
    Context: Business "${businessName}" in industry "${industry}".
    User Request: "${description}"
    
    Extract specific targeting criteria relevant to ${platform}. 
    Return ONLY JSON.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: TARGETING_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate targeting");
  
  const raw = JSON.parse(text);

  // Sanitize response to prevent undefined errors
  return {
    locations: Array.isArray(raw.locations) ? raw.locations : [],
    interests: Array.isArray(raw.interests) ? raw.interests : [],
    ageRange: raw.ageRange || '18-65+',
    gender: raw.gender || 'All',
    devices: Array.isArray(raw.devices) ? raw.devices : ['Mobile', 'Desktop'],
    keywords: Array.isArray(raw.keywords) ? raw.keywords : []
  };
};

// ---------------------------------------------------------
// 2. Creative Builder (Text & Image Generation)
// ---------------------------------------------------------

export const generateCreativeCopy = async (
  businessName: string,
  industry: string,
  targeting: TargetingCriteria,
  platform: string // Added Platform Context
): Promise<Partial<CreativeAsset>> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Create 3 distinct ad components for "${businessName}" (${industry}) specifically for ${platform}.
    Target Audience: ${targeting.interests.join(', ')}, ${targeting.locations.join(', ')}.
    
    Generate a catchy Headline (max 40 chars), a persuasive Description (max 90 chars), and a Call to Action.
    If the platform is 'Google Ads', also provide a second headline (max 30 chars).
    Ensure the tone matches the platform (e.g., Professional for LinkedIn, Casual for Meta).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          headlinePart2: { type: Type.STRING },
          description: { type: Type.STRING },
          ctaText: { type: Type.STRING },
        },
      },
    },
  });

   const text = response.text;
  if (!text) throw new Error("Failed to generate creative");

  const raw = JSON.parse(text);
  
  return {
      headline: raw.headline || '',
      headlinePart2: raw.headlinePart2 || '',
      description: raw.description || '',
      ctaText: raw.ctaText || 'Shop Now'
  };
};

export const generateAdImage = async (
  businessName: string,
  industry: string,
  platform: string,
  funnelStage: string,
  targeting: TargetingCriteria
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';

  const prompt = `
    Generate a high-quality, professional advertising image for a business named "${businessName}" in the ${industry} industry.
    The ad will run on ${platform}.
    The campaign goal is ${funnelStage}.
    Target audience interests: ${targeting.interests.slice(0, 3).join(', ')}.
    Style: Professional, photorealistic, engaging, suitable for social media or display ads. 
    Ensure no text is overlayed on the image itself.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [{ text: prompt }] },
    config: {
      // DO NOT set responseMimeType for image models
    },
  });

  // Iterate parts to find the image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
};

// ---------------------------------------------------------
// 3. Plain English Insights Engine & Anomaly Watchdog
// ---------------------------------------------------------

export const generateInsights = async (metrics: CampaignMetrics): Promise<{ insights: Insight[], anomaly: Anomaly }> => {
  const model = 'gemini-2.5-flash';

  // We summarize the metrics into a string for the prompt
  const metricsSummary = `
    Impressions: ${metrics.impressions}
    Clicks: ${metrics.clicks}
    CTR: ${metrics.ctr}%
    Spend: $${metrics.spend}
    Conversions: ${metrics.conversions}
  `;

  const prompt = `
    Analyze these ad campaign metrics:
    ${metricsSummary}

    1. Provide 2-3 "Plain English" insights. Translate data into business value. Avoid jargon.
       Example: "Your ad is reaching a lot of people, but few are clicking." instead of "High impressions, low CTR."
    2. Detect if there is a statistical anomaly (positive or negative) requiring immediate attention (Watchdog).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["success", "warning", "info", "danger"] },
                message: { type: Type.STRING }
              }
            }
          },
          anomaly: {
            type: Type.OBJECT,
            properties: {
              detected: { type: Type.BOOLEAN },
              description: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
            }
          }
        }
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate insights");

  return JSON.parse(text);
};

// ---------------------------------------------------------
// 4. Custom Insights (Chat style)
// ---------------------------------------------------------

export const generateCustomInsight = async (
  metrics: CampaignMetrics,
  query: string
): Promise<string> => {
  const model = 'gemini-2.5-flash';
  
  const metricsSummary = JSON.stringify(metrics, null, 2);

  const prompt = `
    You are an expert advertising analyst.
    Here are the campaign metrics:
    ${metricsSummary}

    User Question: "${query}"

    Provide a clear, concise answer (max 2-3 sentences) based strictly on the provided data.
    Use plain english suitable for a small business owner.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  
  return response.text || "Could not generate an answer.";
};
