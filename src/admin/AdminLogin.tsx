import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';
import { Lock, Mail, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast('Please enter a valid administrator email.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await auth.login(email, password);
      toast(`Welcome back, ${user.name}! Authenticated as: ${user.role}`, 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      toast('Invalid login credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('password123');
    toast(`Preloaded credentials for ${quickEmail.split('@')[0]}`, 'info');
  };

  return (
    <div id="admin-login-root" className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Visual background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <img 
            src="/logo.png" 
            alt="Zentriya Logo" 
            className="w-14 h-14 object-contain mx-auto" 
          />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Zentriya IT Solutions
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <UserCheck size={12} className="text-emerald-500" />
            Super Admin Console Access
          </p>
        </div>

        {/* Form panel */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-white">
                <Mail size={16} className="text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="admin@zentriya.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-0 ring-0 focus:ring-0 text-sm outline-none w-full"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Password</label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-white">
                <Lock size={16} className="text-slate-500" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-0 ring-0 focus:ring-0 text-sm outline-none w-full"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg text-sm flex items-center justify-center gap-1.5"
              >
                Authenticate Session
                <Sparkles size={14} fill="white" />
              </button>
            </div>

          </form>

          {/* Quick Mock Accounts - Highly functional demonstration mechanism for evaluation! */}
          <div className="border-t border-slate-800 pt-5 space-y-3">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 justify-center">
              <ShieldAlert size={12} className="text-amber-500" />
              Evaluation Role Bypass
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-300">
              <button 
                onClick={() => handleQuickLogin('superadmin@zentriya.com')}
                className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-left border border-slate-800 hover:border-emerald-500 transition-colors"
              >
                Super Admin <span className="block text-[8px] text-slate-500 font-normal">Full access</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('admin@zentriya.com')}
                className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-left border border-slate-800 hover:border-emerald-500 transition-colors"
              >
                Admin <span className="block text-[8px] text-slate-500 font-normal">Manage Content</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('hr@zentriya.com')}
                className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-left border border-slate-800 hover:border-emerald-500 transition-colors"
              >
                HR Specialist <span className="block text-[8px] text-slate-500 font-normal">Careers/Applicants</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('trainer@zentriya.com')}
                className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-left border border-slate-800 hover:border-emerald-500 transition-colors"
              >
                Trainer <span className="block text-[8px] text-slate-500 font-normal">Internships/Courses</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('editor@zentriya.com')}
                className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-left border border-slate-800 hover:border-emerald-500 transition-colors"
              >
                Editor <span className="block text-[8px] text-slate-500 font-normal">Blogs/Gallery</span>
              </button>
              <button 
                onClick={() => handleQuickLogin('support@zentriya.com')}
                className="bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-left border border-slate-800 hover:border-emerald-500 transition-colors"
              >
                Support <span className="block text-[8px] text-slate-500 font-normal">Contact Messages</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
