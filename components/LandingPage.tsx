
import React from 'react';
import { ChevronRight, ShieldCheck, Zap, BarChart3, Globe, CheckCircle2 } from 'lucide-react';

interface Props {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
               src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/adpilot-logo.png" 
               alt="AdPilot Logo" 
               className="h-10 w-auto"
               onError={(e) => {
                 // Fallback if image fails
                 e.currentTarget.style.display = 'none';
                 e.currentTarget.nextElementSibling?.classList.remove('hidden');
               }}
             />
             <span className="text-2xl font-bold text-slate-900 hidden tracking-tight">AdPilot</span>
          </div>
          
          <div className="flex items-center gap-6">
             <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#" className="hover:text-blue-600 transition-colors">Advertisers</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Publishers</a>
                <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
             </nav>
             <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
             <button 
               onClick={onLoginClick}
               className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
             >
               Log In
             </button>
             <button 
               onClick={onLoginClick}
               className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
             >
               Sign Up Free
             </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 to-white -z-10"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/50 to-transparent -z-10 rounded-bl-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                 Advertising <br />
                 <span className="text-blue-600">Simplified by AI.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                 AdPilot empowers small businesses to launch professional ad campaigns across Google, Meta, and LinkedIn in minutes. No agency required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={onLoginClick}
                   className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 text-lg"
                 >
                   Start Your Campaign <ChevronRight className="w-5 h-5" />
                 </button>
                 <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm text-lg">
                   Watch Demo
                 </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500 pt-4">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Cancel anytime
                 </div>
              </div>
           </div>

           <div className="relative animate-in slide-in-from-right-8 duration-1000 delay-200">
              {/* Abstract Dashboard Mockup */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                 <img 
                   src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                   alt="Dashboard Preview" 
                   className="rounded-xl w-full h-auto"
                 />
                 
                 {/* Floating Cards */}
                 <div className="absolute -left-8 bottom-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow">
                    <div className="flex items-center gap-3">
                       <div className="bg-green-100 p-2 rounded-lg">
                          <Zap className="w-5 h-5 text-green-600" />
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold">ROI Boost</p>
                          <p className="text-lg font-bold text-slate-900">+124%</p>
                       </div>
                    </div>
                 </div>

                 <div className="absolute -right-6 top-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                       <div className="bg-blue-100 p-2 rounded-lg">
                          <ShieldCheck className="w-5 h-5 text-blue-600" />
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold">Safety Lock</p>
                          <p className="text-sm font-bold text-slate-900">Active</p>
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl font-bold text-slate-900 mb-4">Why AdPilot?</h2>
               <p className="text-slate-600 text-lg">
                 We combine enterprise-grade AI with a simplified interface designed specifically for small business growth.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                     <Globe className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Context-Aware Setup</h3>
                  <p className="text-slate-600 leading-relaxed">
                     Our AI scans your website to automatically configure your industry, target audience, and ad creative in seconds.
                  </p>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                     <ShieldCheck className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Hard Cap Safety Lock™</h3>
                  <p className="text-slate-600 leading-relaxed">
                     Never overspend again. Our anomaly watchdog instantly pauses campaigns if they hit your defined limit.
                  </p>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                     <BarChart3 className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Plain English Insights</h3>
                  <p className="text-slate-600 leading-relaxed">
                     No more complex spreadsheets. Get clear, actionable advice like "Your ad is seen but not clicked—change the image."
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
               <h4 className="text-white font-bold text-lg mb-4">AdPilot</h4>
               <p className="text-sm text-slate-400">
                  Empowering SMBs to compete with giants using AI-driven advertising technology.
               </p>
            </div>
            <div>
               <h5 className="text-white font-semibold mb-4">Platform</h5>
               <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Case Studies</a></li>
               </ul>
            </div>
            <div>
               <h5 className="text-white font-semibold mb-4">Resources</h5>
               <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">API Docs</a></li>
               </ul>
            </div>
            <div>
               <h5 className="text-white font-semibold mb-4">Legal</h5>
               <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © 2024 AdPilot Inc. All rights reserved.
         </div>
      </footer>
    </div>
  );
};
