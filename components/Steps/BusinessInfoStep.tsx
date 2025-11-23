import React from 'react';
import { Industry } from '../../types';
import { Briefcase, Globe, Building2, Tag } from 'lucide-react';

interface Props {
  businessName: string;
  websiteUrl: string;
  industry: Industry;
  campaignName: string;
  onChange: (field: string, value: any) => void;
}

export const BusinessInfoStep: React.FC<Props> = ({ businessName, websiteUrl, industry, campaignName, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          Tell us about your business
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          We'll use this to automatically suggest the best settings for your ads.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => onChange('businessName', e.target.value)}
              placeholder="e.g. Joe's Pizza"
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => onChange('websiteUrl', e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">We'll try to grab your brand colors from here.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <select
                value={industry}
                onChange={(e) => onChange('industry', e.target.value as Industry)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none"
              >
                {Object.values(Industry).map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={campaignName}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="e.g. Summer Sale 2024"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};