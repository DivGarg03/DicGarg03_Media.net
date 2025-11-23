
import React, { useState } from 'react';
import { Campaign, CampaignStatus } from './types';
import { INITIAL_CAMPAIGN, MOCK_CAMPAIGNS_LIST } from './services/mockData';
import { BusinessInfoStep } from './components/Steps/BusinessInfoStep';
import { ChannelSelectionStep } from './components/Steps/ChannelSelectionStep';
import { NLTStep } from './components/Steps/NLTStep';
import { CreativeStep } from './components/Steps/CreativeStep';
import { BudgetStep } from './components/Steps/BudgetStep';
import { DashboardList } from './components/Dashboard/DashboardList';
import { CampaignInsights } from './components/Dashboard/CampaignInsights';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { ChevronRight, ChevronLeft, UserCircle, Settings, CreditCard } from 'lucide-react';

enum View {
  WIZARD = 'WIZARD',
  DASHBOARD_LIST = 'DASHBOARD_LIST',
  CAMPAIGN_DETAILS = 'CAMPAIGN_DETAILS',
  PROFILE = 'PROFILE'
}

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);

  // App View State
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD_LIST);
  
  // State for Wizard
  const [wizardCampaign, setWizardCampaign] = useState<Campaign>(INITIAL_CAMPAIGN);
  const [wizardStep, setWizardStep] = useState(1);
  const TOTAL_STEPS = 5;

  // State for Dashboard
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS_LIST);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView(View.DASHBOARD_LIST); // Default to dashboard after login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLoginPage(false);
    setWizardCampaign(INITIAL_CAMPAIGN);
    setWizardStep(1);
  };

  const handleWizardUpdate = (field: string, value: any) => {
    setWizardCampaign((prev) => {
      // 1. Check for actual changes
      if (JSON.stringify(prev[field as keyof Campaign]) === JSON.stringify(value)) {
        return prev;
      }

      const next = { ...prev, [field]: value };

      // 2. Cascading Resets
      if (['businessName', 'websiteUrl', 'industry'].includes(field)) {
        return {
          ...next,
          companyOverview: INITIAL_CAMPAIGN.companyOverview,
          funnelStage: INITIAL_CAMPAIGN.funnelStage,
          channel: INITIAL_CAMPAIGN.channel,
          platform: INITIAL_CAMPAIGN.platform,
          targeting: { ...INITIAL_CAMPAIGN.targeting },
          creative: { ...INITIAL_CAMPAIGN.creative },
          budget: { ...INITIAL_CAMPAIGN.budget }
        };
      }

      if (['funnelStage', 'channel', 'platform'].includes(field)) {
        return {
          ...next,
          targeting: { ...INITIAL_CAMPAIGN.targeting },
          creative: { ...INITIAL_CAMPAIGN.creative },
          budget: { ...INITIAL_CAMPAIGN.budget }
        };
      }

      if (field === 'targeting') {
        return {
          ...next,
          creative: { ...INITIAL_CAMPAIGN.creative },
          budget: { ...INITIAL_CAMPAIGN.budget }
        };
      }

      if (field === 'creative') {
        return {
          ...next,
          budget: { ...INITIAL_CAMPAIGN.budget }
        };
      }

      return next;
    });
  };

  const handleNextStep = () => {
    if (wizardStep < TOTAL_STEPS) {
      setWizardStep(wizardStep + 1);
    } else {
      // Finish Wizard: Create Campaign
      const newCampaign = {
        ...wizardCampaign,
        id: `camp-${Date.now()}`,
        status: CampaignStatus.ACTIVE,
        startDate: new Date().toISOString()
      };
      
      setCampaigns([newCampaign, ...campaigns]);
      setCurrentView(View.DASHBOARD_LIST);
    }
  };

  const loadDemoData = () => {
    setCampaigns(MOCK_CAMPAIGNS_LIST);
    setCurrentView(View.DASHBOARD_LIST);
  };

  const handleNewCampaign = () => {
    setWizardCampaign(INITIAL_CAMPAIGN);
    setWizardStep(1);
    setCurrentView(View.WIZARD);
  };

  const handleSelectCampaign = (c: Campaign) => {
    setSelectedCampaignId(c.id);
    setCurrentView(View.CAMPAIGN_DETAILS);
  };

  const handleStatusChange = (id: string, newStatus: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      if (selectedCampaignId === id) {
        setSelectedCampaignId(null);
        setCurrentView(View.DASHBOARD_LIST);
      }
    }
  };

  // --- UNAUTHENTICATED VIEWS ---
  if (!isAuthenticated) {
    if (isLoginPage) {
      return <LoginPage onLogin={handleLogin} onBack={() => setIsLoginPage(false)} />;
    }
    return <LandingPage onLoginClick={() => setIsLoginPage(true)} />;
  }

  // --- AUTHENTICATED APP ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView(View.DASHBOARD_LIST)}>
             <img 
               src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/adpilot-logo.png" 
               alt="AdPilot Logo" 
               className="h-8 w-auto" 
             />
          </div>
          
          <div className="flex items-center gap-8">
            <button
              onClick={handleNewCampaign}
              className={`text-sm font-medium transition-colors ${currentView === View.WIZARD ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              New Campaign
            </button>
            <button
              onClick={() => setCurrentView(View.DASHBOARD_LIST)}
              className={`text-sm font-medium transition-colors ${(currentView === View.DASHBOARD_LIST || currentView === View.CAMPAIGN_DETAILS) ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView(View.PROFILE)}
              className={`text-sm font-medium transition-colors ${currentView === View.PROFILE ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Profile
            </button>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={loadDemoData} className="text-xs text-slate-400 hover:text-slate-600 underline">
               Reset Demo
             </button>
             <div 
               className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
               onClick={() => setCurrentView(View.PROFILE)}
             >
                <UserCircle className="w-5 h-5 text-slate-400" />
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === View.DASHBOARD_LIST && (
          <DashboardList 
            campaigns={campaigns} 
            onSelectCampaign={handleSelectCampaign}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteCampaign}
          />
        )}

        {currentView === View.CAMPAIGN_DETAILS && (
          <CampaignInsights 
            campaign={activeCampaign}
            onBack={() => setCurrentView(View.DASHBOARD_LIST)}
          />
        )}

        {currentView === View.PROFILE && (
          <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                    U
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Demo User</h2>
                    <p className="text-slate-500">user@example.com</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Pro Plan
                    </div>
                  </div>
               </div>
               
               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50">
                         <Settings className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                       </div>
                       <h3 className="font-semibold text-slate-800">Account Settings</h3>
                    </div>
                    <p className="text-sm text-slate-500 pl-12">Manage login details and preferences.</p>
                 </div>

                 <div className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50">
                         <CreditCard className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                       </div>
                       <h3 className="font-semibold text-slate-800">Billing & Payment</h3>
                    </div>
                    <p className="text-sm text-slate-500 pl-12">View invoices and manage payment methods.</p>
                 </div>
               </div>
               
               <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 text-sm font-medium hover:text-red-800 hover:underline"
                  >
                    Sign Out
                  </button>
               </div>
            </div>
          </div>
        )}

        {currentView === View.WIZARD && (
          <div className="max-w-4xl mx-auto py-12 px-4">
            {/* Wizard Progress */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-2">
                 <h1 className="text-2xl font-bold text-slate-800">
                    {wizardCampaign.name || 'Create New Campaign'}
                 </h1>
                 <span className="text-sm text-slate-500">Step {wizardStep} of {TOTAL_STEPS}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${(wizardStep / TOTAL_STEPS) * 100}%` }}></div>
              </div>
            </div>

            {/* Wizard Steps */}
            <div className="min-h-[400px]">
               {wizardStep === 1 && (
                 <BusinessInfoStep 
                   businessName={wizardCampaign.businessName}
                   websiteUrl={wizardCampaign.websiteUrl}
                   industry={wizardCampaign.industry}
                   campaignName={wizardCampaign.name}
                   onChange={handleWizardUpdate}
                 />
               )}
               {wizardStep === 2 && (
                 <ChannelSelectionStep 
                    funnelStage={wizardCampaign.funnelStage}
                    channel={wizardCampaign.channel}
                    platform={wizardCampaign.platform}
                    companyOverview={wizardCampaign.companyOverview}
                    businessName={wizardCampaign.businessName}
                    websiteUrl={wizardCampaign.websiteUrl}
                    industry={wizardCampaign.industry}
                    onChange={handleWizardUpdate}
                 />
               )}
               {wizardStep === 3 && (
                 <NLTStep 
                   targeting={wizardCampaign.targeting}
                   businessName={wizardCampaign.businessName}
                   websiteUrl={wizardCampaign.websiteUrl}
                   industry={wizardCampaign.industry}
                   platform={wizardCampaign.platform}
                   onUpdate={(val) => handleWizardUpdate('targeting', val)}
                 />
               )}
               {wizardStep === 4 && (
                 <CreativeStep 
                   creative={wizardCampaign.creative}
                   businessName={wizardCampaign.businessName}
                   industry={wizardCampaign.industry}
                   targeting={wizardCampaign.targeting}
                   platform={wizardCampaign.platform}
                   funnelStage={wizardCampaign.funnelStage}
                   onUpdate={(val) => handleWizardUpdate('creative', val)}
                 />
               )}
               {wizardStep === 5 && (
                 <BudgetStep 
                   budget={wizardCampaign.budget}
                   onUpdate={(val) => handleWizardUpdate('budget', val)}
                 />
               )}
            </div>

            {/* Wizard Footer */}
            <div className="mt-10 flex justify-between pt-6 border-t border-slate-200">
               <button 
                 disabled={wizardStep === 1}
                 onClick={() => setWizardStep(wizardStep - 1)}
                 className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
               >
                 <ChevronLeft className="w-4 h-4" /> Back
               </button>
               <button 
                 onClick={handleNextStep}
                 className="px-8 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
               >
                 {wizardStep === TOTAL_STEPS ? 'Launch Campaign' : 'Next Step'} <ChevronRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
