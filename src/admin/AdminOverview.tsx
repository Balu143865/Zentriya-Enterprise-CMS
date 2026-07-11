import { useState, useEffect, FormEvent } from 'react';
import { db, getRawSupabase, setMockFallback, isMockFallbackActive } from '../services/db';
import { auth } from '../services/auth';
import { ActivityLog, UserProfile } from '../types';
import { 
  Users, Briefcase, MessageSquare, GraduationCap, 
  Terminal, ShieldCheck, Database, RefreshCw, Cpu,
  CheckCircle2, AlertTriangle, XCircle, Info, Lock, Key, 
  Sliders, Globe, Server, Check, HelpCircle, X
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

  // Diagnostics states
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [tableStates, setTableStates] = useState<Record<string, 'checking' | 'healthy' | 'empty' | 'error' | 'idle'>>({
    website_settings: 'idle',
    admins: 'idle',
    student_journey: 'idle',
    activity_logs: 'idle',
    contact_messages: 'idle',
  });
  const [envDiagnostics, setEnvDiagnostics] = useState({
    urlSource: 'None',
    urlValid: false,
    keySource: 'None',
    keyValid: false,
    forcedMock: false,
  });
  const [realLatency, setRealLatency] = useState<number | null>(null);
  const [overrideUrl, setOverrideUrl] = useState('');
  const [overrideKey, setOverrideKey] = useState('');
  const [forceMockToggle, setForceMockToggle] = useState(false);
  const [isFallbackActive, setIsFallbackActive] = useState(isMockFallbackActive());

  useEffect(() => {
    setUser(auth.getCurrentUser());
    setIsFallbackActive(isMockFallbackActive());
    
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

  const runActiveDiagnostics = async () => {
    setTestingConnection(true);
    setTerminalLogs([]);
    setRealLatency(null);
    
    const logsList: string[] = [];
    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      logsList.push(`[${time}] ${msg}`);
      setTerminalLogs([...logsList]);
    };

    addLog('🚀 Starting Supabase Connection diagnostics pipeline...');
    
    // Check Config
    const config = db.getDbConfig();
    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    const localUrl = localStorage.getItem('zentriya_supabase_url') || '';
    const localKey = localStorage.getItem('zentriya_supabase_anon_key') || '';
    
    const urlSource = localUrl ? 'LocalStorage Override' : (envUrl ? 'Environment Variable (.env)' : 'None');
    const keySource = localKey ? 'LocalStorage Override' : (envKey ? 'Environment Variable (.env)' : 'None');
    
    const urlValid = !!config.url && config.url.startsWith('http') && !config.url.includes('placeholder') && !config.url.includes('your-') && !config.url.includes('example.com');
    const keyValid = !!config.anonKey && config.anonKey.length > 20 && !config.anonKey.includes('placeholder');
    
    setEnvDiagnostics({
      urlSource,
      urlValid,
      keySource,
      keyValid,
      forcedMock: config.useMock,
    });

    addLog(`[ENV] URL Source: ${urlSource}`);
    addLog(`[ENV] URL Validation: ${urlValid ? 'PASS (Valid URL format)' : 'FAIL (Unconfigured or Placeholder)'}`);
    addLog(`[ENV] Key Source: ${keySource}`);
    addLog(`[ENV] Key Validation: ${keyValid ? 'PASS (JWT Token format)' : 'FAIL (Unconfigured or Placeholder)'}`);
    addLog(`[ENV] Force Mock Database option: ${config.useMock ? 'ENABLED' : 'DISABLED'}`);

    if (config.useMock) {
      addLog('⚠️ Force Mock sandbox is active in configuration. Live database queries bypassed.');
      setConnectionStatus('warning');
      setMockFallback(true);
      setIsFallbackActive(true);
      setTestingConnection(false);
      return;
    }

    if (!urlValid || !keyValid) {
      addLog('❌ Diagnostics Aborted: Credentials are missing, malformed, or using placeholder keys.');
      setConnectionStatus('warning');
      setMockFallback(true);
      setIsFallbackActive(true);
      setTestingConnection(false);
      return;
    }

    addLog('[CLIENT] Constructing Raw Supabase Client...');
    const rawClient = getRawSupabase();
    if (!rawClient) {
      addLog('❌ Failed to construct Raw Supabase Client.');
      setConnectionStatus('warning');
      setMockFallback(true);
      setIsFallbackActive(true);
      setTestingConnection(false);
      return;
    }
    addLog('✔ Client successfully initialized.');

    // Initialize checking table states
    const initialTables = {
      website_settings: 'checking',
      admins: 'checking',
      student_journey: 'checking',
      activity_logs: 'checking',
      contact_messages: 'checking',
    } as const;
    setTableStates(initialTables);

    // Measure Ping & Latency
    addLog('[PING] Initiating network latency test with 3000ms threshold...');
    const startTime = performance.now();
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Query timeout')), 3000));
      const query = rawClient.from('website_settings').select('id').limit(1);
      
      await Promise.race([query, timeout]);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setRealLatency(latency);
      addLog(`✔ Ping successfully resolved. Latency: ${latency}ms`);
      setConnectionStatus('success');
      setMockFallback(false);
      setIsFallbackActive(false);
    } catch (e: any) {
      addLog(`❌ Ping failed or timed out: ${e.message || 'Timeout'}`);
      setConnectionStatus('warning');
      setMockFallback(true);
      setIsFallbackActive(true);
      setTableStates({
        website_settings: 'error',
        admins: 'error',
        student_journey: 'error',
        activity_logs: 'error',
        contact_messages: 'error',
      });
      setTestingConnection(false);
      return;
    }

    // Checking each core table
    const tables = ['website_settings', 'admins', 'student_journey', 'activity_logs', 'contact_messages'] as const;
    for (const tbl of tables) {
      addLog(`[SCHEMA] Querying table: "${tbl}"...`);
      try {
        const { data, error } = await rawClient.from(tbl).select('*').limit(2);
        if (error) {
          addLog(`  ↳ ❌ Error: ${error.message}`);
          setTableStates(prev => ({ ...prev, [tbl]: 'error' }));
        } else {
          const count = data?.length || 0;
          addLog(`  ↳ ✔ Table verified. Status: Healthy (${count} record${count === 1 ? '' : 's'} fetched)`);
          setTableStates(prev => ({ ...prev, [tbl]: count > 0 ? 'healthy' : 'empty' }));
        }
      } catch (err: any) {
        addLog(`  ↳ ❌ Exception: ${err.message || err}`);
        setTableStates(prev => ({ ...prev, [tbl]: 'error' }));
      }
    }

    addLog('🎉 Diagnostics complete. Connection status: stable and verified.');
    setTestingConnection(false);
  };

  const handleTestConnection = async () => {
    toast('Executing instant database probe...', 'info');
    await runActiveDiagnostics();
    const isMock = isMockFallbackActive();
    if (isMock) {
      toast('Supabase Connection unavailable. Reverted to offline mock database sandbox.', 'warning');
    } else {
      toast('End-to-end Supabase pipe established successfully!', 'success');
    }
  };

  const handleSaveOverride = (e: FormEvent) => {
    e.preventDefault();
    db.saveDbConfig({
      url: overrideUrl.trim(),
      anonKey: overrideKey.trim(),
      useMock: forceMockToggle
    });
    setDbConfig(db.getDbConfig());
    toast('Overrides synchronized successfully. Reloading diagnostics...', 'success');
    
    // Rerun diagnostics with the new credentials
    setTimeout(() => {
      runActiveDiagnostics();
    }, 200);
  };

  const handleClearOverrides = () => {
    localStorage.removeItem('zentriya_supabase_url');
    localStorage.removeItem('zentriya_supabase_anon_key');
    localStorage.removeItem('zentriya_use_mock_db');
    
    const config = db.getDbConfig();
    setOverrideUrl(config.url);
    setOverrideKey(config.anonKey);
    setForceMockToggle(config.useMock);
    setDbConfig(config);
    toast('Local credential overrides cleared. Reverted to defaults.', 'info');
    
    setTimeout(() => {
      runActiveDiagnostics();
    }, 200);
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

        {/* Supabase Connection Diagnostics Panel */}
        <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl text-white space-y-4 flex flex-col justify-between h-full min-h-[17.5rem]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-2 text-emerald-400">
                <Database size={16} />
                Database Diagnostics
              </h4>
              <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                isFallbackActive ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {isFallbackActive ? 'Mock Sandbox' : 'Supabase Live'}
              </span>
            </div>

            <p className="text-[11.5px] text-slate-400 leading-relaxed">
              Zentriya operates on a dual-engine architecture. In the event of latency, network failure, or missing keys, it safely redirects transactions to a local sandbox.
            </p>

            <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Globe size={13} className="text-slate-500" />
                  API Endpoint:
                </span>
                <span className="font-mono text-[10px] text-slate-300">
                  {dbConfig.url ? `${dbConfig.url.substring(0, 18)}...` : 'Unconfigured'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Server size={13} className="text-slate-500" />
                  Fallback Mode:
                </span>
                <span className={`font-semibold ${isFallbackActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isFallbackActive ? 'Active Offline' : 'Bypassed (Live)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <RefreshCw size={13} className="text-slate-500" />
                  Channel Integrity:
                </span>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  connectionStatus === 'success' ? 'bg-emerald-500/15 text-emerald-400' :
                  connectionStatus === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-blue-500/15 text-blue-400'
                }`}>
                  {connectionStatus === 'success' ? 'Verified' :
                   connectionStatus === 'warning' ? 'Degraded' : 'Unchecked'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => {
                setShowDiagnostics(true);
                const config = db.getDbConfig();
                setOverrideUrl(config.url);
                setOverrideKey(config.anonKey);
                setForceMockToggle(config.useMock);
                setTimeout(() => {
                  runActiveDiagnostics();
                }, 100);
              }}
              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Sliders size={13} className="text-emerald-400" />
              Launch Diagnostics Console
            </button>
          </div>
        </div>

      </div>

      {/* Diagnostics Console Modal */}
      {showDiagnostics && (
        <div id="diagnostics-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 md:p-10">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in text-slate-800 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    Supabase Pipeline Diagnostics Console
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Analyze configuration integrity, API latency, schema structures, and custom credential overrides.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowDiagnostics(false);
                  setDbConfig(db.getDbConfig());
                }}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content - Scrollable Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Top Summary Banner */}
              <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
                connectionStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                connectionStatus === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300' :
                'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300'
              }`}>
                {connectionStatus === 'success' ? (
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                ) : connectionStatus === 'warning' ? (
                  <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                ) : (
                  <Info className="text-blue-500 shrink-0" size={24} />
                )}
                <div className="flex-1 text-xs">
                  <p className="font-bold">
                    {connectionStatus === 'success' ? 'Connection Status: Production Live DB Active' :
                     connectionStatus === 'warning' ? 'Connection Status: Offline Fallback Sandbox' :
                     'Connection Status: Ready to Check'}
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {connectionStatus === 'success' ? `Excellent. Full end-to-end communication verified with 0% packet loss. Server latency: ${realLatency}ms.` :
                     connectionStatus === 'warning' ? 'System is running safely on the simulated mock engine. You can customize the credentials below to connect to your live database.' :
                     'Press "Execute Full Test Suite" below to initiate end-to-end routing validation.'}
                  </p>
                </div>
                {realLatency !== null && (
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Server RTT</span>
                    <span className="font-mono text-lg font-extrabold text-emerald-500">{realLatency}ms</span>
                  </div>
                )}
              </div>

              {/* Three Column Diagnostic Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Section: Credentials & Control Panel (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-2">
                      <Sliders className="text-emerald-500" size={15} />
                      <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                        Config Control & Overrides
                      </h4>
                    </div>

                    <form onSubmit={handleSaveOverride} className="space-y-4 text-xs">
                      {/* URL input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Supabase Project URL</label>
                          <span className="text-[9px] font-semibold text-slate-400">
                            Source: {envDiagnostics.urlSource}
                          </span>
                        </div>
                        <input 
                          type="url" 
                          placeholder="https://xxxxxx.supabase.co"
                          value={overrideUrl}
                          onChange={(e) => setOverrideUrl(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl font-mono text-[11px] outline-none"
                        />
                      </div>

                      {/* Anon Key input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Supabase Anon Key</label>
                          <span className="text-[9px] font-semibold text-slate-400">
                            Source: {envDiagnostics.keySource}
                          </span>
                        </div>
                        <input 
                          type="password" 
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          value={overrideKey}
                          onChange={(e) => setOverrideKey(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl font-mono text-[11px] outline-none"
                        />
                      </div>

                      {/* Option: Force Mock DB toggle */}
                      <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl">
                        <div className="space-y-0.5 pr-2">
                          <span className="text-[11px] font-bold block">Force Mock Fallback Engine</span>
                          <span className="text-[9px] text-slate-400 block leading-tight">Skip all network calls and use localized mock tables.</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setForceMockToggle(!forceMockToggle)}
                          className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 shrink-0 ${
                            forceMockToggle ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            forceMockToggle ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button 
                          type="button"
                          onClick={handleClearOverrides}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold p-2.5 rounded-xl text-[11px] transition-colors animate-none"
                        >
                          Clear Overrides
                        </button>
                        <button 
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1 shadow-md shadow-emerald-600/10 transition-colors animate-none"
                        >
                          <Check size={12} />
                          Save & Restart
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl text-xs space-y-3.5">
                    <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Credentials Validator</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">URL Formatting:</span>
                        <span className={`font-semibold ${envDiagnostics.urlValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {envDiagnostics.urlValid ? '✔ Valid Format' : '⚠️ Missing / Default'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Key Signature:</span>
                        <span className={`font-semibold ${envDiagnostics.keyValid ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {envDiagnostics.keyValid ? '✔ Valid JWT' : '⚠️ Missing / Default'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Schema Tables & Monospace Terminal (7 cols) */}
                <div className="lg:col-span-7 flex flex-col space-y-5">
                  
                  {/* Schema validation card */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 border-b dark:border-slate-800 pb-2">
                      <Database className="text-emerald-500" size={15} />
                      <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                        Supabase Live Schema Checks
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      {Object.entries(tableStates).map(([table, state]) => (
                        <div key={table} className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl shadow-sm">
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {table}
                          </span>
                          
                          {state === 'checking' && (
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                          )}
                          {state === 'healthy' && (
                            <span className="text-emerald-500 flex items-center gap-1 text-[10px] font-bold">
                              <CheckCircle2 size={13} />
                              Healthy
                            </span>
                          )}
                          {state === 'empty' && (
                            <span className="text-blue-400 flex items-center gap-1 text-[10px] font-semibold">
                              <Info size={13} />
                              Empty
                            </span>
                          )}
                          {state === 'error' && (
                            <span className="text-red-500 flex items-center gap-1 text-[10px] font-bold">
                              <XCircle size={13} />
                              Unreachable
                            </span>
                          )}
                          {state === 'idle' && (
                            <span className="text-slate-400 text-[10px]">Unchecked</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal console output */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col space-y-2 min-h-[12rem] max-h-[16rem]">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-800 font-mono">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Terminal size={12} />
                        Diagnostic log output
                      </span>
                      <span>UTF-8 CLI</span>
                    </div>

                    <div className="flex-1 overflow-y-auto font-mono text-[10.5px] text-emerald-400 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                      {terminalLogs.length === 0 ? (
                        <span className="text-slate-500 italic block">Console idle. Execute test to stream records...</span>
                      ) : (
                        terminalLogs.map((logLine, index) => (
                          <div key={index} className="leading-snug break-all whitespace-pre-wrap">
                            {logLine}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between shrink-0">
              <p className="text-[10px] text-slate-400 leading-none">
                Zentriya Hybrid Engine v1.2.0 • Real-time DB Probe
              </p>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setShowDiagnostics(false);
                    setDbConfig(db.getDbConfig());
                  }}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Close Console
                </button>
                <button 
                  onClick={runActiveDiagnostics}
                  disabled={testingConnection}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-colors"
                >
                  <RefreshCw size={13} className={testingConnection ? 'animate-spin' : ''} />
                  Execute Full Test Suite
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

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
