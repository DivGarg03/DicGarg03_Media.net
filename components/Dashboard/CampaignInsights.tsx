
import React, { useEffect, useState } from 'react';
import { Campaign, Insight, Anomaly } from '../../types';
import { generateInsights } from '../../services/geminiService';
import { InsightsPanel } from './InsightsPanel';
import { SpendChart } from './Charts';
import { DollarSign, MousePointer2, Eye, TrendingUp, Lock, ArrowLeft, Activity, User, MapPin } from 'lucide-react';

interface Props {
  campaign: Campaign;
  onBack: () => void;
}

export const CampaignInsights: React.FC<Props> = ({ campaign, onBack }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [anomaly, setAnomaly] = useState<Anomaly | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API latency for "backend" feel
    setLoading(true);
    const fetchAnalysis = async () => {
      try {
        const result = await generateInsights(campaign.metrics);
        setInsights(result.insights);
        setAnomaly(result.anomaly);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [campaign]);

  const isPaused = campaign.status === 'CAP_REACHED' || campaign.status === 'PAUSED';
  const spendPercentage = (campaign.metrics.spend / campaign.budget.hardCap) * 100;
  
  // Derived metrics for UI
  const conversionRate = campaign.metrics.clicks > 0 ? ((campaign.metrics.conversions / campaign.metrics.clicks) * 100).toFixed(1) : '0.0';
  const cpc = campaign.metrics.clicks > 0 ? (campaign.metrics.spend / campaign.metrics.clicks).toFixed(2) : '0.00';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Navigation & Header */}
      <div className="flex flex-col space-y-4">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Campaigns
        </button>
        <div className="flex justify-between items-end border-b border-slate-200 pb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Campaign Performance Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Real-time statistics for <span className="font-semibold text-slate-700">{campaign.name}</span></p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isPaused ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {campaign.status}
                </span>
            </div>
        </div>
      </div>

      {/* Row 1: Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Impressions</span>
             </div>
             <p className="text-2xl font-bold text-slate-900">{campaign.metrics.impressions.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 text-slate-500 mb-2">
                <MousePointer2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Clicks</span>
             </div>
             <p className="text-2xl font-bold text-slate-900">{campaign.metrics.clicks.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 text-slate-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Conversions</span>
             </div>
             <p className="text-2xl font-bold text-slate-900">{campaign.metrics.conversions.toLocaleString()}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-2 text-slate-500 mb-2 relative z-10">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Total Spend</span>
             </div>
             <p className="text-2xl font-bold text-slate-900 relative z-10">${campaign.metrics.spend.toLocaleString()}</p>
             <div className="absolute right-0 top-0 h-full w-2 bg-blue-500" style={{ opacity: spendPercentage / 100 }}></div>
          </div>
      </div>

      {/* Row 2: Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" /> Conversion Rate
             </h3>
             <div className="flex items-end gap-2">
                 <span className="text-3xl font-bold text-slate-900">{conversionRate}%</span>
                 <span className="text-xs text-slate-400 mb-1">Cost per conv: ${campaign.metrics.conversions > 0 ? (campaign.metrics.spend / campaign.metrics.conversions).toFixed(2) : '0.00'}</span>
             </div>
             <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(parseFloat(conversionRate) * 10, 100)}%` }}></div>
             </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" /> Cost per Click
             </h3>
             <div className="flex items-end gap-2">
                 <span className="text-3xl font-bold text-slate-900">${cpc}</span>
                 <span className="text-xs text-slate-400 mb-1">Industry avg: $2.50</span>
             </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" /> Campaign Health
             </h3>
             <div className="flex items-end gap-2">
                 <span className="text-3xl font-bold text-slate-900">Good</span>
                 <span className="text-xs text-green-500 mb-1 font-medium">Stable</span>
             </div>
              <p className="text-xs text-slate-400 mt-2">Based on CTR and Spend pacing.</p>
         </div>
      </div>

      {/* Row 3: Demographics & Geo (Mock Visuals to match PDF) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Age Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Audience breakdown by age</p>
            <div className="space-y-3">
               {[
                 { label: '18-24', pct: 25 },
                 { label: '25-34', pct: 35 },
                 { label: '35-44', pct: 22 },
                 { label: '45-54', pct: 12 },
                 { label: '55+', pct: 6 },
               ].map((item) => (
                 <div key={item.label} className="flex items-center text-xs">
                    <span className="w-10 text-slate-500">{item.label}</span>
                    <div className="flex-1 px-2">
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.pct}%`}}></div>
                       </div>
                    </div>
                    <span className="w-8 text-right font-medium text-slate-700">{item.pct}%</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Gender Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Audience breakdown by gender</p>
             <div className="space-y-4 pt-2">
               {[
                 { label: 'Male', pct: 48 },
                 { label: 'Female', pct: 50 },
                 { label: 'Other', pct: 2 },
               ].map((item) => (
                 <div key={item.label} className="flex items-center text-xs">
                    <span className="w-12 text-slate-500">{item.label}</span>
                    <div className="flex-1 px-2">
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.pct}%`}}></div>
                       </div>
                    </div>
                    <span className="w-8 text-right font-medium text-slate-700">{item.pct}%</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Geographic Distribution</h3>
             <p className="text-xs text-slate-500 mb-4">Audience breakdown by location</p>
             <div className="space-y-4 pt-2">
               {[
                 { label: 'Local Area', pct: 45 },
                 { label: 'Nearby Cities', pct: 35 },
                 { label: 'Regional', pct: 20 },
               ].map((item) => (
                 <div key={item.label} className="flex items-center text-xs">
                    <span className="w-20 text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {item.label}</span>
                    <div className="flex-1 px-2">
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.pct}%`}}></div>
                       </div>
                    </div>
                    <span className="w-8 text-right font-medium text-slate-700">{item.pct}%</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Row 4: Daily Performance & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Daily Performance Table */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-semibold text-slate-800 mb-1">Daily Performance</h3>
             <p className="text-xs text-slate-500 mb-6">Last 7 days performance</p>
             
             <div className="space-y-0">
               {campaign.metrics.dates.map((date, idx) => (
                 <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded">
                    <div>
                       <p className="text-xs font-semibold text-slate-800">{date}</p>
                       <p className="text-[10px] text-slate-400">1,180 impressions</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-green-600">{Math.floor(Math.random() * 10) + 1} conversions</p>
                       <p className="text-[10px] text-slate-400">${campaign.metrics.dailySpend[idx] || 0}</p>
                    </div>
                 </div>
               ))}
             </div>
         </div>

         {/* Peak Hours */}
         <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-semibold text-slate-800 mb-1">Peak Hours</h3>
             <p className="text-xs text-slate-500 mb-6">Best performing hours</p>
             
             <div className="space-y-4">
               {[
                 { time: '12:00', clicks: 250, sub: '18 clicks' },
                 { time: '13:00', clicks: 220, sub: '16 clicks' },
                 { time: '11:00', clicks: 200, sub: '15 clicks' },
                 { time: '17:00', clicks: 200, sub: '15 clicks' },
                 { time: '14:00', clicks: 190, sub: '14 clicks' },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      {item.time}
                    </span>
                    <div className="text-right">
                       <span className="font-bold text-slate-900 block">{item.clicks}</span>
                       <span className="text-[10px] text-slate-400">{item.sub}</span>
                    </div>
                 </div>
               ))}
             </div>
         </div>
      </div>

      {/* Row 5: AI Insights Panel */}
      <div className="bg-slate-50 p-1 rounded-2xl">
        <InsightsPanel 
              insights={insights} 
              anomaly={anomaly} 
              loading={loading} 
              metrics={campaign.metrics}
        />
      </div>

    </div>
  );
};
