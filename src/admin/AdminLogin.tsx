import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/auth';
import { Lock, Mail, ShieldAlert, Sparkles, UserCheck, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
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
      const user = await auth.login(email, password);
      toast(`Access Granted. Welcome back, Owner!`, 'success');
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast(err.message || 'Invalid administrator credentials. Access denied.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast('Please enter your email to dispatch a reset code.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const responseMsg = await auth.forgotPassword(resetEmail);
      toast(responseMsg, 'success');
      setIsForgotPassword(false);
    } catch (err: any) {
      toast(err.message || 'Failed to trigger password recovery request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBypassLogin = () => {
    const creds = auth.getOwnerCredentials();
    setEmail(creds.email);
    setPassword(creds.password);
    toast('Preloaded developer setup Owner credentials.', 'info');
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

          {!isForgotPassword ? (
            // LOGIN FORM
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
                  <button 
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
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
          ) : (
            // FORGOT PASSWORD RECOVERY FORM
            <form onSubmit={handleForgotPassword} className="space-y-4">
              
              <div className="space-y-2">
                <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <KeyRound size={15} className="text-blue-400" />
                  Request Password Recovery
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter the owner account email address configured in the system. A recovery dispatch command will be triggered to allow a dynamic credentials rebuild.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Owner Email</label>
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-3 rounded-xl text-white focus-within:border-blue-500/50 transition-colors">
                  <Mail size={16} className="text-slate-500" />
                  <input 
                    type="email" 
                    required
                    placeholder="owner@zentriya.com" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="bg-transparent border-0 ring-0 focus:ring-0 text-sm outline-none w-full placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Dispatching Reset Link...' : 'Dispatch Recovery Code'}
                </button>

                <button 
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-bold py-3 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 border border-slate-800/80 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  Back to Sign In
                </button>
              </div>

            </form>
          )}

          {/* Secure Setup Mode / Quick Bypass Banner */}
          <div className="border-t border-slate-800/80 pt-5 space-y-3.5">
            <div className="flex items-center gap-2 justify-center">
              <ShieldAlert size={13} className="text-emerald-500" />
              <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                Developer Setup Mode
              </h4>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal text-center max-w-xs mx-auto">
              No registration allowed from UI. During standard deployment, use the default owner credentials below or configure them in settings.
            </p>

            <button 
              onClick={handleBypassLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 text-[10.5px] text-slate-300 font-bold tracking-wide flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <KeyRound size={12} className="text-emerald-500" />
              Preload Owner Demo Account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
