
import React from 'react';
import { Campaign, CampaignStatus } from '../../types';
import { ArrowRight, Calendar, DollarSign, Lock, AlertCircle, PlayCircle, PauseCircle, Trash2, Play, Pause } from 'lucide-react';

interface Props {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onDelete: (id: string) => void;
}

export const DashboardList: React.FC<Props> = ({ campaigns, onSelectCampaign, onStatusChange, onDelete }) => {
  const getDaysRemaining = (start: string, duration: number) => {
    const startDate = new Date(start);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const remaining = duration - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-500">Overview of all your marketing activities</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Status</th>
                <th className="p-4">Campaign Name</th>
                <th className="p-4">Monthly Spend</th>
                <th className="p-4">Hard Cap</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">Days Remaining</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No campaigns found. Start a new one!
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr 
                    key={campaign.id} 
                    onClick={() => onSelectCampaign(campaign)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                       {campaign.status === CampaignStatus.ACTIVE && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 gap-1"><PlayCircle className="w-3 h-3"/> Active</span>}
                       {campaign.status === CampaignStatus.PAUSED && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 gap-1"><PauseCircle className="w-3 h-3"/> Paused</span>}
                       {campaign.status === CampaignStatus.CAP_REACHED && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 gap-1"><Lock className="w-3 h-3"/> Cap Hit</span>}
                       {campaign.status === CampaignStatus.DRAFT && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Draft</span>}
                    </td>
                    <td className="p-4 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {campaign.name}
                    </td>
                    <td className="p-4 text-slate-600 font-mono">
                      ${campaign.metrics.spend.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-600 font-mono">
                      ${campaign.budget.hardCap.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {formatDate(campaign.startDate)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {getDaysRemaining(campaign.startDate, campaign.budget.duration)} Days
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {campaign.status === CampaignStatus.ACTIVE && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onStatusChange(campaign.id, CampaignStatus.PAUSED);
                               }}
                               className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                               title="Pause Campaign"
                             >
                                <Pause className="w-4 h-4" />
                             </button>
                          )}
                          {campaign.status === CampaignStatus.PAUSED && (
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onStatusChange(campaign.id, CampaignStatus.ACTIVE);
                               }}
                               className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                               title="Activate Campaign"
                             >
                                <Play className="w-4 h-4" />
                             </button>
                          )}
                          <button
                            onClick={(e) => {
                               e.stopPropagation();
                               onDelete(campaign.id);
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Campaign"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 ml-2" />
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
