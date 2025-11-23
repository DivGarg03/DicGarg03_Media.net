
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
           <img 
               src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/adpilot-logo.png" 
               alt="AdPilot" 
               className="h-12 w-auto mx-auto mb-4"
           />
           <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
           <p className="text-slate-500 text-sm mt-1">Sign in to your AdPilot dashboard</p>
        </div>

        <div className="p-8">
          <div className="space-y-3 mb-6">
            <button 
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
            <button 
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition-colors"
            >
              <img src="https://www.svgrepo.com/show/355117/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
              Sign in with Microsoft
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-slate-700">Password</label>
                 <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <button onClick={onLogin} className="text-blue-600 font-bold hover:underline">Sign up</button>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-slate-400 text-xs text-center">
        &copy; 2024 AdPilot Inc. • Privacy • Terms
      </div>
    </div>
  );
};
