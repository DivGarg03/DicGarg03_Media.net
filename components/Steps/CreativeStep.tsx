
import React, { useState } from 'react';
import { CreativeAsset, TargetingCriteria } from '../../types';
import { generateCreativeCopy, generateAdImage } from '../../services/geminiService';
import { Palette, Sparkles, LayoutTemplate, Loader2, ImagePlus } from 'lucide-react';

interface Props {
  creative: CreativeAsset;
  businessName: string;
  industry: string;
  targeting: TargetingCriteria;
  platform: string;
  funnelStage: string;
  onUpdate: (creative: CreativeAsset) => void;
}

export const CreativeStep: React.FC<Props> = ({ creative, businessName, industry, targeting, platform, funnelStage, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleAutoGenerate = async () => {
    setLoading(true);
    try {
      // Pass platform to service
      const generated = await generateCreativeCopy(businessName, industry, targeting, platform);
      onUpdate({ ...creative, ...generated });
    } catch (e) {
      console.error(e);
      alert("Could not generate copy");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageLoading(true);
    try {
      const imageUrl = await generateAdImage(businessName, industry, platform, funnelStage, targeting);
      onUpdate({ ...creative, backgroundImageUrl: imageUrl });
    } catch (e) {
      console.error(e);
      alert("Could not generate image");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Editor */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Creative Builder
            </h2>
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={handleAutoGenerate}
                disabled={loading}
                className="text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Auto-Write Copy
              </button>
              <button
                onClick={handleGenerateImage}
                disabled={imageLoading}
                className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
              >
                {imageLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImagePlus className="w-3 h-3" />}
                Generate New Creative
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Headline</label>
              <input
                type="text"
                value={creative.headline}
                onChange={(e) => onUpdate({ ...creative, headline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:border-purple-500 outline-none"
                maxLength={40}
              />
              <p className="text-right text-xs text-slate-400 mt-1">{(creative.headline || '').length}/40</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
              <textarea
                rows={3}
                value={creative.description}
                onChange={(e) => onUpdate({ ...creative, description: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:border-purple-500 outline-none resize-none"
                maxLength={90}
              />
              <p className="text-right text-xs text-slate-400 mt-1">{(creative.description || '').length}/90</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Call to Action</label>
              <select
                value={creative.ctaText}
                onChange={(e) => onUpdate({ ...creative, ctaText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
              >
                <option>Shop Now</option>
                <option>Learn More</option>
                <option>Sign Up</option>
                <option>Get Offer</option>
              </select>
            </div>

             <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={creative.primaryColor}
                  onChange={(e) => onUpdate({ ...creative, primaryColor: e.target.value })}
                  className="h-8 w-16 cursor-pointer border-0 rounded-md"
                />
                <span className="text-xs text-slate-500 font-mono">{creative.primaryColor}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
             <LayoutTemplate className="w-4 h-4" /> Select Layout
           </h3>
           <div className="grid grid-cols-3 gap-2">
             {['classic', 'bold', 'minimal'].map((layout) => (
               <button
                key={layout}
                onClick={() => onUpdate({...creative, layoutTemplate: layout as any})}
                className={`py-2 text-xs border rounded-md capitalize ${creative.layoutTemplate === layout ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
               >
                 {layout}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col justify-start items-center">
        <h3 className="text-sm font-semibold text-slate-500 mb-4">Ad Preview ({platform})</h3>
        <div className="w-[320px] bg-white rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden relative h-[580px] flex flex-col">
            {/* Mock Status Bar */}
            <div className="h-6 bg-slate-800 flex justify-between items-center px-4">
                <div className="w-10 h-3 bg-slate-600 rounded-full"></div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                </div>
            </div>
            
            {/* Social App Shell */}
            <div className="bg-slate-100 flex-1 p-3 overflow-y-auto">
               {/* The Ad Card */}
               <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                   <div className="flex items-center p-3 gap-2">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                           {businessName.charAt(0) || 'B'}
                       </div>
                       <div>
                           <p className="text-xs font-bold text-slate-800">{businessName || 'Business Name'}</p>
                           <p className="text-[10px] text-slate-400">Sponsored • {platform}</p>
                       </div>
                   </div>
                   
                   {/* Image Placeholder */}
                   <div className="w-full h-48 bg-slate-200 relative flex items-center justify-center overflow-hidden">
                       <img 
                        src={creative.backgroundImageUrl || `https://picsum.photos/600/400?random=${Math.random()}`}
                        alt="Ad Creative" 
                        className="w-full h-full object-cover transition-opacity duration-500"
                       />
                       
                       {/* Loading Overlay */}
                       {imageLoading && (
                         <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                           <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                           <p className="text-xs text-indigo-900 font-medium">Creating visual...</p>
                         </div>
                       )}

                       {creative.layoutTemplate === 'bold' && (
                           <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent">
                               <p className="text-white font-bold text-lg leading-tight">{creative.headline}</p>
                           </div>
                       )}
                   </div>
                   
                   {/* Ad Body */}
                   <div className="p-3">
                       {creative.layoutTemplate !== 'bold' && (
                           <h4 className={`font-bold text-slate-900 mb-1 ${creative.layoutTemplate === 'minimal' ? 'text-sm' : 'text-base'}`}>
                               {creative.headline || 'Your Headline Here'}
                           </h4>
                       )}
                       <p className="text-xs text-slate-600 leading-relaxed mb-3">
                           {creative.description || 'Your ad description will appear here. It should be persuasive and clear.'}
                       </p>
                       
                       <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between items-center">
                           <span className="text-[10px] text-slate-500 uppercase font-medium">Website</span>
                           <button 
                            style={{ backgroundColor: creative.primaryColor }}
                            className="text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-sm"
                           >
                               {creative.ctaText}
                           </button>
                       </div>
                   </div>
               </div>
               
               {/* Mock Content Below */}
               <div className="h-32 bg-white rounded-lg shadow-sm"></div>
            </div>
        </div>
      </div>
    </div>
  );
};
