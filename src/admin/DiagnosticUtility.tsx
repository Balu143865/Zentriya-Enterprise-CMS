import { useState, useEffect } from 'react';
import { getRawSupabase, db } from '../services/db';
import { 
  Database, RefreshCw, CheckCircle2, XCircle, AlertTriangle, 
  Search, Filter, Info, ChevronRight, Activity, ShieldAlert,
  Server, HardDrive, ListFilter, HelpCircle
} from 'lucide-react';

interface TableMeta {
  tableName: string;
  displayName: string;
  category: 'Core Setup' | 'Home Sections' | 'CMS Content' | 'Corporate Relations' | 'Interactions' | 'SEO & Analytics';
  description: string;
}

const TABLE_REGISTRY: TableMeta[] = [
  { tableName: 'admins', displayName: 'Administrators Registry', category: 'Core Setup', description: 'Governs console access policies and credential mappings.' },
  { tableName: 'website_settings', displayName: 'Global Configuration', category: 'Core Setup', description: 'Stores corporate identity, contact emails, and social pointers.' },
  { tableName: 'hero_slides', displayName: 'Hero Carousel Slides', category: 'Home Sections', description: 'Curates banner images and CTA links on the homepage.' },
  { tableName: 'about_section', displayName: 'About Section Narration', category: 'Home Sections', description: 'Maintains years of experience narrative and banner cover.' },
  { tableName: 'why_choose_us', displayName: 'Value Propositions', category: 'Home Sections', description: 'Controls selling points, institutional credentials, and icons.' },
  { tableName: 'services', displayName: 'Services Portfolio', category: 'CMS Content', description: 'Administers curriculum design and corporate consulting offerings.' },
  { tableName: 'programs', displayName: 'Academic Programs Catalog', category: 'CMS Content', description: 'Maintains career-training syllabi, modes, and image covers.' },
  { tableName: 'placements', displayName: 'Placement Records', category: 'Corporate Relations', description: 'Maintains verified student hiring success records and packages.' },
  { tableName: 'industry_network', displayName: 'Industry Partners Network', category: 'Corporate Relations', description: 'Manages logos and website links of hiring companies.' },
  { tableName: 'testimonials', displayName: 'Success Reviews Feed', category: 'CMS Content', description: 'Curates verified peer, graduate, and corporate reviews.' },
  { tableName: 'team_members', displayName: 'Faculty & Administrative Profiles', category: 'Core Setup', description: 'Coordinates profiles of lecturers, mentors, and directors.' },
  { tableName: 'gallery', displayName: 'Media Assets Gallery', category: 'CMS Content', description: 'Chronicles campus highlights, workshop posters, and videos.' },
  { tableName: 'blogs', displayName: 'Blogs & Articles', category: 'CMS Content', description: 'Oversees dynamic editorial news, categories, and SEO content.' },
  { tableName: 'contact_information', displayName: 'Company Contact Pointers', category: 'Core Setup', description: 'Holds direct email, support desk, and whatsapp details.' },
  { tableName: 'contact_messages', displayName: 'Contact Form Inquiries', category: 'Interactions', description: 'Logs user questions, message status, and follow-up flags.' },
  { tableName: 'courses', displayName: 'Standalone Courses', category: 'CMS Content', description: 'Maintains modular specialized certification guides.' },
  { tableName: 'internships', displayName: 'Career Bootcamp Tracks', category: 'CMS Content', description: 'Coordinates active bootcamps and placement training details.' },
  { tableName: 'faqs', displayName: 'Frequently Asked Questions', category: 'CMS Content', description: 'Governs support widgets and informational Q&As.' },
  { tableName: 'jobs', displayName: 'Job Postings Board', category: 'Interactions', description: 'Lists available recruitment vacancies for trainees.' },
  { tableName: 'applications', displayName: 'Job Candidate Applications', category: 'Interactions', description: 'Houses submitted resumes and application states.' },
  { tableName: 'activity_logs', displayName: 'Audit Activity Logs', category: 'SEO & Analytics', description: 'Chronicles security checkups and critical console edits.' },
  { tableName: 'notifications', displayName: 'Operations Alerts Feed', category: 'Interactions', description: 'Relays operational alerts to administrator sessions.' },
  { tableName: 'articles', displayName: 'Editorial Columns Feed', category: 'CMS Content', description: 'Stores rich text columns with markdown support.' },
  { tableName: 'article_categories', displayName: 'Editorial Categories', category: 'CMS Content', description: 'Groups blogs and articles into organized topics.' },
  { tableName: 'article_statistics', displayName: 'Editorial Metrics Tracker', category: 'SEO & Analytics', description: 'Tallies engagement, view counters, and article shares.' },
  { tableName: 'albums', displayName: 'Media Albums Folders', category: 'CMS Content', description: 'Hosts nested gallery albums for event organization.' },
  { tableName: 'placement_stats', displayName: 'Placement Dashboard Stats', category: 'SEO & Analytics', description: 'Tallies recruitment percentages and annual statistics.' },
  { tableName: 'client_partners', displayName: 'Corporate Client Partners', category: 'Corporate Relations', description: 'Curates enterprise relationships and corporate network.' },
  { tableName: 'downloads', displayName: 'Resource Download Center', category: 'CMS Content', description: 'Exposes student syllabus PDFs and admission brochures.' },
  { tableName: 'student_journey', displayName: 'Student Milestone Milestones', category: 'Home Sections', description: 'Maintains progress steps detailing admission to placement.' }
];

