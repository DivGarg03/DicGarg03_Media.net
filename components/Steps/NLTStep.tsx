import React, { useState, useEffect } from 'react';
import { TargetingCriteria } from '../../types';
import { generateTargetingFromText, generateTargetingFromBusinessInfo } from '../../services/geminiService';
import { Wand2, Target, MapPin, Users, Smartphone, Loader2, Sparkles, SwitchCamera } from 'lucide-react';

interface Props {
  targeting: TargetingCriteria;
  businessName: string;
  industry: string;
  websiteUrl: string;
  platform: string; // Received platform context
  onUpdate: (targeting: TargetingCriteria) => void;
}

export const NLTStep: React.FC<Props> = ({ targeting, businessName, industry, websiteUrl, platform, onUpdate }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [showNLT, setShowNLT] = useState(false);

  // Auto-populate on mount if empty
  useEffect(() => {
    // Safely check length with optional chaining
    const hasData = (targeting.interests?.length || 0) > 0 || (targeting.locations?.length || 0) > 0;
    
    if (!hasData && businessName) {
      const initData = async () => {
        setInitializing(true);
        try {
          // Pass platform to service
          const result = await generateTargetingFromBusinessInfo(businessName, industry, websiteUrl, platform);
          onUpdate(result);
        } catch (e) {
          console.error("Auto-population failed", e);
        } finally {
          setInitializing(false);
        }
      };
      initData();
    }
  }, []); // Run once on mount

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      // Pass platform to service
      const result = await generateTargetingFromText(businessName, industry, inputText, platform);
      onUpdate(result);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("We couldn't process that request right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Visual Targeting Matrix */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-xl text-slate-800">Targeting Matrix ({platform})</h3>
          {initializing && (
            <div className="flex items-center gap-2 text-blue-600 text-sm animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing for {platform}...</span>
            </div>
          )}
        </div>

        {initializing ? (
           <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm rounded-xl">
             <div className="text-center space-y-3">
               <Sparkles className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
               <p className="text-slate-600 font-medium">Optimizing for {platform} audience...</p>
             </div>
           </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Locations */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <MapPin className="w-4 h-4" /> Locations
            </div>
            <div className="flex flex-wrap gap-2">
              {targeting.locations?.length > 0 ? (
                targeting.locations.map((loc, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">{loc}</span>
                ))
              ) : <span className="text-slate-400 text-sm italic">No locations set</span>}
            </div>
          </div>

          {/* Interests */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <Users className="w-4 h-4" /> Interests / Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {targeting.interests?.length > 0 ? (
                targeting.interests.map((int, i) => (
                  <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">{int}</span>
                ))
              ) : <span className="text-slate-400 text-sm italic">No interests set</span>}
            </div>
          </div>
          
           {/* Demographics */}
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <Target className="w-4 h-4" /> Demographics
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>Age: <span className="font-semibold">{targeting.ageRange || 'All'}</span></p>
              <p>Gender: <span className="font-semibold">{targeting.gender || 'All'}</span></p>
            </div>
          </div>

           {/* Devices */}
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <Smartphone className="w-4 h-4" /> Devices
            </div>
            <div className="flex gap-2">
               {targeting.devices?.length > 0 ? targeting.devices.map((dev, i) => (
                 <span key={i} className="px-2 py-1 border border-slate-200 bg-white text-slate-600 text-xs rounded-md">{dev}</span>
               )) : <span className="text-slate-400 text-sm italic">All Devices</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Section for NLT */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-100 rounded-lg">
                 <Wand2 className="w-5 h-5 text-indigo-600" />
               </div>
               <div>
                  <h4 className="font-medium text-slate-900">Generate your ideal target</h4>
                  <p className="text-xs text-slate-500">Refine your audience using AI.</p>
               </div>
            </div>
            
            <button 
              onClick={() => setShowNLT(!showNLT)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showNLT ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showNLT ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
         </div>

         {/* Collapsible NLT Input */}
         {showNLT && (
           <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-lg shadow-md text-white">
                <p className="text-indigo-100 text-sm mb-4">
                  Describe your ideal customer. Our AI will re-configure the matrix above for <strong>{platform}</strong>.
                </p>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. I want to reach parents in Chicago who are interested in organic baby food and use iPhones."
                  className="w-full p-4 rounded-lg bg-white text-slate-900 focus:ring-4 focus:ring-indigo-400 outline-none min-h-[80px] text-sm"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !inputText}
                    className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                    {loading ? 'Processing...' : 'Generate Target'}
                  </button>
                </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};