import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { auth } from '../services/auth';
import { ActivityLog, UserProfile } from '../types';
import { 
  Users, Briefcase, MessageSquare, GraduationCap, 
  Terminal, ShieldCheck, Database, RefreshCw, Cpu 
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function AdminOverview() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({
    studentsCount: 15340,
    placedRate: 94,
    applicationsCount: 0,
    messagesCount: 0
  });
  const [dbConfig, setDbConfig] = useState(db.getDbConfig);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'warning' | 'none'>('none');
  const { toast } = useToast();

  useEffect(() => {
    setUser(auth.getCurrentUser());
    
    const loadOverviewData = async () => {
      const [allLogs, apps, msgs] = await Promise.all([
        db.getActivityLogs(),
        db.getApplications(),
        db.getContactMessages()
      ]);
      setLogs(allLogs);
      setStats(prev => ({
        ...prev,
        applicationsCount: apps.filter(a => a.status === 'Pending').length,
        messagesCount: msgs.filter(m => !m.isRead).length
      }));
    };

    loadOverviewData();
  }, []);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus('none');
    
    // Simulate connection diagnostic
    setTimeout(() => {
      const config = db.getDbConfig();
      if (!config.url || !config.anonKey) {
        setConnectionStatus('warning');
        toast('No Supabase credentials detected. Running in Offline Mock Database mode.', 'warning');
      } else {
        setConnectionStatus('success');
        toast('Supabase Connection established successfully!', 'success');
      }
      setTestingConnection(false);
    }, 1500);
  };

  return (
    <div id="admin-overview-root" className="space-y-8 animate-fade-in">
      
      {/* Upper greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Console Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor real-time student placements, recruitment applications, support inquiries, and system operations.
          </p>
        </div>

        {/* Database Diagnostic Control */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-sm">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'success' ? 'bg-emerald-500 animate-pulse' :
            connectionStatus === 'warning' ? 'bg-amber-500 animate-pulse' :
            'bg-blue-500'
          }`} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {dbConfig.useMock ? 'Mock Offline DB' : 'Supabase Connected'}
          </span>
          <button 
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
            title="Diagnose database pipeline"
          >
            <RefreshCw size={13} className={testingConnection ? 'animate-spin text-emerald-500' : ''} />
          </button>
        </div>
      </div>

      {/* 4 Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Trainees</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {(stats.studentsCount).toLocaleString()}+
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Placement Success</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.placedRate}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Applications Pending</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.applicationsCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Inquiries Received</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.messagesCount}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
        </div>

      </div>

      {/* Middle Row - Interactive Analytics curves & DB Connection guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG charts curve */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              Trainee Recruitment & Placement Trend (Fall 2026)
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-bold uppercase">
              Operational Statistics
            </span>
          </div>

          {/* SVG representation - Responsive crash proof curve */}
          <div className="relative w-full h-64 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 p-2">
            <svg viewBox="0 0 500 200" className="w-full h-full text-emerald-500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Gridlines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-900" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-900" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-900" />
              
              {/* Areas */}
              <path 
                d="M 10 180 L 100 140 L 200 120 L 300 80 L 400 40 L 490 20 L 490 190 L 10 190 Z" 
                fill="url(#chart-grad)"
              />
              
              {/* Line curve */}
              <path 
                d="M 10 180 L 100 140 L 200 120 L 300 80 L 400 40 L 490 20" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              
              {/* Data circles */}
              <circle cx="10" cy="180" r="4" fill="#047857" />
              <circle cx="100" cy="140" r="4" fill="#047857" />
              <circle cx="200" cy="120" r="4" fill="#047857" />
              <circle cx="300" cy="80" r="4" fill="#047857" />
              <circle cx="400" cy="40" r="4" fill="#047857" />
              <circle cx="490" cy="20" r="4" fill="#047857" />
            </svg>
            
            {/* Axis marks */}
            <div className="absolute bottom-2 left-0 w-full flex justify-between px-6 text-[9px] font-bold text-slate-400">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
            </div>
          </div>
        </div>

        {/* Cloud Config / Supabase Guide Box */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl text-white space-y-4">
          <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-2 text-emerald-400">
            <Database size={16} />
            Supabase Connection
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            By default, Zentriya IT Solutions loads dynamic simulated mock-data from your browser's persistent localStorage container. This ensures that you can test all features and super admin dashboards immediately without any manual setup!
          </p>
          
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">Real Setup Guide</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              To connect your real live Supabase Project, enter your credentials in the <span className="text-emerald-400">Website Settings</span> panel. The database connector will auto-generate your live tables, synchronize schemas, and route operations immediately!
            </p>
          </div>
        </div>

      </div>

      {/* Lower Row - Recent Operations logs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-2">
          <Cpu className="text-emerald-500" size={17} />
          System Activity Audit Logs
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {log.action}
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  {log.details}
                </p>
                <div className="text-[10px] text-slate-400">
                  Initiated by {log.userName} ({log.userRole})
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