export interface TableCheckState {
  status: 'idle' | 'checking' | 'online' | 'offline';
  count: number | null;
  errorMsg: string | null;
  latencyMs: number | null;
}

export default function DiagnosticUtility() {
  const [tableStates, setTableStates] = useState<Record<string, TableCheckState>>(() => {
    const initial: Record<string, TableCheckState> = {};
    TABLE_REGISTRY.forEach(t => {
      initial[t.tableName] = { status: 'idle', count: null, errorMsg: null, latencyMs: null };
    });
    return initial;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'idle'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [diagnosticsRunCount, setDiagnosticsRunCount] = useState(0);

  // Run health check on a specific table
  const checkSingleTable = async (tableName: string) => {
    setTableStates(prev => ({
      ...prev,
      [tableName]: { ...prev[tableName], status: 'checking', errorMsg: null }
    }));

    const rawClient = getRawSupabase();
    if (!rawClient) {
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          status: 'offline',
          count: null,
          errorMsg: 'Supabase client unavailable. Check environment variables.',
          latencyMs: null
        }
      }));
      return false;
    }

    const startTime = performance.now();
    try {
      // Use exact count query with head check as requested: select('*', {count: 'exact', head: true})
      const { count, error } = await rawClient
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (error) {
        setTableStates(prev => ({
          ...prev,
          [tableName]: {
            status: 'offline',
            count: null,
            errorMsg: `${error.message} (Code: ${error.code || 'N/A'})`,
            latencyMs: latency
          }
        }));
        return false;
      } else {
        setTableStates(prev => ({
          ...prev,
          [tableName]: {
            status: 'online',
            count: count ?? 0,
            errorMsg: null,
            latencyMs: latency
          }
        }));
        return true;
      }
    } catch (err: any) {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setTableStates(prev => ({
        ...prev,
        [tableName]: {
          status: 'offline',
          count: null,
          errorMsg: err.message || 'Unknown network exceptions occurred during polling.',
          latencyMs: latency
        }
      }));
      return false;
    }
  };

  // Run health checks on all tables sequentially/concurrently in batches
  const checkAllTables = async () => {
    if (isRefreshingAll) return;
    setIsRefreshingAll(true);

    const config = db.getDbConfig();
    if (config.useMock) {
      // If mock engine is active, simulate offline statuses after a brief lag
      const mockStates: Record<string, TableCheckState> = {};
      TABLE_REGISTRY.forEach(t => {
        mockStates[t.tableName] = { status: 'checking', count: null, errorMsg: null, latencyMs: null };
      });
      setTableStates(mockStates);

      await new Promise(resolve => setTimeout(resolve, 600));
      
      const resolvedMock: Record<string, TableCheckState> = {};
      TABLE_REGISTRY.forEach((t, i) => {
        // Simulate online/offline depending on table or just offline to help identify config gaps
        resolvedMock[t.tableName] = {
          status: 'offline',
          count: null,
          errorMsg: 'Client bypassed: Force Mock Database option is toggled active.',
          latencyMs: 12 + (i % 5)
        };
      });
      setTableStates(resolvedMock);
      setIsRefreshingAll(false);
      setDiagnosticsRunCount(prev => prev + 1);
      return;
    }

    // Set all to checking
    setTableStates(prev => {
      const updated = { ...prev };
      TABLE_REGISTRY.forEach(t => {
        updated[t.tableName] = { ...t, status: 'checking', count: null, errorMsg: null, latencyMs: null };
      });
      return updated;
    });

    // Run probes concurrently in batches to avoid rate limits
    const batchSize = 6;
    for (let i = 0; i < TABLE_REGISTRY.length; i += batchSize) {
      const batch = TABLE_REGISTRY.slice(i, i + batchSize);
      await Promise.all(batch.map(t => checkSingleTable(t.tableName)));
    }

    setIsRefreshingAll(false);
    setDiagnosticsRunCount(prev => prev + 1);
  };

  // Auto-trigger on initial load
  useEffect(() => {
    checkAllTables();
  }, []);

  // Compute status analytics
  const totalCount = TABLE_REGISTRY.length;
  const onlineCount = (Object.values(tableStates) as TableCheckState[]).filter(s => s.status === 'online').length;
  const offlineCount = (Object.values(tableStates) as TableCheckState[]).filter(s => s.status === 'offline').length;
  const checkingCount = (Object.values(tableStates) as TableCheckState[]).filter(s => s.status === 'checking').length;
  const idleCount = (Object.values(tableStates) as TableCheckState[]).filter(s => s.status === 'idle').length;

  const categories = Array.from(new Set(TABLE_REGISTRY.map(t => t.category)));

  // Filtering tables
  const filteredTables = TABLE_REGISTRY.filter(t => {
    const matchesSearch = t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const state = tableStates[t.tableName];
    const matchesStatus = statusFilter === 'all' || state.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div id="diagnostic-utility-card" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-6 animate-fade-in">
      
      {/* Header and top metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-500 animate-pulse" size={18} />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
              Supabase Modules & Schema Health-Checks
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated probing of every database table schema using <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[10px] text-slate-600 dark:text-slate-300">exact count exact/head</code> select queries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={checkAllTables}
            disabled={isRefreshingAll}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <RefreshCw size={13} className={isRefreshingAll ? 'animate-spin' : ''} />
            {isRefreshingAll ? 'Probing Database...' : 'Probe All Schemas'}
          </button>
        </div>
      </div>

      {/* Quick summary grid widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-850/60 text-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Tables</span>
          <span className="font-mono text-xl font-extrabold text-slate-900 dark:text-white">{totalCount}</span>
        </div>
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 dark:bg-slate-800 border-slate-950 text-white shadow-sm'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block mb-1">Filtered Matches</span>
          <span className="font-mono text-xl font-extrabold block">{filteredTables.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('online')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'online'
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
              : 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block mb-1">Online (Healthy)</span>
          <span className="font-mono text-xl font-extrabold block">{onlineCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('offline')}
          className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'offline'
              ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
              : 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}
        >
          <span className="text-[9px] font-bold uppercase tracking-wider block mb-1">Offline (Gaps)</span>
          <span className="font-mono text-xl font-extrabold block">{offlineCount}</span>
        </button>
        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-850/60 text-center col-span-2 sm:col-span-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">In Progress</span>
          <span className="font-mono text-xl font-extrabold text-blue-500">{checkingCount || idleCount ? (checkingCount + idleCount) : 0}</span>
        </div>
      </div>

      {/* Gap Warning Alerts Banner */}
      {offlineCount > 0 && (
        <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs leading-relaxed flex items-start gap-3 text-red-900 dark:text-red-300">
          <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <span className="font-extrabold text-sm tracking-tight block">Schema configuration gaps detected! ({offlineCount} tables missing)</span>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              The database pipeline resolved successfully, but the marked schemas could not be polled or queried. Ensure they are provisioned inside your Supabase SQL console. Click <HelpCircle className="inline-block text-slate-400 mx-0.5" size={13} /> next to offline tables to see schema descriptions.
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by table name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-2.5 pl-9 pr-4 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-medium transition-all"
          />
        </div>

        {/* Status filter select */}
        <div className="md:col-span-3 flex items-center gap-2">
          <ListFilter size={14} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none font-medium cursor-pointer"
          >
            <option value="all">All Probing Statuses</option>
            <option value="online">Online Modules</option>
            <option value="offline">Offline / Gaps</option>
            <option value="idle">Unchecked (Idle)</option>
          </select>
        </div>

        {/* Category filter select */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl outline-none font-medium cursor-pointer"
          >
            <option value="all">All Category Domains</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table grid display */}
      <div className="max-h-[30rem] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {filteredTables.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 rounded-2xl italic">
            No database modules matched your search queries or filter attributes.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTables.map(t => {
              const state = tableStates[t.tableName];
              
              return (
                <div 
                  key={t.tableName}
                  className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850/60 p-4.5 rounded-2xl flex flex-col justify-between space-y-3.5 hover:border-slate-250 dark:hover:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-all shadow-sm"
                >
                  <div className="space-y-1.5">
                    {/* Module Title & Status Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          {t.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block">
                          ({t.tableName})
                        </span>
                      </div>

                      {/* Diagnostic Badge */}
                      {state.status === 'checking' && (
                        <span className="text-[10px] bg-blue-500/10 text-blue-500 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse border border-blue-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          Testing...
                        </span>
                      )}
                      {state.status === 'online' && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle2 size={11} className="shrink-0" />
                          Online
                        </span>
                      )}
                      {state.status === 'offline' && (
                        <span className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border border-rose-500/20">
                          <XCircle size={11} className="shrink-0" />
                          Offline
                        </span>
                      )}
                      {state.status === 'idle' && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                          Idle (Queued)
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight flex items-center justify-between">
                      <span>{t.displayName}</span>
                      {state.latencyMs !== null && (
                        <span className="font-mono text-[9px] text-slate-400 font-normal">
                          {state.latencyMs}ms
                        </span>
                      )}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {/* Actions & Report details */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-850 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Records count:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                        {state.status === 'online' && state.count !== null ? state.count : state.status === 'offline' ? 'Err' : '—'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {state.errorMsg && (
                        <div className="group relative">
                          <button
                            type="button"
                            className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-help"
                            title={state.errorMsg}
                          >
                            <Info size={14} />
                          </button>
                          <div className="pointer-events-none opacity-0 group-hover:opacity-100 absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white rounded-xl text-[10px] shadow-xl leading-relaxed transition-opacity z-10 border border-slate-800">
                            <span className="font-bold text-rose-400 block mb-1">Query Exception:</span>
                            {state.errorMsg}
                          </div>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => checkSingleTable(t.tableName)}
                        disabled={state.status === 'checking'}
                        className="text-[10px] hover:text-emerald-500 font-bold hover:bg-white dark:hover:bg-slate-900 px-2.5 py-1 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all cursor-pointer shrink-0"
                      >
                        {state.status === 'checking' ? 'Probing...' : 'Re-probe'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
