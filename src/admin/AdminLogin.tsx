import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';
import { Lock, Mail, Sparkles, UserCheck, RefreshCw } from 'lucide-react';
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
      toast('Please enter your owner email address.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await auth.login(email, password);
      toast(`Access Granted. Welcome back, Owner!`, 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast(err.message || 'Invalid administrator credentials. Access denied.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="admin-login-root" className="min-h-screen bg-[#040812] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Visual background decorations & ambient glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none select-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <img 
            src="/logo.png" 
            alt="Zentriya Logo" 
            className="w-16 h-16 object-contain mx-auto drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
          />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Zentriya IT Solutions
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            <UserCheck size={11} className="animate-pulse" />
            Owner-Only Administrative Console
          </div>
        </div>

        {/* Form panel */}
        <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6 relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-emerald-500 rounded-t-[28px]" />

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Owner Email Address</label>
                <span className="text-[8px] text-slate-500 font-mono font-bold uppercase">SECURE ENTRY</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-3 rounded-xl text-white focus-within:border-emerald-500/50 transition-colors">
                <Mail size={16} className="text-slate-500" />
                <input 
                  type="email" 
                  required
                  placeholder="owner@zentriya.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-0 ring-0 focus:ring-0 text-sm outline-none w-full placeholder:text-slate-650"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Password</label>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-3 rounded-xl text-white focus-within:border-emerald-500/50 transition-colors">
                <Lock size={16} className="text-slate-500" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-0 ring-0 focus:ring-0 text-sm outline-none w-full placeholder:text-slate-650"
                />
              </div>
            </div>

            <div className="pt-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white font-extrabold py-3 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Authenticating Owner...
                  </>
                ) : (
                  <>
                    Authenticate Session
                    <Sparkles size={14} fill="white" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
