
import React, { useState } from 'react';
import { Insight, Anomaly, CampaignMetrics } from '../../types';
import { Lightbulb, CheckCircle2, AlertTriangle, Info, Siren, MessageSquarePlus, Send, Loader2 } from 'lucide-react';
import { generateCustomInsight } from '../../services/geminiService';

interface Props {
  insights: Insight[];
  anomaly: Anomaly | null;
  loading: boolean;
  metrics: CampaignMetrics;
}

export const InsightsPanel: React.FC<Props> = ({ insights, anomaly, loading, metrics }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [customResult, setCustomResult] = useState<string | null>(null);
  const [customLoading, setCustomLoading] = useState(false);

  const handleAskCustom = async () => {
    if (!customQuery.trim()) return;
    setCustomLoading(true);
    setCustomResult(null);
    try {
      const answer = await generateCustomInsight(metrics, customQuery);
      setCustomResult(answer);
    } catch (e) {
      setCustomResult("Unable to generate insight right now. Please try again.");
    } finally {
      setCustomLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex items-center justify-center">
        <p className="text-slate-400 animate-pulse flex items-center gap-2">
           <Loader2 className="w-4 h-4 animate-spin" /> Loading insights...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Anomaly Watchdog Alert */}
      {anomaly && anomaly.detected && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-bounce-in">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-full">
               <Siren className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-red-800 font-bold text-sm uppercase tracking-wide">Anomaly Detected</h4>
              <p className="text-red-700 text-sm mt-1">{anomaly.description}</p>
              <div className="mt-2 text-xs text-red-500 font-mono">Watchdog Service: Alert Sent via Email</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Key Insights
        </h3>
        <div className="space-y-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
              {insight.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />}
              {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />}
              {insight.type === 'info' && <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />}
              {insight.type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />}
              
              <p className="text-slate-600 text-sm leading-relaxed">{insight.message}</p>
            </div>
          ))}
          {insights.length === 0 && <p className="text-slate-400 text-sm">No insights available yet.</p>}
        </div>
      </div>

      {/* More Insights / Custom Query */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {!showCustomInput ? (
          <button 
            onClick={() => setShowCustomInput(true)}
            className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium text-sm hover:bg-blue-50 py-2 rounded-lg transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            More insights
          </button>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
             <h4 className="text-sm font-semibold text-slate-700">Ask about your data</h4>
             <div className="flex gap-2">
               <input 
                 type="text"
                 value={customQuery}
                 onChange={(e) => setCustomQuery(e.target.value)}
                 placeholder="e.g. Why is my CTR low today?"
                 className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                 onKeyDown={(e) => e.key === 'Enter' && handleAskCustom()}
               />
               <button 
                 onClick={handleAskCustom}
                 disabled={customLoading || !customQuery.trim()}
                 className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
               >
                 {customLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
               </button>
             </div>
             
             {customResult && (
               <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 mt-2 border border-slate-100">
                 <span className="font-bold text-blue-600 mr-1">AI Answer:</span> 
                 {customResult}
               </div>
             )}
             
             <button 
               onClick={() => setShowCustomInput(false)}
               className="text-xs text-slate-400 hover:text-slate-600 underline mt-1"
             >
               Cancel
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
