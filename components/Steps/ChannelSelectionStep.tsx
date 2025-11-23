
import React, { useEffect, useState } from 'react';
import { FunnelStage, Channel, Platform, CompanyOverview } from '../../types';
import { Target, Search, Share2, MonitorPlay, Monitor, CheckCircle2, Info, Sparkles, Building2, MapPin, Briefcase } from 'lucide-react';
import { generateCompanyOverview } from '../../services/geminiService';

interface Props {
  funnelStage: FunnelStage;
  channel: Channel;
  platform: Platform;
  companyOverview: CompanyOverview;
  businessName: string;
  websiteUrl: string;
  industry: string;
  onChange: (field: string, value: any) => void;
}

const DESCRIPTIONS: Record<string, string> = {
  [FunnelStage.AWARENESS]: "Introduce your brand to people who haven't heard of you yet.",
  [FunnelStage.INTEREST]: "Target people who are researching solutions similar to yours.",
  [FunnelStage.DESIRE]: "Convince potential customers why they should choose you over competitors.",
  [FunnelStage.ACTION]: "Drive specific actions like purchases, sign-ups, or calls immediately.",
  
  [Channel.SEARCH]: "Text ads that appear at the top of search engine results when users type specific keywords.",
  [Channel.SOCIAL]: "Image or video ads that appear in users' social media feeds (e.g., Facebook, Instagram).",
  [Channel.DISPLAY]: "Visual banner ads shown on websites, news sites, and blogs across the internet.",
  [Channel.VIDEO]: "Video commercials that play before, during, or after streaming content (e.g., YouTube).",

  [Platform.GOOGLE_ADS]: "Capture high-intent customers actively searching on Google.",
  [Platform.META_ADS]: "Target users on Facebook and Instagram based on their interests and behaviors.",
  [Platform.LINKEDIN_ADS]: "Target professionals based on job title, company size, and industry.",
  [Platform.GOOGLE_DISPLAY]: "Reach 90% of internet users via banner ads on millions of websites.",
  [Platform.YOUTUBE]: "Engage users visually with video ads on the world's largest video platform."
};

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-flex items-center ml-2" onClick={(e) => e.stopPropagation()}>
    <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-center pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export const ChannelSelectionStep: React.FC<Props> = ({ 
  funnelStage, 
  channel, 
  platform, 
  companyOverview,
  businessName,
  websiteUrl,
  industry,
  onChange 
}) => {
  const [loadingOverview, setLoadingOverview] = useState(false);

  // Auto-generate company overview if missing
  useEffect(() => {
    if (!companyOverview.summary && businessName) {
      const fetchOverview = async () => {
        setLoadingOverview(true);
        try {
          const result = await generateCompanyOverview(businessName, websiteUrl, industry);
          onChange('companyOverview', result);
        } catch (e) {
          console.error("Failed to generate company overview", e);
        } finally {
          setLoadingOverview(false);
        }
      };
      fetchOverview();
    }
  }, [businessName]);

  // Mapping Logic: Recommended Channels based on Funnel
  const getRecommendedChannels = (stage: FunnelStage): Channel[] => {
    switch (stage) {
      case FunnelStage.AWARENESS:
        return [Channel.VIDEO, Channel.DISPLAY, Channel.SOCIAL];
      case FunnelStage.INTEREST:
        return [Channel.SOCIAL, Channel.SEARCH];
      case FunnelStage.DESIRE:
        return [Channel.SOCIAL, Channel.SEARCH];
      case FunnelStage.ACTION:
        return [Channel.SEARCH, Channel.SOCIAL];
      default:
        return [];
    }
  };

  // Mapping Logic: Platforms based on Channel
  const getPlatformsForChannel = (chn: Channel): Platform[] => {
    switch (chn) {
      case Channel.SEARCH:
        return [Platform.GOOGLE_ADS];
      case Channel.SOCIAL:
        return [Platform.META_ADS, Platform.LINKEDIN_ADS];
      case Channel.DISPLAY:
        return [Platform.GOOGLE_DISPLAY];
      case Channel.VIDEO:
        return [Platform.YOUTUBE];
      default:
        return [];
    }
  };

  const recommendedChannels = getRecommendedChannels(funnelStage);
  const availablePlatforms = getPlatformsForChannel(channel);

  // Auto-select first platform when channel changes
  const handleChannelChange = (newChannel: Channel) => {
    onChange('channel', newChannel);
    const newPlatforms = getPlatformsForChannel(newChannel);
    if (newPlatforms.length > 0) {
      onChange('platform', newPlatforms[0]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 0. Company Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h2 className="text-xl font-bold text-center text-slate-800 mb-6">Company Overview</h2>
         
         {loadingOverview ? (
           <div className="flex flex-col items-center justify-center py-8 space-y-3">
             <Sparkles className="w-8 h-8 text-blue-500 animate-spin" />
             <p className="text-slate-500 text-sm">Analyzing business profile...</p>
           </div>
         ) : (
           <div className="space-y-6">
              {/* AI Summary Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                 <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                    <div>
                       <p className="text-xs font-bold text-blue-700 uppercase mb-1">AI Analysis Summary:</p>
                       <p className="text-sm text-slate-700 leading-relaxed">
                         {companyOverview.summary || "Description pending analysis..."}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                 <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Business Name</label>
                    <div className="font-semibold text-slate-900 text-lg">{businessName || 'N/A'}</div>
                 </div>
                 <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Business Type</label>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                       <Building2 className="w-4 h-4 text-slate-500" />
                       {companyOverview.businessType || industry}
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Key Services</label>
                    <div className="text-sm text-slate-700 mt-1">
                       {companyOverview.services?.length > 0 
                         ? companyOverview.services.join(', ')
                         : 'Loading services...'}
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">Location / Area</label>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-slate-500" />
                       {companyOverview.location || 'United States'}
                    </div>
                 </div>
              </div>
           </div>
         )}
      </div>

      {/* 1. AIDA Funnel Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          1. What is your primary goal? (AIDA Model)
        </h2>
        <p className="text-slate-500 text-sm mb-4">Select where your customers are in the buying journey.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {Object.values(FunnelStage).map((stage) => (
            <button
              key={stage}
              onClick={() => onChange('funnelStage', stage)}
              className={`p-4 rounded-lg border text-left transition-all relative ${
                funnelStage === stage 
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center mb-1">
                <div className="font-semibold text-slate-800">{stage}</div>
                <InfoTooltip text={DESCRIPTIONS[stage]} />
              </div>
              
              <div className="text-xs text-slate-500">
                {stage === 'Awareness' && 'Reach new people.'}
                {stage === 'Interest' && 'Spark curiosity.'}
                {stage === 'Desire' && 'Build preference.'}
                {stage === 'Action' && 'Get conversions.'}
              </div>
              {funnelStage === stage && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Channel Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-purple-600" />
          2. Select Advertising Channel
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          Based on <strong>{funnelStage}</strong>, we recommend:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(Channel).map((chn) => {
            const isRecommended = recommendedChannels.includes(chn);
            return (
              <button
                key={chn}
                onClick={() => handleChannelChange(chn)}
                className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${
                  channel === chn
                    ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                    : 'border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className={`p-2 rounded-full ${channel === chn ? 'bg-white' : 'bg-slate-100'}`}>
                   {chn === Channel.SEARCH && <Search className="w-5 h-5 text-slate-600" />}
                   {chn === Channel.SOCIAL && <Share2 className="w-5 h-5 text-slate-600" />}
                   {chn === Channel.DISPLAY && <Monitor className="w-5 h-5 text-slate-600" />}
                   {chn === Channel.VIDEO && <MonitorPlay className="w-5 h-5 text-slate-600" />}
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-800 text-sm flex items-center">
                    {chn}
                    <InfoTooltip text={DESCRIPTIONS[chn]} />
                    {isRecommended && (
                      <span className="ml-auto bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                {channel === chn && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Platform Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-indigo-600" />
          3. Select Platform
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          Where will your ads actually appear?
        </p>

        {availablePlatforms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms.map((plt) => (
              <button
                key={plt}
                onClick={() => onChange('platform', plt)}
                className={`p-4 rounded-lg border text-left transition-all relative ${
                  platform === plt
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-bold text-slate-800">{plt}</span>
                    <InfoTooltip text={DESCRIPTIONS[plt]} />
                  </div>
                  {platform === plt && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-xs text-slate-500">
                   {plt === Platform.GOOGLE_ADS && "Capture high intent searches."}
                   {plt === Platform.META_ADS && "Facebook & Instagram feeds."}
                   {plt === Platform.LINKEDIN_ADS && "Professional B2B targeting."}
                   {plt === Platform.YOUTUBE && "Pre-roll video ads."}
                   {plt === Platform.GOOGLE_DISPLAY && "Banners across the web."}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-500 text-sm">
            No platforms available for this channel yet.
          </div>
        )}
      </div>

    </div>
  );
};
