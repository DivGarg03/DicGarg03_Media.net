import React from 'react';
import { BudgetConfig } from '../../types';
import { ShieldCheck, Lock, AlertCircle, CalendarDays } from 'lucide-react';

interface Props {
  budget: BudgetConfig;
  onUpdate: (budget: BudgetConfig) => void;
}

export const BudgetStep: React.FC<Props> = ({ budget, onUpdate }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-slate-800">Set Your Budget</h2>
         <p className="text-slate-500 mt-2">Control exactly how much you spend. No surprises.</p>
      </div>

      {/* Daily Budget & Duration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        {/* Duration Input */}
        <div className="mb-8 border-b border-slate-100 pb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-500" />
                Campaign Duration (Days)
            </label>
            <div className="flex items-center gap-4">
                 <div className="flex-1">
                     <input
                        type="number"
                        min="1"
                        max="365"
                        value={budget.duration}
                        onChange={(e) => onUpdate({ ...budget, duration: Math.max(1, parseInt(e.target.value) || 0) })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                        placeholder="e.g. 30"
                     />
                 </div>
                 {/* Quick Selects */}
                 <div className="flex gap-2">
                    {[7, 14, 30].map(days => (
                        <button
                            key={days}
                            onClick={() => onUpdate({ ...budget, duration: days })}
                            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${budget.duration === days ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                            {days} Days
                        </button>
                    ))}
                 </div>
            </div>
        </div>

        {/* Daily Limit Slider */}
        <label className="block text-sm font-semibold text-slate-700 mb-4">Daily Spending Limit</label>
        <div className="flex items-center gap-4">
           <div className="flex-1">
             <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={budget.dailyLimit}
                onChange={(e) => onUpdate({ ...budget, dailyLimit: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
           </div>
           <div className="w-24 bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center">
              <span className="text-slate-500 mr-1">$</span>
              <input
                type="number"
                value={budget.dailyLimit}
                onChange={(e) => onUpdate({ ...budget, dailyLimit: parseInt(e.target.value) })}
                className="w-full bg-transparent outline-none font-bold text-slate-800"
              />
           </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Estimated Total Spend ({budget.duration} days): <span className="font-semibold">${budget.dailyLimit * budget.duration}</span>
        </p>
      </div>

      {/* HARD CAP SAFETY LOCK */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-32 h-32" />
        </div>
        
        <div className="flex items-start gap-4 relative z-10">
            <div className="bg-red-500 p-2 rounded-lg shadow-lg shadow-red-500/20">
                <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Hard Cap Safety Lock™
                </h3>
                <p className="text-slate-300 text-sm mt-1 mb-4">
                    The absolute maximum amount you will be charged this month. If spending hits this limit, AdPilot 
                    <span className="text-red-400 font-bold ml-1">instantly pauses</span> all campaigns.
                </p>
                
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                         <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                         <input
                            type="number"
                            value={budget.hardCap}
                            onChange={(e) => onUpdate({ ...budget, hardCap: parseInt(e.target.value) })}
                            className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-8 pr-4 text-slate-900 focus:ring-2 focus:ring-red-500 outline-none font-mono"
                         />
                    </div>
                    <div className="text-xs text-slate-400 w-1/3">
                        Must be ≥ total spend
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-2 items-start bg-yellow-50 p-4 rounded-lg border border-yellow-100">
         <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
         <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>Zero-Overspend Guarantee:</strong> Unlike other platforms that might exceed daily budgets by up to 20% on busy days, our Watchdog service strictly enforces your Hard Cap.
         </p>
      </div>
    </div>
  );
};