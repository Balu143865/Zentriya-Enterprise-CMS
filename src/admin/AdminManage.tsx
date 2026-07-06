import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../services/db';
import GenericCMS, { CMSField } from '../components/GenericCMS';
import { auth } from '../services/auth';
import LucideIcon from '../components/LucideIcon';
import { uploadFileToSupabase } from '../lib/supabase';
import { 
  WebsiteSettings, HeroSlide, AboutSection, ServiceItem, 
  InternshipProgram, CourseItem, GalleryItem, 
  TeamMember, TestimonialItem, JobListing, JobApplication, 
  ContactMessage, BlogPost, FaqItem, WhyChooseUsItem,
  StudentJourneyStep, IndustryPartner, Placement,
  Article, ArticleCategory, ArticleStatistic, ProgramItem
} from '../types';
import { 
  Save, Plus, Trash, Edit, Check, Settings, Image, 
  FileText, Layers, GraduationCap, Users, MessageSquare, Briefcase, 
  HelpCircle, ShieldAlert, RefreshCw, Star, ArrowUpRight,
  ExternalLink, Globe, Search, Filter, ChevronLeft, ChevronRight, Eye, X, Send, PlayCircle, PlusCircle,
  ArrowUp, ArrowDown, GripVertical
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { renderPartnerLogo } from '../utils/partnerLogos';
import CompanyLogo from '../components/CompanyLogo';

// REUSABLE BASE64 IMAGE DROPZONE COMPONENT
interface ImageDropzoneProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

function ImageDropzone({ value, onChange, label = "Upload Image" }: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }
    setIsUploading(true);
    try {
      const publicUrl = await uploadFileToSupabase(file);
      onChange(publicUrl);
    } catch (err) {
      console.warn('Supabase storage upload failed, falling back to local base64:', err);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">{label}</label>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
          isUploading
            ? 'border-emerald-400 bg-slate-50 dark:bg-slate-900 animate-pulse'
            : isDragActive 
              ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950/40'
        }`}
        onClick={() => {
          if (isUploading) return;
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
              handleFile(target.files[0]);
            }
          };
          input.click();
        }}
      >
        {isUploading ? (
          <div className="py-4 space-y-1">
            <RefreshCw className="mx-auto text-emerald-500 animate-spin mb-1" size={24} />
            <div className="text-emerald-500 font-bold text-xs">Uploading to Storage...</div>
            <div className="text-[10px] text-slate-400">Please wait while the image is saved in real time.</div>
          </div>
        ) : value ? (
          <div className="space-y-3">
            <img 
              src={value} 
              alt="Preview" 
              className="h-28 w-auto object-contain mx-auto rounded-xl shadow-md border dark:border-slate-800" 
              referrerPolicy="no-referrer"
            />
            <p className="text-[10px] text-emerald-500 font-semibold">Image loaded successfully. Click or drag to replace.</p>
          </div>
        ) : (
          <div className="py-4 space-y-1">
            <Image className="mx-auto text-slate-400 mb-1" size={24} />
            <div className="text-emerald-500 font-bold text-xs">Drag & Drop Image file</div>
            <div className="text-[10px] text-slate-400">or click to browse from device</div>
          </div>
        )}
      </div>

      {value && !isUploading && (
        <button 
          type="button"
          onClick={() => onChange('')}
          className="text-red-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1"
        >
          <Trash size={12} />
          Remove Image
        </button>
      )}
    </div>
  );
}

export default function AdminManage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'settings';
  const { toast } = useToast();
  
  const [user] = useState(() => auth.getCurrentUser());
  const hasPermission = user?.role === 'OWNER';

  // Owner System Utilities state
  const [newPassword, setNewPassword] = useState('');
  const [mfaActive, setMfaActive] = useState(() => localStorage.getItem('zentriya_owner_mfa') === 'true');

  const handleBackup = () => {
    try {
      const data = db.backupData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zentriya-owner-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Database backup archive compiled and downloaded successfully.', 'success');
    } catch (e: any) {
      toast('Failed to compile database backup.', 'error');
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const ok = db.restoreData(parsed);
        if (ok) {
          toast('Database restored successfully! Reloading configuration context...', 'success');
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (err: any) {
        toast(err.message || 'Malformed backup file format. Restore aborted.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast('Security password must contain at least 6 characters.', 'warning');
      return;
    }
    try {
      await auth.changePassword(newPassword);
      setNewPassword('');
      toast('Security credentials updated successfully.', 'success');
    } catch (err: any) {
      toast(err.message || 'Failed to update credentials.', 'error');
    }
  };

  const handleToggleMfa = () => {
    const nextState = !mfaActive;
    setMfaActive(nextState);
    localStorage.setItem('zentriya_owner_mfa', nextState ? 'true' : 'false');
    toast(`Two-Factor Authentication is now ${nextState ? 'ENABLED' : 'DISABLED'}.`, nextState ? 'success' : 'info');
  };

  // Connection config
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [useMockDb, setUseMockDb] = useState(false);

  // Data states
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [internships, setInternships] = useState<InternshipProgram[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>([]);
  const [studentJourneySteps, setStudentJourneySteps] = useState<StudentJourneyStep[]>([]);
  const [industryPartners, setIndustryPartners] = useState<IndustryPartner[]>([]);
  const [adminPlacements, setAdminPlacements] = useState<Placement[]>([]);
  const [adminArticles, setAdminArticles] = useState<Article[]>([]);
  const [adminCategories, setAdminCategories] = useState<ArticleCategory[]>([]);
  const [adminStats, setAdminStats] = useState<ArticleStatistic[]>([]);
  const [selectedCmsTable, setSelectedCmsTable] = useState('hero');

  // Search, Filter, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Active forms / modal tracker
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingDetailsItem, setViewingDetailsItem] = useState<any | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [uploadedFaviconUrl, setUploadedFaviconUrl] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
  const [draggedServiceIndex, setDraggedServiceIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  // Reload specific tab data
  const loadData = async () => {
    setLoading(true);
    try {
      const config = db.getDbConfig();
      setSupabaseUrl(config.url);
      setSupabaseAnonKey(config.anonKey);
      setUseMockDb(config.useMock);

      switch (activeTab) {
        case 'settings':
          const setRes = await db.getSettings();
          setSettings(setRes);
          setUploadedImageUrl(setRes.logoUrl);
          setUploadedFaviconUrl(setRes.faviconUrl);
          break;
        case 'hero':
          setHeroSlides(await db.getHeroSlides());
          break;
        case 'about':
          setAbout(await db.getAbout());
          break;
        case 'services':
          setServices(await db.getServices());
          break;
        case 'internships':
          setInternships(await db.getInternships());
          break;
        case 'courses':
          setCourses(await db.getCourses());
          break;
        case 'programs':
          setPrograms(await db.getPrograms());
          break;
        case 'gallery':
          setGalleryItems(await db.getGalleryItems());
          break;
        case 'team':
          setTeam(await db.getTeam());
          break;
        case 'testimonials':
          setTestimonials(await db.getTestimonials());
          break;
        case 'blogs':
          setBlogs(await db.getBlogs());
          break;
        case 'articles':
          setAdminArticles(await db.getArticles());
          setAdminCategories(await db.getArticleCategories());
          setAdminStats(await db.getArticleStatistics());
          break;
        case 'careers':
          setJobs(await db.getJobs());
          break;
        case 'applications':
          setApplications(await db.getApplications());
          break;
        case 'contacts':
          setMessages(await db.getContactMessages());
          break;
        case 'faqs':
          setFaqs(await db.getFaqs());
          break;
        case 'why_choose_us':
          setWhyChooseUs(await db.getWhyChooseUs());
          break;
        case 'student_journey':
          setStudentJourneySteps(await db.getStudentJourneySteps());
          break;
        case 'industry_network':
          setIndustryPartners(await db.getIndustryPartners());
          break;
        case 'placements':
          setAdminPlacements(await db.getPlacements());
          break;
        case 'live_cms':
          break;
        default:
          break;
      }
    } catch (err) {
      toast('Failed to load database content.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderCourse = async (courseId: string, direction: 'up' | 'down') => {
    const currentIndex = courses.findIndex(c => c.id === courseId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= courses.length) return;

    const updatedList = [...courses];
    updatedList.forEach((item, index) => {
      item.order = index;
    });

    const temp = updatedList[currentIndex].order;
    updatedList[currentIndex].order = updatedList[targetIndex].order;
    updatedList[targetIndex].order = temp;

    updatedList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    await db.saveCourses(updatedList);
    toast('Course order sequence updated.', 'success');
    loadData();
  };

  const handleReorderProgram = async (programId: string, direction: 'up' | 'down') => {
    const currentIndex = programs.findIndex(p => p.id === programId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= programs.length) return;

    const updatedList = [...programs];
    updatedList.forEach((item, index) => {
      item.display_order = index;
    });

    const temp = updatedList[currentIndex].display_order;
    updatedList[currentIndex].display_order = updatedList[targetIndex].display_order;
    updatedList[targetIndex].display_order = temp;

    updatedList.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    await db.savePrograms(updatedList);
    toast('Program order sequence updated.', 'success');
    loadData();
  };

  const handleReorderInternship = async (internId: string, direction: 'up' | 'down') => {
    const currentIndex = internships.findIndex(i => i.id === internId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= internships.length) return;

    const updatedList = [...internships];
    updatedList.forEach((item, index) => {
      item.order = index;
    });

    const temp = updatedList[currentIndex].order;
    updatedList[currentIndex].order = updatedList[targetIndex].order;
    updatedList[targetIndex].order = temp;

    updatedList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    await db.saveInternships(updatedList);
    toast('Internship program order sequence updated.', 'success');
    loadData();
  };

  const handleReorderPlacement = async (placementId: string, direction: 'up' | 'down') => {
    const currentIndex = adminPlacements.findIndex(p => p.id === placementId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= adminPlacements.length) return;

    const updatedList = [...adminPlacements].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const currentIdxInSorted = updatedList.findIndex(p => p.id === placementId);
    const targetIdxInSorted = direction === 'up' ? currentIdxInSorted - 1 : currentIdxInSorted + 1;
    if (targetIdxInSorted < 0 || targetIdxInSorted >= updatedList.length) return;

    const tempOrder = updatedList[currentIdxInSorted].display_order;
    updatedList[currentIdxInSorted].display_order = updatedList[targetIdxInSorted].display_order;
    updatedList[targetIdxInSorted].display_order = tempOrder;

    await db.reorderPlacements(updatedList);
    toast('Placement record display order updated.', 'success');
    loadData();
  };

  const handleReorderArticle = async (articleId: string, direction: 'up' | 'down') => {
    const currentIndex = adminArticles.findIndex(a => a.id === articleId);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= adminArticles.length) return;

    const updatedList = [...adminArticles].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const currentIdxInSorted = updatedList.findIndex(a => a.id === articleId);
    const targetIdxInSorted = direction === 'up' ? currentIdxInSorted - 1 : currentIdxInSorted + 1;
    if (targetIdxInSorted < 0 || targetIdxInSorted >= updatedList.length) return;

    const tempOrder = updatedList[currentIdxInSorted].display_order;
    updatedList[currentIdxInSorted].display_order = updatedList[targetIdxInSorted].display_order;
    updatedList[targetIdxInSorted].display_order = tempOrder;

    await db.saveArticlesOrder(updatedList);
    toast('Article display order sequence updated.', 'success');
    loadData();
  };

  useEffect(() => {
    setSearchQuery('');
    setFilterCategory('All');
    setCurrentPage(1);
    setIsCreating(false);
    setEditingItem(null);
    setViewingDetailsItem(null);
    setUploadedImageUrl('');
    loadData();
  }, [activeTab]);

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveDbConfig({
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      useMock: useMockDb
    });
    toast('Dynamic credentials synchronized. Session reloading...', 'success');
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setEditingItem(null);
    setUploadedImageUrl('');
  };

  if (!hasPermission) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-xl">
        <ShieldAlert className="text-red-500 mx-auto" size={48} />
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Access Restricted</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your active administrative clearance level (<span className="font-bold text-red-500">{user?.role}</span>) does not possess authority to modify the <span className="font-bold">{activeTab}</span> config files.
        </p>
      </div>
    );
  }

  // PAGINATION AND SEARCH UTILITIES
  const paginate = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
            <Settings className="text-emerald-500" size={24} />
            {activeTab.replace(/([A-Z])/g, ' $1')} Management Panel
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Supervise real-time records and customize features instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
            title="Force synchronization check"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-24 text-center rounded-3xl shadow-md">
          <RefreshCw className="animate-spin text-emerald-500 mx-auto mb-3" size={32} />
          <p className="text-sm text-slate-600 dark:text-slate-300 font-bold">Querying live database records...</p>
          <p className="text-xs text-slate-400 mt-1">Establishing high-integrity Supabase endpoints connection</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* =========================================================================
              TAB: UNIVERSAL SUPABASE LIVE CMS
              ========================================================================= */}
          {activeTab === 'live_cms' && (() => {
            const cmsTablesConfig: Record<string, {
              title: string;
              description: string;
              gridDisplay?: boolean;
              searchField?: string;
              orderByField?: string;
              orderAscending?: boolean;
              fields: CMSField[];
            }> = {
              hero: {
                title: "Hero Slides",
                description: "Manage high-impact homepage slider assets and messaging.",
                orderByField: "order",
                orderAscending: true,
                fields: [
                  { name: 'title', label: 'Slide Title', type: 'text', required: true },
                  { name: 'subtitle', label: 'Slide Subtitle', type: 'text', required: true },
                  { name: 'imageUrl', label: 'Slide Cover Image', type: 'image', required: true },
                  { name: 'order', label: 'Display Order Sequence', type: 'number', required: true, defaultValue: 1 }
                ]
              },
              about: {
                title: "About Us",
                description: "Configure corporate vision statement details and values.",
                fields: [
                  { name: 'title', label: 'Heading Title', type: 'text', required: true },
                  { name: 'subtitle', label: 'Sub-heading Caption', type: 'text', required: true },
                  { name: 'description', label: 'Full Narrative', type: 'textarea', required: true },
                  { name: 'imageUrl', label: 'Action Image', type: 'image', required: true },
                  { name: 'experienceYears', label: 'Years of Experience', type: 'number', required: true, defaultValue: 10 }
                ]
              },
              why_choose_us: {
                title: "Why Choose Us",
                description: "Edit unique selling points and institutional capabilities.",
                orderByField: "order",
                orderAscending: true,
                fields: [
                  { name: 'title', label: 'Feature Title', type: 'text', required: true },
                  { name: 'description', label: 'Detailed Explanation', type: 'textarea', required: true },
                  { name: 'icon', label: 'Lucide Icon Name', type: 'text', required: true, placeholder: "e.g. Award, Shield, Users" },
                  { name: 'order', label: 'Display Order', type: 'number', required: true, defaultValue: 1 }
                ]
              },
              services: {
                title: "Services Portfolio",
                description: "Administer consulting and engineering service offerings.",
                orderByField: "order",
                orderAscending: true,
                fields: [
                  { name: 'title', label: 'Service Heading', type: 'text', required: true },
                  { name: 'description', label: 'Service Description Summary', type: 'textarea', required: true },
                  { name: 'icon', label: 'Lucide Icon Name', type: 'text', required: true, placeholder: "e.g. Layers, Code, Settings" },
                  { name: 'isActive', label: 'Service Is Active', type: 'boolean', required: true, defaultValue: true },
                  { name: 'order', label: 'Display Order Sequence', type: 'number', required: true, defaultValue: 1 }
                ]
              },
              programs: {
                title: "Academic Programs",
                description: "Publish career training and skill bootcamp programs.",
                fields: [
                  { name: 'title', label: 'Program Name', type: 'text', required: true },
                  { name: 'subtitle', label: 'Short Hook Subtitle', type: 'text', required: true },
                  { name: 'description', label: 'Course Curriculum Description', type: 'textarea', required: true },
                  { name: 'cover_image', label: 'Curriculum Cover Photo', type: 'image', required: true },
                  { name: 'duration', label: 'Track Duration', type: 'text', required: true, placeholder: "e.g. 6 Months, 1 Year" },
                  { name: 'badges', label: 'Marketing Badges (Comma Separated)', type: 'tags', required: true, placeholder: "Live Projects, Mentor Support" }
                ]
              },
              placements: {
                title: "Student Placements",
                description: "Celebrate graduate records and hire success statistics.",
                orderByField: "display_order",
                orderAscending: true,
                fields: [
                  { name: 'student_name', label: 'Student Full Name', type: 'text', required: true },
                  { name: 'company', label: 'Hiring Company Corporate Name', type: 'text', required: true },
                  { name: 'role', label: 'Job Profile Title Offered', type: 'text', required: true },
                  { name: 'package_details', label: 'Salary Package Tier (LPA)', type: 'text', required: true, placeholder: "e.g. 14 LPA, 8.5 LPA" },
                  { name: 'photo', label: 'Graduate Professional Portrait', type: 'image', required: true },
                  { name: 'display_order', label: 'Display Order Score', type: 'number', required: true, defaultValue: 1 }
                ]
              },
              industry_partners: {
                title: "Industry Partners",
                description: "Manage client logos and corporate hiring network.",
                orderByField: "display_order",
                orderAscending: true,
                fields: [
                  { name: 'name', label: 'Company Brand Name', type: 'text', required: true },
                  { name: 'logo', label: 'Company Logo Graphic', type: 'image', required: true },
                  { name: 'display_order', label: 'Display Order Sequence', type: 'number', required: true, defaultValue: 1 }
                ]
              },
              testimonials: {
                title: "Testimonials Feed",
                description: "Manage peer feedback, student success and review quotes.",
                fields: [
                  { name: 'name', label: 'Reviewer Name', type: 'text', required: true },
                  { name: 'role', label: 'Reviewer Job Title', type: 'text', required: true },
                  { name: 'company', label: 'Employer / University', type: 'text', required: true },
                  { name: 'content', label: 'Testimonial Content Statement', type: 'textarea', required: true },
                  { name: 'avatarUrl', label: 'Professional Avatar URL', type: 'image', required: true },
                  { name: 'rating', label: 'Star Rating Index (1-5)', type: 'number', required: true, defaultValue: 5 }
                ]
              },
              team: {
                title: "Team Members",
                description: "Manage corporate profiles of teachers and administrators.",
                fields: [
                  { name: 'name', label: 'Member Name', type: 'text', required: true },
                  { name: 'role', label: 'Designation Role', type: 'text', required: true },
                  { name: 'department', label: 'Division / Department', type: 'text', required: true, placeholder: "e.g. Technology, Admissions, Operations" },
                  { name: 'photoUrl', label: 'Member Headshot Photo', type: 'image', required: true },
                  { name: 'bio', label: 'Short Personal Description', type: 'textarea', required: true }
                ]
              },
              gallery: {
                title: "Media Gallery",
                description: "Curate event highlights and academic camp posters.",
                fields: [
                  { name: 'title', label: 'Media Display Name', type: 'text', required: true },
                  { name: 'url', label: 'Static Photo Asset', type: 'image', required: true },
                  { name: 'type', label: 'Asset Content Type', type: 'select', required: true, options: [{ label: 'Image', value: 'image' }, { label: 'Video', value: 'video' }], defaultValue: 'image' },
                  { name: 'category', label: 'Gallery Division Group', type: 'text', required: true, placeholder: "e.g. Workshops, Awards, Campus" }
                ]
              },
              blogs: {
                title: "Blog Posts",
                description: "Oversee company news columns and dynamic content feeds.",
                fields: [
                  { name: 'title', label: 'Article Headline', type: 'text', required: true },
                  { name: 'excerpt', label: 'Short Lead Intro Description', type: 'text', required: true },
                  { name: 'content', label: 'Full Blog Post content Markdown', type: 'textarea', required: true },
                  { name: 'cover_image', label: 'Article Main Banner Image', type: 'image', required: true },
                  { name: 'author', label: 'Author Full Name', type: 'text', required: true },
                  { name: 'category', label: 'Blog Topic Category', type: 'text', required: true, placeholder: "e.g. Careers, Technology, Placement" },
                  { name: 'published', label: 'Publish Article Online', type: 'boolean', required: true, defaultValue: true }
                ]
              },
              contacts: {
                title: "Contact Messages",
                description: "Review public contact queries and feedback submissions.",
                fields: [
                  { name: 'name', label: 'Sender Full Name', type: 'text', required: true },
                  { name: 'email', label: 'Sender Email Address', type: 'text', required: true },
                  { name: 'phone', label: 'Sender Phone Number', type: 'text' },
                  { name: 'subject', label: 'Inquiry Subject Header', type: 'text', required: true },
                  { name: 'message', label: 'Inquiry Narrative Body', type: 'textarea', required: true },
                  { name: 'isRead', label: 'Message Checked & Resolved', type: 'boolean', required: true, defaultValue: false }
                ]
              },
              settings: {
                title: "Website Configuration",
                description: "Manage global company identity parameters in Supabase.",
                fields: [
                  { name: 'companyName', label: 'Company Enterprise Name', type: 'text', required: true },
                  { name: 'logo', label: 'Branding Logo URL', type: 'image', required: true },
                  { name: 'favicon', label: 'Favicon Icon (32x32) URL', type: 'image', required: true },
                  { name: 'email', label: 'Corporate Support Email', type: 'text', required: true },
                  { name: 'phone', label: 'Helpdesk Call Number', type: 'text', required: true },
                  { name: 'address', label: 'Physical Corporate Headquarters Address', type: 'textarea', required: true }
                ]
              }
            };

            const selectedConfig = cmsTablesConfig[selectedCmsTable] || cmsTablesConfig.hero;

            return (
              <div className="space-y-6">
                {/* Table selector pill list */}
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1 font-mono">Select Active Supabase Live Table</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(cmsTablesConfig).map((key) => {
                      const isActive = selectedCmsTable === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedCmsTable(key)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all border ${
                            isActive
                              ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white border-emerald-500'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {cmsTablesConfig[key].title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <GenericCMS
                  tableName={selectedCmsTable}
                  title={selectedConfig.title}
                  description={selectedConfig.description}
                  fields={selectedConfig.fields}
                  orderByField={selectedConfig.orderByField}
                  orderAscending={selectedConfig.orderAscending}
                />
              </div>
            );
          })()}

          {/* =========================================================================
              TAB: WEBSITE SETTINGS
              ========================================================================= */}
          {activeTab === 'settings' && settings && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">

              {/* Settings Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Branding Assets */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 border-b pb-2">Branding Images</h3>
                    <ImageDropzone 
                      label="Corporate Main Logo" 
                      value={uploadedImageUrl} 
                      onChange={setUploadedImageUrl} 
                    />
                    <ImageDropzone 
                      label="Favicon File (32x32)" 
                      value={uploadedFaviconUrl} 
                      onChange={setUploadedFaviconUrl} 
                    />
                  </div>

                  {/* Right Column: Contact info */}
                  <div className="space-y-5">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 border-b pb-2">General Contacts</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Company Registered Name</label>
                      <input 
                        type="text" 
                        value={settings.companyName}
                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">WhatsApp Helpdesk Line (Locked)</label>
                      <input 
                        type="text" 
                        value="+91 7989270174"
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Primary Contact Email (Locked)</label>
                      <input 
                        type="email" 
                        value="info.zentriya@gmail.com"
                        disabled
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Brand Primary (HEX)</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="w-8 h-8 rounded border"
                          />
                          <input 
                            type="text" 
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1 rounded-xl text-xs uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Brand Secondary (HEX)</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={settings.secondaryColor}
                            onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                            className="w-8 h-8 rounded border"
                          />
                          <input 
                            type="text" 
                            value={settings.secondaryColor}
                            onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1 rounded-xl text-xs uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 border-b pb-2">Footer & SEO Configurations</h3>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 block">Official Helpline Phone Numbers (Locked)</label>
                      <div className="space-y-1">
                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 px-3 rounded-xl text-xs text-slate-500 font-mono">+91 7989270174</div>
                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 px-3 rounded-xl text-xs text-slate-500 font-mono">+91 95509 50705</div>
                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 px-3 rounded-xl text-xs text-slate-500 font-mono">+91 6301550330</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Official Website URL (Locked)</label>
                      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs text-slate-500 font-mono">
                        https://zentriya.com
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">SEO Meta Title tags</label>
                      <input 
                        type="text" 
                        value={settings.seo.metaTitle}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          seo: { ...settings.seo, metaTitle: e.target.value } 
                        })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 border-b pb-2">Social Network Coordinates</h3>
                    
                    {['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'].map((network) => (
                      <div key={network} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">{network} Link</label>
                        <input 
                          type="url" 
                          value={(settings.socialLinks as any)[network] || ''}
                          onChange={(e) => setSettings({ 
                            ...settings, 
                            socialLinks: { ...settings.socialLinks, [network]: e.target.value } 
                          })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                          placeholder={`https://${network}.com/username`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t dark:border-slate-800 flex justify-end">
                  <button 
                    onClick={async () => {
                      const updated = {
                        ...settings,
                        logoUrl: uploadedImageUrl,
                        faviconUrl: uploadedFaviconUrl,
                        contactEmail: 'info.zentriya@gmail.com',
                        contactPhones: ['+91 7989270174', '+91 95509 50705', '+91 6301550330'],
                        whatsappNumber: '+917989270174',
                        address: '',
                        googleMapEmbedUrl: ''
                      };
                      await db.updateSettings(updated);
                      toast('Website configurations overwritten successfully!', 'success');
                      loadData();
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-transform hover:scale-[1.02]"
                  >
                    <Save size={14} />
                    Overwrite Settings Sheet
                  </button>
                </div>
              </div>

              {/* System Security, Backups & Disaster Recovery section */}
              <div className="border-t dark:border-slate-800 pt-8 mt-8 space-y-6 animate-fade-in">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b dark:border-slate-800 pb-3">
                  <ShieldAlert className="text-emerald-500" size={18} />
                  System Security, Backups & Disaster Recovery
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left panel: Change Owner Password & 2FA */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl space-y-5">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Owner Security Portal</h4>
                    
                    {/* Password Update form */}
                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Change Security Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter new secure password (min 6 chars)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs text-slate-900 dark:text-slate-100 outline-none"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
                      >
                        <Save size={13} />
                        Update Security Password
                      </button>
                    </form>

                    {/* Two-Factor Authentication support (optional) */}
                    <div className="pt-3 border-t dark:border-slate-800/60 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Two-Factor Authentication (2FA)</span>
                        <p className="text-[9.5px] text-slate-400 leading-tight">Enable biometric or authenticator app validation overlays.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={handleToggleMfa}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          mfaActive 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'bg-slate-250 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {mfaActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>
                  </div>

                  {/* Right panel: Database Backup and Disaster Recovery */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl space-y-5">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Database Backups & Disaster Recovery</h4>
                    
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Download full backups of Zentriya's local records and website content sheets. If a system failure or data loss event occurs, drag-and-drop your backup file here to restore configurations instantly.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {/* Backup button */}
                      <button 
                        type="button"
                        onClick={handleBackup}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      >
                        <Save size={13} />
                        Backup Database
                      </button>

                      {/* Restore Upload trigger */}
                      <label className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer text-center">
                        <RefreshCw size={13} />
                        Restore Database
                        <input 
                          type="file" 
                          accept=".json"
                          onChange={handleRestore}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TABS CRUD: HERO, ABOUT, SERVICES, INTERNSHIPS, COURSES, GALLERY, BLOGS, TEAM, TESTIMONIALS, CAREERS, APPLICATIONS, CONTACTS, FAQS
              ========================================================================= */}
          {activeTab !== 'settings' && (
            <div className="space-y-6">
              
              {/* Toolbar: Search, Filter, Add New Button */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                
                {/* Search & Filter bar */}
                <div className="flex flex-1 flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder={`Search records here...`} 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 pl-10 rounded-xl text-xs outline-none"
                    />
                  </div>

                  {/* Dynamic context filter dropdown */}
                  {['services', 'courses', 'programs', 'gallery', 'blogs', 'careers', 'applications', 'contacts'].includes(activeTab) && (
                    <div className="relative min-w-[150px]">
                      <Filter className="absolute left-3 top-3 text-slate-400" size={14} />
                      <select 
                        value={filterCategory}
                        onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 pl-9 rounded-xl text-xs outline-none text-slate-600 dark:text-slate-300"
                      >
                        <option value="All">All Categories</option>
                        {activeTab === 'gallery' && (
                          <>
                            <option value="image">Photos</option>
                            <option value="video">Videos</option>
                          </>
                        )}
                        {activeTab === 'applications' && (
                          <>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </>
                        )}
                        {activeTab === 'contacts' && (
                          <>
                            <option value="unread">Unread Only</option>
                            <option value="read">Read Only</option>
                          </>
                        )}
                        {activeTab === 'blogs' && (
                          <>
                            <option value="AI & Engineering">AI & Engineering</option>
                            <option value="Careers">Careers</option>
                            <option value="Development">Development</option>
                          </>
                        )}
                        {activeTab === 'services' && (
                          <>
                            <option value="IT Services">IT Services</option>
                            <option value="Corporate Training">Corporate Training</option>
                          </>
                        )}
                        {activeTab === 'courses' && (
                          <>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Self-Paced">Self-Paced</option>
                          </>
                        )}
                        {activeTab === 'programs' && (
                          <>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Self-Paced">Self-Paced</option>
                          </>
                        )}
                        {activeTab === 'careers' && (
                          <>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </div>

                {/* Add New Trigger */}
                {!['applications', 'contacts'].includes(activeTab) && !isCreating && !editingItem && (
                  <button 
                    onClick={() => {
                      setIsCreating(true);
                      setEditingItem(null);
                      setUploadedImageUrl('');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.02]"
                  >
                    <Plus size={15} />
                    Add New Record
                  </button>
                )}
              </div>

              {/* DYNAMIC FORMS / ADD & EDIT MODE */}
              {(isCreating || editingItem) ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                  
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase flex items-center gap-2">
                      <PlusCircle className="text-emerald-500" size={20} />
                      {isCreating ? 'Configure New Record' : 'Edit Selected Record'}
                    </h3>
                    <button 
                      onClick={handleCloseForm}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* FORM RENDER ENGINE */}
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const id = editingItem ? editingItem.id : (activeTab + '_' + Date.now());

                      try {
                        switch (activeTab) {
                          case 'hero': {
                            const newSlide: HeroSlide = {
                              id,
                              title: fd.get('title') as string,
                              subtitle: fd.get('subtitle') as string,
                              ctaText: fd.get('ctaText') as string,
                              ctaLink: fd.get('ctaLink') as string,
                              order: Number(fd.get('order')) || 1,
                              imageUrl: uploadedImageUrl || editingItem?.imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
                            };
                            let list = [...heroSlides];
                            if (editingItem) {
                              list = list.map(s => s.id === id ? newSlide : s);
                            } else {
                              list.push(newSlide);
                            }
                            await db.saveHeroSlides(list);
                            break;
                          }

                          case 'about': {
                            const title = fd.get('title') as string;
                            const description = fd.get('description') as string;
                            const is_active = fd.get('is_active') === 'true';
                            const item: AboutSection = {
                              id: editingItem?.id || about?.id || 'about_1',
                              title,
                              description,
                              image: uploadedImageUrl || editingItem?.image || about?.image || '',
                              is_active,
                              created_at: editingItem?.created_at || about?.created_at || new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            };
                            await db.updateAbout(item);
                            break;
                          }

                          case 'why_choose_us': {
                            const item: WhyChooseUsItem = {
                              id,
                              title: fd.get('title') as string,
                              icon: fd.get('icon') as string || 'Lightbulb',
                              display_order: Number(fd.get('display_order')) || whyChooseUs.length + 1,
                              is_active: fd.get('is_active') === 'true',
                              description: fd.get('description') as string || '',
                              bottom_badge: fd.get('bottom_badge') as string || '',
                              created_at: editingItem?.created_at || new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            };
                            await db.saveWhyChooseUsItem(item);
                            break;
                          }

                          case 'student_journey': {
                            const item: StudentJourneyStep = {
                              id,
                              title: fd.get('title') as string,
                              description: fd.get('description') as string,
                              icon: fd.get('icon') as string || 'Milestone',
                              display_order: Number(fd.get('display_order')) || studentJourneySteps.length + 1,
                              is_active: fd.get('is_active') === 'true',
                              created_at: editingItem?.created_at || new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            };
                            await db.saveStudentJourneyStep(item);
                            break;
                          }

                          case 'industry_network': {
                            const item: IndustryPartner = {
                              id,
                              company_name: fd.get('company_name') as string,
                              logo: fd.get('logo') as string,
                              website_url: fd.get('website_url') as string || '',
                              display_order: Number(fd.get('display_order')) || industryPartners.length + 1,
                              is_active: fd.get('is_active') === 'true',
                              created_at: editingItem?.created_at || new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            };
                            await db.saveIndustryPartner(item);
                            break;
                          }

                          case 'placements': {
                            const item: Placement = {
                              id,
                              student_name: fd.get('student_name') as string,
                              photo: uploadedImageUrl || editingItem?.photo || '',
                              company_name: fd.get('company_name') as string,
                              company_logo: fd.get('company_logo') as string,
                              job_role: fd.get('job_role') as string,
                              degree: fd.get('degree') as string,
                              batch: fd.get('batch') as string,
                              package: fd.get('package') ? Number(fd.get('package')) : undefined,
                              show_package: fd.get('show_package') === 'true',
                              placement_badge: fd.get('placement_badge') as string || `Placed at ${fd.get('company_name')}`,
                              display_order: Number(fd.get('display_order')) || adminPlacements.length + 1,
                              is_active: fd.get('is_active') === 'true',
                              created_at: editingItem?.created_at || new Date().toISOString(),
                              updated_at: new Date().toISOString()
                            };
                            await db.savePlacement(item);
                            break;
                          }

                          case 'services': {
                            const newService: ServiceItem = {
                              id,
                              title: fd.get('title') as string,
                              description: fd.get('description') as string,
                              detailedDescription: fd.get('detailedDescription') as string || '',
                              features: (fd.get('features') as string || '').split('\n').map(f => f.trim()).filter(Boolean),
                              benefits: (fd.get('benefits') as string || '').split('\n').map(b => b.trim()).filter(Boolean),
                              order: Number(fd.get('order')) || 1,
                              isActive: fd.get('isActive') === 'true',
                              icon: fd.get('icon') as string || 'Layers',
                              imageUrl: uploadedImageUrl || editingItem?.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
                              galleryUrls: [],
                              themeColor: fd.get('themeColor') as string || 'Blue',
                              buttonText: fd.get('buttonText') as string || 'View Service →',
                              buttonLink: fd.get('buttonLink') as string || ''
                            };
                            await db.saveService(newService);
                            break;
                          }

                          case 'internships': {
                            const newIntern: InternshipProgram = {
                              id,
                              title: fd.get('title') as string,
                              duration: fd.get('duration') as string || '3 Months',
                              technology: fd.get('technology') as string,
                              mode: fd.get('mode') as InternshipProgram['mode'],
                              description: fd.get('description') as string,
                              price: Number(fd.get('price')) || 10000,
                              discountPrice: Number(fd.get('discountPrice')) || undefined,
                              features: (fd.get('features') as string).split(',').map(f => f.trim()).filter(Boolean),
                              certificateDetails: fd.get('certificateDetails') as string,
                              bannerUrl: uploadedImageUrl || editingItem?.bannerUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
                              isActive: fd.get('isActive') === 'on',
                              order: editingItem && 'order' in editingItem ? (editingItem.order as number) : undefined
                            };
                            await db.saveInternship(newIntern);
                            break;
                          }

                          case 'courses': {
                            const newCourse: CourseItem = {
                              id,
                              title: fd.get('title') as string,
                              category: fd.get('category') as string,
                              duration: fd.get('duration') as string || '6 Weeks',
                              description: fd.get('description') as string,
                              price: Number(fd.get('price')) || 5000,
                              discountPrice: Number(fd.get('discountPrice')) || undefined,
                              mode: fd.get('mode') as CourseItem['mode'],
                              features: (fd.get('features') as string).split(',').map(f => f.trim()).filter(Boolean),
                              syllabus: (fd.get('syllabus') as string).split(',').map(s => s.trim()).filter(Boolean),
                              bannerUrl: uploadedImageUrl || editingItem?.bannerUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                              isActive: fd.get('isActive') === 'on',
                              order: editingItem && 'order' in editingItem ? (editingItem.order as number) : undefined
                            };
                            await db.saveCourse(newCourse);
                            break;
                          }

                          case 'programs': {
                            const newProgram: ProgramItem = {
                              id,
                              title: fd.get('title') as string,
                              category: fd.get('category') as string,
                              duration: fd.get('duration') as string || '3 Months',
                              description: fd.get('description') as string,
                              mode: fd.get('mode') as string,
                              badges: (fd.get('badges') as string || '').split(',').map(b => b.trim()).filter(Boolean),
                              syllabus: (fd.get('syllabus') as string || '').split(',').map(s => s.trim()).filter(Boolean),
                              cover_image: uploadedImageUrl || editingItem?.cover_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                              is_active: fd.get('is_active') === 'on',
                              display_order: editingItem && 'display_order' in editingItem ? (editingItem.display_order as number) : undefined
                            };
                            await db.saveProgram(newProgram);
                            break;
                          }

                          case 'gallery': {
                            const newGallery: GalleryItem = {
                              id,
                              title: fd.get('title') as string,
                              type: fd.get('type') as 'image' | 'video',
                              url: uploadedImageUrl || fd.get('url') as string,
                              category: fd.get('category') as string || 'Corporate'
                            };
                            await db.saveGalleryItem(newGallery);
                            break;
                          }

                          case 'team': {
                            const newTeam: TeamMember = {
                              id,
                              name: fd.get('name') as string,
                              designation: fd.get('designation') as string,
                              bio: fd.get('bio') as string || '',
                              photoUrl: uploadedImageUrl || editingItem?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
                              socialLinks: {
                                linkedin: fd.get('linkedin') as string || '',
                                email: fd.get('email') as string || ''
                              },
                              order: Number(fd.get('order')) || 1
                            };
                            await db.saveTeamMember(newTeam);
                            break;
                          }

                          case 'testimonials': {
                            const text = fd.get('text') as string;
                            const profilePhoto = uploadedImageUrl || editingItem?.profile_photo || editingItem?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
                            const designation = fd.get('designation') as string || '';
                            const companyName = fd.get('company') as string || '';
                            
                            // fallback for legacy compatibility
                            const fallbackCompanyOrCollege = companyName && designation 
                              ? `${designation} at ${companyName}`
                              : (fd.get('companyOrCollege') as string || '');

                            const newTest: TestimonialItem = {
                              id,
                              name: fd.get('name') as string,
                              companyOrCollege: fallbackCompanyOrCollege,
                              type: fd.get('type') as 'Student' | 'Corporate',
                              text: text,
                              rating: Number(fd.get('rating')) || 5,
                              avatarUrl: profilePhoto,
                              
                              // New DB fields
                              designation: designation,
                              company: companyName,
                              company_logo: fd.get('company_logo') as string || '',
                              profile_photo: profilePhoto,
                              review: text,
                              linkedin: fd.get('linkedin') as string || '',
                              is_verified: fd.get('is_verified') === 'true',
                              display_order: Number(fd.get('display_order')) ?? 99,
                              is_active: fd.get('is_active') === 'true',
                            };
                            await db.saveTestimonial(newTest);
                            break;
                          }

                          case 'blogs': {
                            const title = fd.get('title') as string;
                            const newBlog: BlogPost = {
                              id,
                              title,
                              slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                              excerpt: fd.get('excerpt') as string,
                              content: fd.get('content') as string,
                              category: fd.get('category') as string || 'Careers',
                              tags: (fd.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
                              author: fd.get('author') as string || 'Zentriya Architect',
                              imageUrl: uploadedImageUrl || editingItem?.imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
                              featured: fd.get('featured') === 'true',
                              createdAt: editingItem?.createdAt || new Date().toISOString()
                            };
                            await db.saveBlogPost(newBlog);
                            break;
                          }

                          case 'articles': {
                            const title = fd.get('title') as string;
                            const desc = fd.get('description') as string;
                            const rTime = fd.get('read_time') as string || '5 min read';
                            const pDate = editingItem?.published_date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            const authImg = fd.get('author_image') as string || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80';
                            
                            const newArticle: Article = {
                              id,
                              title,
                              description: desc,
                              excerpt: desc,
                              content: fd.get('content') as string,
                              category: fd.get('category') as string || 'Cloud & DevOps',
                              cover_image: uploadedImageUrl || editingItem?.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
                              read_time: rTime,
                              read_time_minutes: parseInt(rTime) || 5,
                              author_name: fd.get('author_name') as string || 'Zentriya Architect',
                              author_designation: fd.get('author_designation') as string || 'Cloud Lead',
                              author_image: authImg,
                              author_avatar: authImg,
                              is_active: fd.get('is_active') === 'true',
                              published_date: pDate,
                              published_at: pDate,
                              display_order: editingItem ? editingItem.display_order : (adminArticles.length + 1)
                            };
                            await db.saveArticle(newArticle);
                            break;
                          }

                          case 'careers': {
                            const newJob: JobListing = {
                              id,
                              title: fd.get('title') as string,
                              department: fd.get('department') as string,
                              location: fd.get('location') as string || 'Bangalore Office',
                              type: fd.get('type') as any,
                              experience: fd.get('experience') as string || '0-2 Years',
                              description: fd.get('description') as string,
                              requirements: (fd.get('requirements') as string).split(',').map(r => r.trim()).filter(Boolean),
                              responsibilities: (fd.get('responsibilities') as string).split(',').map(r => r.trim()).filter(Boolean),
                              salaryRange: fd.get('salaryRange') as string || 'Best in Industry',
                              isActive: fd.get('isActive') === 'true',
                              createdAt: editingItem?.createdAt || new Date().toISOString()
                            };
                            await db.saveJob(newJob);
                            break;
                          }

                          case 'faqs': {
                            const newFaq: FaqItem = {
                              id,
                              question: fd.get('question') as string,
                              answer: fd.get('answer') as string,
                              category: fd.get('category') as string || 'General'
                            };
                            await db.saveFaq(newFaq);
                            break;
                          }

                          default:
                            break;
                        }

                        toast(`Module changes persistent saved!`, 'success');
                        handleCloseForm();
                        loadData();
                      } catch (err) {
                        toast('Error submitting data values.', 'error');
                      }
                    }} 
                    className="space-y-5"
                  >
                    
                    {/* HERO SLIDES FORM */}
                    {activeTab === 'hero' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Slide Heading Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Slide Sub-headline *</label>
                            <textarea rows={3} name="subtitle" defaultValue={editingItem?.subtitle || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Button Text</label>
                              <input type="text" name="ctaText" defaultValue={editingItem?.ctaText || 'Get Started'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Link Path</label>
                              <input type="text" name="ctaLink" defaultValue={editingItem?.ctaLink || '/services'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Slide Order Index</label>
                            <input type="number" name="order" defaultValue={editingItem?.order || 1} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Hero Background Banner" 
                            value={uploadedImageUrl || editingItem?.imageUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* ABOUT FORM */}
                    {activeTab === 'about' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brochure Section Title *</label>
                            <input 
                              type="text" 
                              name="title" 
                              defaultValue={editingItem?.title || about?.title || 'ABOUT US'} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brochure Description / Content *</label>
                            <textarea 
                              rows={10} 
                              name="description" 
                              defaultValue={editingItem?.description || about?.description || ''} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                            <select 
                              name="is_active" 
                              defaultValue={editingItem ? String(editingItem.is_active) : (about ? String(about.is_active) : 'true')} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="true">Enabled / Active</option>
                              <option value="false">Disabled / Hidden</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Corporate Brochure Image" 
                            value={uploadedImageUrl || editingItem?.image || about?.image || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* SERVICES FORM */}
                    {activeTab === 'services' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Service Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Short Description Overview *</label>
                            <textarea rows={2} name="description" defaultValue={editingItem?.description || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Description *</label>
                            <textarea rows={4} name="detailedDescription" defaultValue={editingItem?.detailedDescription || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" placeholder="Comprehensive service descriptions, insights and workflow outlines..." />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lucide Icon Name *</label>
                              <input type="text" name="icon" defaultValue={editingItem?.icon || 'Layers'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sort Order Index</label>
                              <input type="number" name="order" defaultValue={editingItem?.order || 1} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Service Status *</label>
                            <select name="isActive" defaultValue={editingItem?.isActive !== false ? 'true' : 'false'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                              <option value="true">Active (Enabled)</option>
                              <option value="false">Inactive (Disabled)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Theme Color *</label>
                            <select name="themeColor" defaultValue={editingItem?.themeColor || 'Blue'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                              <option value="Green">Green (Internships)</option>
                              <option value="Blue">Blue (Software Development)</option>
                              <option value="Purple">Purple (Training & Skill Dev)</option>
                              <option value="Orange">Orange (Bootcamps & Hackathons)</option>
                              <option value="Cyan">Cyan (Consulting Services)</option>
                              <option value="Emerald">Emerald (Projects & Placements)</option>
                              <option value="Indigo">Indigo (Global Certifications)</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Button Text</label>
                              <input type="text" name="buttonText" defaultValue={editingItem?.buttonText || 'View Service →'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Button Link</label>
                              <input type="text" name="buttonLink" defaultValue={editingItem?.buttonLink || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" placeholder="/contact or url" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Service Cover Image" 
                            value={uploadedImageUrl || editingItem?.imageUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Service Features (one per line) *</label>
                            <textarea rows={3} name="features" defaultValue={editingItem?.features?.join('\n') || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono" placeholder="Live Project Collaboration&#10;Professional Code Reviews&#10;Resume Audit" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Service Benefits (one per line) *</label>
                            <textarea rows={3} name="benefits" defaultValue={editingItem?.benefits?.join('\n') || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono" placeholder="Corporate Certificate&#10;Direct Referral Networks" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INTERNSHIPS FORM */}
                    {activeTab === 'internships' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Internship Track Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (e.g. 3 Months) *</label>
                              <input type="text" name="duration" defaultValue={editingItem?.duration || '3 Months'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Delivery Mode *</label>
                              <select name="mode" defaultValue={editingItem?.mode || 'Hybrid'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                                <option value="Hybrid">Hybrid</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tech Stack (comma separated) *</label>
                            <input type="text" name="technology" defaultValue={editingItem?.technology || ''} required placeholder="Python, Django, React" className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Standard Cost (INR) *</label>
                              <input type="number" name="price" defaultValue={editingItem?.price || 15000} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Promo Discount Price (INR)</label>
                              <input type="number" name="discountPrice" defaultValue={editingItem?.discountPrice || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Features List (comma separated) *</label>
                            <input type="text" name="features" defaultValue={editingItem?.features?.join(', ') || ''} required placeholder="Corporate Mentors, Live AWS Deployments" className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Certificate Details *</label>
                            <input type="text" name="certificateDetails" defaultValue={editingItem?.certificateDetails || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <input 
                              type="checkbox" 
                              name="isActive" 
                              id="isActive" 
                              defaultChecked={editingItem ? editingItem.isActive : true} 
                              className="w-4 h-4 rounded border-slate-200 dark:border-slate-800 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950" 
                            />
                            <label htmlFor="isActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">Is Active / Visible on Website</label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Track Short Description *</label>
                            <textarea rows={3} name="description" defaultValue={editingItem?.description || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <ImageDropzone 
                            label="Track Banner / Thumbnail" 
                            value={uploadedImageUrl || editingItem?.bannerUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* COURSES FORM */}
                    {activeTab === 'courses' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category / Domain *</label>
                              <input type="text" name="category" defaultValue={editingItem?.category || 'Web Development'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration (e.g. 6 Weeks) *</label>
                              <input type="text" name="duration" defaultValue={editingItem?.duration || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mode *</label>
                              <select name="mode" defaultValue={editingItem?.mode || 'Online'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                                <option value="Self-Paced">Self-Paced</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Standard Price *</label>
                              <input type="number" name="price" defaultValue={editingItem?.price || 5000} required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Offer Price</label>
                              <input type="number" name="discountPrice" defaultValue={editingItem?.discountPrice || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brief Overview Description *</label>
                            <textarea rows={2} name="description" defaultValue={editingItem?.description || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Syllabus Chapters (comma separated list) *</label>
                            <input type="text" name="syllabus" defaultValue={editingItem?.syllabus?.join(', ') || ''} required placeholder="Module 1: Docker Basics, Module 2: ECS deployments" className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Perks & Features (comma separated) *</label>
                            <input type="text" name="features" defaultValue={editingItem?.features?.join(', ') || ''} required placeholder="Hands-on labs, 3 Case Studies" className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <ImageDropzone 
                            label="Course Banner / Thumbnail" 
                            value={uploadedImageUrl || editingItem?.bannerUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                          <div className="flex items-center gap-2 pt-2">
                            <input 
                              type="checkbox" 
                              name="isActive" 
                              id="courseActive" 
                              defaultChecked={editingItem ? editingItem.isActive : true} 
                              className="w-4 h-4 rounded border-slate-200 dark:border-slate-800 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950" 
                            />
                            <label htmlFor="courseActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">Is Active / Visible on Website</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PROGRAMS FORM */}
                    {activeTab === 'programs' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Program Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category / Domain *</label>
                              <input type="text" name="category" defaultValue={editingItem?.category || 'Placement Internship'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Duration *</label>
                              <input type="text" name="duration" defaultValue={editingItem?.duration || '3 Months'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Training Mode *</label>
                            <select name="mode" defaultValue={editingItem?.mode || 'Offline'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="Hybrid">Hybrid</option>
                              <option value="Self-Paced">Self-Paced</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brief Overview Description *</label>
                            <textarea rows={2} name="description" defaultValue={editingItem?.description || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Syllabus Chapters (comma separated list) *</label>
                            <input type="text" name="syllabus" defaultValue={editingItem?.syllabus?.join(', ') || ''} required placeholder="Module 1: Java Basics, Module 2: Spring Boot API, Module 3: Microservices" className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Badges (comma separated) *</label>
                            <input type="text" name="badges" defaultValue={editingItem?.badges?.join(', ') || 'Live Projects, Mentor Support, Global Certifications'} required placeholder="Live Projects, Mentor Support, Global Certifications" className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <ImageDropzone 
                            label="Program Cover Image" 
                            value={uploadedImageUrl || editingItem?.cover_image || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                          <div className="flex items-center gap-2 pt-2">
                            <input 
                              type="checkbox" 
                              name="is_active" 
                              id="programActive" 
                              defaultChecked={editingItem ? editingItem.is_active : true} 
                              className="w-4 h-4 rounded border-slate-200 dark:border-slate-800 text-emerald-600 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-950" 
                            />
                            <label htmlFor="programActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">Is Active / Visible on Website</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GALLERY FORM */}
                    {activeTab === 'gallery' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Media Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Media Type *</label>
                            <select name="type" defaultValue={editingItem?.type || 'image'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                              <option value="image">Photo Upload</option>
                              <option value="video">External Video URL</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category Tag (e.g. Bootcamps, Placements) *</label>
                            <input type="text" name="category" defaultValue={editingItem?.category || 'Bootcamps'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Video Link / Fallback URL</label>
                            <input type="text" name="url" defaultValue={editingItem?.url || ''} placeholder="https://youtube.com/watch?v=..." className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Gallery Photo / Poster" 
                            value={uploadedImageUrl || editingItem?.url || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* BLOGS FORM */}
                    {activeTab === 'blogs' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-8 space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Article Title Heading *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Excerpt / Short Description *</label>
                            <textarea rows={2} name="excerpt" defaultValue={editingItem?.excerpt || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Rich HTML Content Body *</label>
                            <textarea rows={10} name="content" defaultValue={editingItem?.content || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white leading-relaxed" placeholder="<h2>Your heading</h2><p>Your content body...</p>" />
                          </div>
                        </div>

                        <div className="md:col-span-4 space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                            <input type="text" name="category" defaultValue={editingItem?.category || 'AI & Engineering'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Author Name</label>
                            <input type="text" name="author" defaultValue={editingItem?.author || 'Zentriya Principal Consultant'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tags (comma separated list)</label>
                            <input type="text" name="tags" defaultValue={editingItem?.tags?.join(', ') || ''} placeholder="Artificial Intelligence, Cyber Security" className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Featured Article?</label>
                            <select name="featured" defaultValue={editingItem?.featured ? 'true' : 'false'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-700 dark:text-white">
                              <option value="false">Standard Article</option>
                              <option value="true">Featured Highlight</option>
                            </select>
                          </div>
                          <ImageDropzone 
                            label="Featured Cover Image" 
                            value={uploadedImageUrl || editingItem?.imageUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* TECH ARTICLES FORM */}
                    {activeTab === 'articles' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        <div className="md:col-span-8 space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Article Title Heading *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-bold" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Excerpt / Short Description *</label>
                            <textarea rows={2} name="description" defaultValue={editingItem?.description || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Rich HTML Content Body *</label>
                            <textarea rows={10} name="content" defaultValue={editingItem?.content || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-white leading-relaxed" placeholder="<h2>Your heading</h2><p>Your content body...</p>" />
                          </div>
                        </div>

                        <div className="md:col-span-4 space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                            <select name="category" defaultValue={editingItem?.category || 'Cloud & DevOps'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-750 dark:text-white">
                              {adminCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Read Time (e.g. '5 min read')</label>
                            <input type="text" name="read_time" defaultValue={editingItem?.read_time || '5 min read'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Author Name</label>
                            <input type="text" name="author_name" defaultValue={editingItem?.author_name || 'Zentriya Principal Consultant'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Author Designation</label>
                            <input type="text" name="author_designation" defaultValue={editingItem?.author_designation || 'Principal Solutions Architect'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Author Avatar URL</label>
                            <input type="text" name="author_image" defaultValue={editingItem?.author_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Status</label>
                            <select name="is_active" defaultValue={editingItem?.is_active !== false ? 'true' : 'false'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded text-xs text-slate-700 dark:text-white">
                              <option value="true">Published & Active</option>
                              <option value="false">Disabled / Draft</option>
                            </select>
                          </div>
                          <ImageDropzone 
                            label="Cover Image" 
                            value={uploadedImageUrl || editingItem?.cover_image || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* TEAM FORM */}
                    {activeTab === 'team' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                            <input type="text" name="name" defaultValue={editingItem?.name || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Role *</label>
                            <input type="text" name="designation" defaultValue={editingItem?.designation || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                            <input type="url" name="linkedin" defaultValue={editingItem?.socialLinks?.linkedin || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                              <input type="email" name="email" defaultValue={editingItem?.socialLinks?.email || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order</label>
                              <input type="number" name="order" defaultValue={editingItem?.order || 1} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Short Biography / Credentials</label>
                            <textarea rows={2} name="bio" defaultValue={editingItem?.bio || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Member Headshot Photo" 
                            value={uploadedImageUrl || editingItem?.photoUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* TESTIMONIALS FORM */}
                    {activeTab === 'testimonials' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reviewer Name *</label>
                              <input type="text" name="name" defaultValue={editingItem?.name || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">LinkedIn Profile URL</label>
                              <input type="url" name="linkedin" placeholder="https://linkedin.com/in/username" defaultValue={editingItem?.linkedin || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Designation / Role *</label>
                              <input type="text" name="designation" placeholder="e.g. Software Engineer / Alumna" defaultValue={editingItem?.designation || (editingItem?.companyOrCollege ? editingItem.companyOrCollege.split(' at ')[0] : '')} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
                              <input type="text" name="company" placeholder="e.g. IBM / Accenture" defaultValue={editingItem?.company || (editingItem?.companyOrCollege ? (editingItem.companyOrCollege.includes(' at ') ? editingItem.companyOrCollege.split(' at ')[1] : editingItem.companyOrCollege) : '')} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Logo Accent *</label>
                              <select name="company_logo" defaultValue={editingItem?.company_logo || ''} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-white">
                                <option value="">None / Custom Text</option>
                                <option value="ibm">IBM</option>
                                <option value="accenture">Accenture</option>
                                <option value="innocorp">Innocorp</option>
                                <option value="capgemini">Capgemini</option>
                                <option value="tcs">TCS</option>
                                <option value="infosys">Infosys</option>
                                <option value="wipro">Wipro</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Star Rating (1 to 5) *</label>
                              <input type="number" name="rating" min={1} max={5} defaultValue={editingItem?.rating || 5} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Testimonial Type *</label>
                              <select name="type" defaultValue={editingItem?.type || 'Student'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-white">
                                <option value="Student">Student Trainee</option>
                                <option value="Corporate">Corporate Client</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Verified Badge *</label>
                              <select name="is_verified" defaultValue={editingItem?.is_verified !== false ? 'true' : 'false'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-white">
                                <option value="true">Verified Reviewer</option>
                                <option value="false">Unverified</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order *</label>
                              <input type="number" name="display_order" min={0} defaultValue={editingItem?.display_order ?? 99} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Status *</label>
                              <select name="is_active" defaultValue={editingItem?.is_active !== false ? 'true' : 'false'} className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-750 dark:text-white">
                                <option value="true">Active (Visible)</option>
                                <option value="false">Disabled (Hidden)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Testimonial Review text *</label>
                            <textarea rows={4} name="text" defaultValue={editingItem?.text || editingItem?.review || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Reviewer Profile Photo" 
                            value={uploadedImageUrl || editingItem?.profile_photo || editingItem?.avatarUrl || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    {/* CAREERS FORM */}
                    {activeTab === 'careers' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Position Title *</label>
                            <input type="text" name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Corporate Department *</label>
                              <input type="text" name="department" defaultValue={editingItem?.department || 'Engineering'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location *</label>
                              <input type="text" name="location" defaultValue={editingItem?.location || 'Bangalore Office'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Type *</label>
                              <select name="type" defaultValue={editingItem?.type || 'Full-time'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Experience *</label>
                              <input type="text" name="experience" defaultValue={editingItem?.experience || '0-2 Years'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Salary Range</label>
                              <input type="text" name="salaryRange" defaultValue={editingItem?.salaryRange || 'Best in Industry'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Is Active Listing?</label>
                            <select name="isActive" defaultValue={editingItem?.isActive ? 'true' : 'false'} className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-700 dark:text-white">
                              <option value="true">Active & Hiring</option>
                              <option value="false">On Hold</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Description *</label>
                            <textarea rows={3} name="description" defaultValue={editingItem?.description || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Skills Requirements (comma separated) *</label>
                            <input type="text" name="requirements" defaultValue={editingItem?.requirements?.join(', ') || ''} placeholder="React, Node.js, AWS basics" required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Responsibilities (comma separated) *</label>
                            <input type="text" name="responsibilities" defaultValue={editingItem?.responsibilities?.join(', ') || ''} placeholder="Deliver code modules, participate in design reviews" required className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded border dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FAQS FORM */}
                    {activeTab === 'faqs' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category Tag (e.g., Internships, Placement, General) *</label>
                          <input type="text" name="category" defaultValue={editingItem?.category || 'General'} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">FAQ Question *</label>
                          <input type="text" name="question" defaultValue={editingItem?.question || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Answer Explanation *</label>
                          <textarea rows={4} name="answer" defaultValue={editingItem?.answer || ''} required className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" />
                        </div>
                      </div>
                    )}

                    {/* WHY CHOOSE US FORM */}
                    {activeTab === 'why_choose_us' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Feature Title *</label>
                          <input 
                            type="text" 
                            name="title" 
                            defaultValue={editingItem?.title || ''} 
                            required 
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lucide Icon Name *</label>
                          <select 
                            name="icon" 
                            defaultValue={editingItem?.icon || 'Lightbulb'} 
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          >
                            <option value="Lightbulb">💡 Lightbulb (Innovation)</option>
                            <option value="Target">🎯 Target (Placement)</option>
                            <option value="TrendingUp">📈 Trending Up (Growth / Success)</option>
                            <option value="Award">🏆 Award (Excellence)</option>
                            <option value="GraduationCap">🎓 Graduation Cap (Education)</option>
                            <option value="Briefcase">💼 Briefcase (MNCs)</option>
                            <option value="Users">👥 Users (Collaboration)</option>
                            <option value="Code">💻 Code (Practical Exposure)</option>
                            <option value="Zap">⚡ Zap (Innovation-Driven)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Supporting Description *</label>
                          <textarea 
                            name="description" 
                            defaultValue={editingItem?.description || ''} 
                            required 
                            rows={3}
                            placeholder="e.g. Hands-on training with live industry projects..."
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bottom Feature Badge *</label>
                          <input 
                            type="text" 
                            name="bottom_badge" 
                            defaultValue={editingItem?.bottom_badge || ''} 
                            required 
                            placeholder="e.g. Live Projects"
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order (Sorting)</label>
                          <input 
                            type="number" 
                            name="display_order" 
                            defaultValue={editingItem ? editingItem.display_order : whyChooseUs.length + 1} 
                            required 
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                          <select 
                            name="is_active" 
                            defaultValue={editingItem ? String(editingItem.is_active) : 'true'} 
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                          >
                            <option value="true">Enabled / Active</option>
                            <option value="false">Disabled / Hidden</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* STUDENT JOURNEY FORM */}
                    {activeTab === 'student_journey' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Step Title *</label>
                            <input 
                              type="text" 
                              name="title" 
                              placeholder="e.g. Training & Skill Development"
                              defaultValue={editingItem?.title || ''} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lucide Icon *</label>
                            <select 
                              name="icon" 
                              defaultValue={editingItem?.icon || 'Milestone'} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="UserPlus">👤 UserPlus (Registration)</option>
                              <option value="BookOpen">📖 BookOpen (Training)</option>
                              <option value="Briefcase">💼 Briefcase (Internship)</option>
                              <option value="Terminal">💻 Terminal (Projects)</option>
                              <option value="Award">🏆 Award (Certification)</option>
                              <option value="TrendingUp">📈 TrendingUp (Placement)</option>
                              <option value="Compass">🧭 Compass (Guidance)</option>
                              <option value="Milestone">🏁 Milestone (General)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description / Subtitle *</label>
                          <textarea 
                            name="description" 
                            placeholder="Describe what the student achieves or does in this step."
                            defaultValue={editingItem?.description || ''} 
                            required 
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order</label>
                            <input 
                              type="number" 
                              name="display_order" 
                              defaultValue={editingItem ? editingItem.display_order : studentJourneySteps.length + 1} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                            <select 
                              name="is_active" 
                              defaultValue={editingItem ? String(editingItem.is_active) : 'true'} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="true">Active / Visible</option>
                              <option value="false">Disabled / Hidden</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INDUSTRY NETWORK FORM */}
                    {activeTab === 'industry_network' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
                            <input 
                              type="text" 
                              name="company_name" 
                              placeholder="e.g. Google"
                              defaultValue={editingItem?.company_name || ''} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                            <input 
                              type="url" 
                              name="website_url" 
                              placeholder="e.g. https://google.com"
                              defaultValue={editingItem?.website_url || ''} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Logo Image URL (SVG/PNG) *</label>
                          <input 
                            type="text" 
                            name="logo" 
                            placeholder="e.g. https://upload.wikimedia.org/.../Google_2015_logo.svg"
                            defaultValue={editingItem?.logo || ''} 
                            required 
                            className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                          />
                          <p className="text-[10px] text-slate-400">
                            Provide a transparent SVG or high-quality PNG logo URL.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order</label>
                            <input 
                              type="number" 
                              name="display_order" 
                              defaultValue={editingItem ? editingItem.display_order : industryPartners.length + 1} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                            <select 
                              name="is_active" 
                              defaultValue={editingItem ? String(editingItem.is_active) : 'true'} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="true">Active / Visible</option>
                              <option value="false">Disabled / Hidden</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PLACEMENT RECORD FORM */}
                    {activeTab === 'placements' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Student Name *</label>
                            <input 
                              type="text" 
                              name="student_name" 
                              placeholder="e.g. Preeti Sharma"
                              defaultValue={editingItem?.student_name || ''} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Role *</label>
                            <input 
                              type="text" 
                              name="job_role" 
                              placeholder="e.g. Full Stack Java Developer"
                              defaultValue={editingItem?.job_role || ''} 
                              required
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Degree *</label>
                            <input 
                              type="text" 
                              name="degree" 
                              placeholder="e.g. B.Tech (CSE)"
                              defaultValue={editingItem?.degree || ''} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Batch *</label>
                            <input 
                              type="text" 
                              name="batch" 
                              placeholder="e.g. 2024 Batch"
                              defaultValue={editingItem?.batch || ''} 
                              required
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
                            <select 
                              name="company_name"
                              defaultValue={editingItem?.company_name || 'IBM'}
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              {["Microsoft", "IBM", "Google", "Amazon", "Infosys", "TCS", "Accenture", "Cognizant", "Wipro", "Capgemini", "Oracle", "Cisco", "Dell Technologies", "HCLTech"].map(company => (
                                <option key={company} value={company}>{company}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Logo *</label>
                            <select 
                              name="company_logo"
                              defaultValue={editingItem?.company_logo || 'IBM'}
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              {["Microsoft", "IBM", "Google", "Amazon", "Infosys", "TCS", "Accenture", "Cognizant", "Wipro", "Capgemini", "Oracle", "Cisco", "Dell Technologies", "HCLTech"].map(company => (
                                <option key={company} value={company}>{company}</option>
                              ))}
                            </select>
                            <p className="text-[10px] text-slate-400">Select company to load the official SVG corporate logo automatically.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Package (LPA)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              name="package" 
                              placeholder="e.g. 12.4"
                              defaultValue={editingItem?.package || ''} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Show Package?</label>
                            <select 
                              name="show_package"
                              defaultValue={editingItem ? String(editingItem.show_package) : 'true'}
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="true">Show Package</option>
                              <option value="false">Hide Package</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Placement Badge</label>
                            <input 
                              type="text" 
                              name="placement_badge" 
                              placeholder="e.g. Placed at IBM"
                              defaultValue={editingItem?.placement_badge || ''} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                            <p className="text-[10px] text-slate-400">Leave blank to default to "Placed at Company Name"</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Order</label>
                            <input 
                              type="number" 
                              name="display_order" 
                              defaultValue={editingItem ? editingItem.display_order : adminPlacements.length + 1} 
                              required 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white" 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                            <select 
                              name="is_active" 
                              defaultValue={editingItem ? String(editingItem.is_active) : 'true'} 
                              className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            >
                              <option value="true">Active / Visible</option>
                              <option value="false">Disabled / Hidden</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <ImageDropzone 
                            label="Student Profile Photo (Recommended transparent / headshot)" 
                            value={uploadedImageUrl || editingItem?.photo || ''} 
                            onChange={setUploadedImageUrl} 
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t dark:border-slate-850">
                      <button 
                        type="button" 
                        onClick={handleCloseForm}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                      >
                        <Save size={14} />
                        Save Record Details
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                  
                  {/* ==========================================
                      DATA LIST VIEW FOR EACH TAB
                      ========================================== */}
                  {activeTab === 'hero' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {heroSlides.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No Hero slides matching. Click "Add New" to get started.</div>
                      ) : (
                        paginate(heroSlides).map((slide) => (
                          <div key={slide.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <img src={slide.imageUrl} alt={slide.title} className="w-24 h-16 object-cover rounded-xl border" referrerPolicy="no-referrer" />
                              <div className="space-y-1">
                                <span className="text-[9px] bg-blue-500/15 text-blue-500 font-bold px-2 py-0.5 rounded">Order: {slide.order}</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{slide.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-1">{slide.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(slide); setUploadedImageUrl(slide.imageUrl); }}
                                className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this Hero slide?")) {
                                    const filtered = heroSlides.filter(s => s.id !== slide.id);
                                    await db.saveHeroSlides(filtered);
                                    toast('Hero banner slide removed.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'about' && about && (
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border dark:border-slate-850 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Company Brochure Overview</h4>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              about.is_active 
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
                            }`}>
                              {about.is_active ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                          <button 
                            onClick={() => { setEditingItem(about); setUploadedImageUrl(about.image); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1.5 px-3 rounded text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <Edit size={12} />
                            Edit Details
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                          <div className="md:col-span-1 space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Brochure Cover Image</p>
                            <div className="border dark:border-slate-800 p-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
                              <img src={about.image} alt="Brochure preview" referrerPolicy="no-referrer" className="w-full h-44 object-cover rounded-lg" />
                            </div>
                          </div>
                          <div className="md:col-span-2 space-y-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Section Title</p>
                              <div className="flex items-center gap-3">
                                <span className="h-[2px] w-6 bg-emerald-500 rounded-full" />
                                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">{about.title}</p>
                                <span className="h-[2px] w-6 bg-emerald-500 rounded-full" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Official Brochure Text</p>
                              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 whitespace-pre-line leading-relaxed text-justify max-h-56 overflow-y-auto bg-white dark:bg-slate-900/60 p-3 rounded-xl border dark:border-slate-800/80">
                                {about.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 text-blue-700 dark:text-blue-300 text-xs rounded-xl flex items-center gap-2 border border-blue-100 dark:border-blue-900/30">
                        <span className="text-sm">💡</span>
                        <span>Drag and drop any service item below, or use the <strong>Up/Down arrows</strong> to change their layout order. Click the status badge to quickly enable or disable any service.</span>
                      </div>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                        {services.length === 0 ? (
                          <div className="p-16 text-center text-slate-400">No Services found. Click "Add New" to list.</div>
                        ) : (
                          [...services].sort((a, b) => (a.order || 0) - (b.order || 0)).map((srv, idx) => {
                            const isFirst = idx === 0;
                            const isLast = idx === services.length - 1;
                            
                            return (
                              <div 
                                key={srv.id} 
                                draggable
                                onDragStart={(e) => {
                                  setDraggedServiceIndex(idx);
                                  e.dataTransfer.effectAllowed = 'move';
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                }}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  if (draggedServiceIndex === null || draggedServiceIndex === idx) return;
                                  
                                  const list = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));
                                  const [removed] = list.splice(draggedServiceIndex, 1);
                                  list.splice(idx, 0, removed);
                                  
                                  const updated = list.map((item, index) => ({
                                    ...item,
                                    order: index + 1
                                  }));
                                  
                                  setServices(updated);
                                  setDraggedServiceIndex(null);
                                  
                                  for (const item of updated) {
                                    await db.saveService(item);
                                  }
                                  toast('Services order updated.', 'success');
                                }}
                                className={`p-5 flex flex-col sm:flex-row items-center gap-4 justify-between transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-950/20 ${draggedServiceIndex === idx ? 'opacity-40 bg-slate-100 dark:bg-slate-950' : ''}`}
                              >
                                <div className="flex items-center gap-4 flex-1 w-full">
                                  {/* Drag Handle */}
                                  <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                                    <GripVertical size={16} />
                                  </div>
                                  
                                  <img src={srv.imageUrl} alt={srv.title} className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" referrerPolicy="no-referrer" />
                                  
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">{srv.title}</h4>
                                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">Order: {srv.order || idx + 1}</span>
                                      
                                      {/* Quick Toggle Status Badge */}
                                      <button
                                        onClick={async () => {
                                          const updatedSrv = { ...srv, isActive: srv.isActive === false ? true : false };
                                          const updatedList = services.map(s => s.id === srv.id ? updatedSrv : s);
                                          setServices(updatedList);
                                          await db.saveService(updatedSrv);
                                          toast(`Service "${srv.title}" ${updatedSrv.isActive ? 'enabled' : 'disabled'}.`, 'success');
                                        }}
                                        className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all hover:scale-105 active:scale-95 ${srv.isActive !== false ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25' : 'bg-rose-500/15 text-rose-600 hover:bg-rose-500/25'}`}
                                        title="Click to toggle status"
                                      >
                                        {srv.isActive !== false ? '● Active' : '○ Disabled'}
                                      </button>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{srv.description}</p>
                                    <div className="flex gap-2 text-[10px] text-slate-400">
                                      <span>Icon: {srv.icon}</span>
                                      <span>•</span>
                                      <span>Features: {srv.features?.length || 0}</span>
                                      <span>•</span>
                                      <span>Benefits: {srv.benefits?.length || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  {/* Manual Reordering Arrows */}
                                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 p-0.5">
                                    <button
                                      disabled={isFirst}
                                      onClick={async () => {
                                        if (isFirst) return;
                                        const list = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));
                                        const temp = list[idx - 1];
                                        list[idx - 1] = list[idx];
                                        list[idx] = temp;
                                        
                                        const updated = list.map((item, index) => ({
                                          ...item,
                                          order: index + 1
                                        }));
                                        
                                        setServices(updated);
                                        for (const item of updated) {
                                          await db.saveService(item);
                                        }
                                        toast('Service moved up.', 'success');
                                      }}
                                      className={`p-1.5 rounded-lg transition-colors ${isFirst ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                      title="Move Up"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      disabled={isLast}
                                      onClick={async () => {
                                        if (isLast) return;
                                        const list = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));
                                        const temp = list[idx + 1];
                                        list[idx + 1] = list[idx];
                                        list[idx] = temp;
                                        
                                        const updated = list.map((item, index) => ({
                                          ...item,
                                          order: index + 1
                                        }));
                                        
                                        setServices(updated);
                                        for (const item of updated) {
                                          await db.saveService(item);
                                        }
                                        toast('Service moved down.', 'success');
                                      }}
                                      className={`p-1.5 rounded-lg transition-colors ${isLast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                      title="Move Down"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                  
                                  <button 
                                    onClick={() => { setEditingItem(srv); setUploadedImageUrl(srv.imageUrl); }}
                                    className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-800"
                                    title="Edit Service"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm(`Are you sure you want to delete service "${srv.title}"?`)) {
                                        await db.deleteService(srv.id);
                                        toast('Service listing deleted.', 'info');
                                        loadData();
                                      }
                                    }}
                                    className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-xl text-red-500 transition-colors border border-red-100 dark:border-red-900/30"
                                    title="Delete Service"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'internships' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {internships.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No internship tracks. Click "Add New" to customize.</div>
                      ) : (
                        paginate(internships).map((track, idx) => {
                          const isFirst = currentPage === 1 && idx === 0;
                          const isLast = (currentPage - 1) * itemsPerPage + idx === internships.length - 1;
                          return (
                            <div key={track.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <img src={track.bannerUrl} alt={track.title} className="w-20 h-14 object-cover rounded-xl border" referrerPolicy="no-referrer" />
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{track.title}</h4>
                                    <span className="text-[9px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded">{track.mode}</span>
                                    {track.isActive ? (
                                      <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1.5 rounded font-bold uppercase">Active</span>
                                    ) : (
                                      <span className="text-[8px] bg-slate-500/10 text-slate-500 px-1.5 rounded font-bold uppercase">Disabled</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 font-bold">{track.duration} &bull; Tech: {track.technology} &bull; Order: {track.order ?? 0}</p>
                                  <p className="text-xs text-emerald-600 font-extrabold">₹{track.discountPrice || track.price}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Reordering Buttons */}
                                <div className="flex items-center gap-1 mr-2 border-r border-slate-200 dark:border-slate-800 pr-2">
                                  <button
                                    onClick={() => handleReorderInternship(track.id, 'up')}
                                    disabled={isFirst}
                                    className={`p-1.5 rounded-lg transition-colors ${isFirst ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleReorderInternship(track.id, 'down')}
                                    disabled={isLast}
                                    className={`p-1.5 rounded-lg transition-colors ${isLast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <button 
                                  onClick={() => { setEditingItem(track); setUploadedImageUrl(track.bannerUrl); }}
                                  className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Remove training track: "${track.title}"?`)) {
                                      await db.deleteInternship(track.id);
                                      toast('Internship program track deleted.', 'info');
                                      loadData();
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-xl text-red-500 border border-red-100 dark:border-red-900/30"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeTab === 'courses' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {courses.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No enterprise courses configured.</div>
                      ) : (
                        paginate(courses).map((course, idx) => {
                          const isFirst = currentPage === 1 && idx === 0;
                          const isLast = (currentPage - 1) * itemsPerPage + idx === courses.length - 1;
                          return (
                            <div key={course.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{course.title}</h4>
                                  <span className="text-[8px] bg-blue-500/10 text-blue-600 px-2 rounded font-bold">{course.mode}</span>
                                  {course.isActive ? (
                                    <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1.5 rounded font-bold uppercase">Active</span>
                                  ) : (
                                    <span className="text-[8px] bg-slate-500/10 text-slate-500 px-1.5 rounded font-bold uppercase">Disabled</span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400">Category: {course.category} &bull; Duration: {course.duration} &bull; Order: {course.order ?? 0}</p>
                                <p className="text-xs text-emerald-600 font-bold">Standard Price: ₹{course.price}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Reordering Buttons */}
                                <div className="flex items-center gap-1 mr-2 border-r border-slate-200 dark:border-slate-800 pr-2">
                                  <button
                                    onClick={() => handleReorderCourse(course.id, 'up')}
                                    disabled={isFirst}
                                    className={`p-1.5 rounded-lg transition-colors ${isFirst ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleReorderCourse(course.id, 'down')}
                                    disabled={isLast}
                                    className={`p-1.5 rounded-lg transition-colors ${isLast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <button 
                                  onClick={() => { setEditingItem(course); setUploadedImageUrl(course.bannerUrl || ''); }}
                                  className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Delete course: "${course.title}"?`)) {
                                      await db.deleteCourse(course.id);
                                      toast('Enterprise course deleted.', 'info');
                                      loadData();
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-xl text-red-500 border border-red-100 dark:border-red-900/30"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeTab === 'programs' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 animate-fade-in">
                      {(() => {
                        const filtered = programs.filter(p => {
                          const matchesSearch = !searchQuery || 
                            p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesCategory = filterCategory === 'All' || p.mode === filterCategory;
                          return matchesSearch && matchesCategory;
                        });
                        return filtered.length === 0 ? (
                          <div className="p-16 text-center text-slate-400">No programs found matching the search criteria.</div>
                        ) : (
                          paginate(filtered).map((prog, idx) => {
                            const isFirst = currentPage === 1 && idx === 0;
                            const isLast = (currentPage - 1) * itemsPerPage + idx === filtered.length - 1;
                            return (
                              <div key={prog.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <img src={prog.cover_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100'} alt={prog.title} className="w-20 h-14 object-cover rounded-xl border" referrerPolicy="no-referrer" />
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{prog.title}</h4>
                                      <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 rounded font-bold">{prog.mode}</span>
                                      {prog.is_active ? (
                                        <span className="text-[8px] bg-blue-500/10 text-blue-500 px-1.5 rounded font-bold uppercase">Active</span>
                                      ) : (
                                        <span className="text-[8px] bg-slate-500/10 text-slate-500 px-1.5 rounded font-bold uppercase">Disabled</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-450 dark:text-slate-400 font-medium">Category: {prog.category} &bull; Duration: {prog.duration} &bull; Order: {prog.display_order ?? 0}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {prog.badges?.map((badge, bidx) => (
                                        <span key={bidx} className="text-[7.5px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-450 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-slate-800/60 font-semibold">{badge}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/* Reordering Buttons */}
                                  <div className="flex items-center gap-1 mr-2 border-r border-slate-200 dark:border-slate-800 pr-2">
                                    <button
                                      onClick={() => handleReorderProgram(prog.id, 'up')}
                                      disabled={isFirst}
                                      className={`p-1.5 rounded-lg transition-colors ${isFirst ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                      title="Move Up"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleReorderProgram(prog.id, 'down')}
                                      disabled={isLast}
                                      className={`p-1.5 rounded-lg transition-colors ${isLast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                      title="Move Down"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                  <button 
                                    onClick={() => { setEditingItem(prog); setUploadedImageUrl(prog.cover_image || ''); }}
                                    className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      if (confirm(`Delete program: "${prog.title}"?`)) {
                                        await db.deleteProgram(prog.id);
                                        toast('Program listing deleted successfully.', 'info');
                                        loadData();
                                      }
                                    }}
                                    className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 rounded-xl text-red-500 border border-red-100 dark:border-red-900/30"
                                  >
                                    <Trash size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        );
                      })()}
                    </div>
                  )}

                  {activeTab === 'gallery' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                      {galleryItems.length === 0 ? (
                        <div className="col-span-full p-12 text-center text-slate-400">Gallery is empty. Click "Add New" to upload photos.</div>
                      ) : (
                        paginate(galleryItems).map((itm) => (
                          <div key={itm.id} className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden relative group/gal bg-slate-50/50 dark:bg-slate-950/20">
                            {itm.type === 'image' ? (
                              <img src={itm.url} alt={itm.title} className="w-full h-36 object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-36 bg-slate-900 flex items-center justify-center text-white relative">
                                <PlayCircle size={32} className="text-emerald-500" />
                                <span className="absolute bottom-2 right-2 text-[8px] bg-black/60 px-2 py-0.5 rounded font-bold uppercase">Video Link</span>
                              </div>
                            )}
                            <div className="p-4 space-y-1">
                              <span className="text-[8px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase">{itm.category}</span>
                              <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">{itm.title}</h4>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/gal:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditingItem(itm); setUploadedImageUrl(itm.type === 'image' ? itm.url : ''); }}
                                className="p-1 bg-white text-slate-800 rounded shadow"
                              >
                                <Edit size={12} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Remove gallery item "${itm.title}"?`)) {
                                    await db.deleteGalleryItem(itm.id);
                                    toast('Media item removed.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-1 bg-red-600 text-white rounded shadow"
                              >
                                <Trash size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'blogs' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {blogs.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No blog posts found.</div>
                      ) : (
                        paginate(blogs).map((post) => (
                          <div key={post.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <img src={post.imageUrl} alt={post.title} className="w-20 h-14 object-cover rounded-xl border" referrerPolicy="no-referrer" />
                              <div className="space-y-0.5">
                                <span className="text-[8px] bg-emerald-500/15 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase">{post.category}</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{post.title}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold">Author: {post.author} &bull; Date: {new Date(post.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(post); setUploadedImageUrl(post.imageUrl); }}
                                className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Delete article: "${post.title}"?`)) {
                                    await db.deleteBlogPost(post.id);
                                    toast('Blog post deleted.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'articles' && (
                    <div className="space-y-8">
                      {/* 1. DYNAMIC STATISTICS GRID */}
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border dark:border-slate-800 space-y-4">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <Layers className="text-emerald-500" size={16} />
                          Live Statistics Configuration Bar
                        </h3>
                        <p className="text-[11px] text-slate-400">These 5 statistics are displayed at the bottom of the Tech Insights section in real-time.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          {adminStats.sort((a,b) => a.display_order - b.display_order).map((stat) => (
                            <div key={stat.id} className="bg-white dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-850 space-y-2 shadow-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">Stat {stat.display_order}</span>
                                <LucideIcon name={stat.icon} size={14} className="text-slate-400" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Label</label>
                                <input 
                                  type="text" 
                                  defaultValue={stat.label} 
                                  onBlur={async (e) => {
                                    const val = e.target.value;
                                    if (val && val !== stat.label) {
                                      await db.saveArticleStatistic({ ...stat, label: val });
                                      toast('Statistic label updated.', 'success');
                                      loadData();
                                    }
                                  }}
                                  className="w-full bg-slate-50 dark:bg-slate-900 p-1.5 rounded text-[11px] text-slate-800 dark:text-slate-200"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Value</label>
                                <input 
                                  type="text" 
                                  defaultValue={stat.value} 
                                  onBlur={async (e) => {
                                    const val = e.target.value;
                                    if (val && val !== stat.value) {
                                      await db.saveArticleStatistic({ ...stat, value: val });
                                      toast('Statistic value updated.', 'success');
                                      loadData();
                                    }
                                  }}
                                  className="w-full bg-slate-50 dark:bg-slate-900 p-1.5 rounded text-[11px] text-slate-850 dark:text-slate-200 font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 block">Icon Name</label>
                                <input 
                                  type="text" 
                                  defaultValue={stat.icon} 
                                  onBlur={async (e) => {
                                    const val = e.target.value;
                                    if (val && val !== stat.icon) {
                                      await db.saveArticleStatistic({ ...stat, icon: val });
                                      toast('Statistic icon updated.', 'success');
                                      loadData();
                                    }
                                  }}
                                  className="w-full bg-slate-50 dark:bg-slate-900 p-1.5 rounded text-[11px] font-mono text-slate-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. MAIN LAYOUT: CATEGORIES & ARTICLES */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* CATEGORY MANAGER COLUMN */}
                        <div className="lg:col-span-4 space-y-4">
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border dark:border-slate-800 space-y-4">
                            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                              Category Manager
                            </h3>
                            
                            {/* Create New Category Form */}
                            <form 
                              onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const fd = new FormData(form);
                                const name = fd.get('name') as string;
                                const icon = fd.get('icon') as string || 'Layers';
                                
                                if (!name) return;
                                await db.saveArticleCategory({
                                  id: 'cat_' + Date.now(),
                                  name,
                                  icon,
                                  display_order: adminCategories.length + 1
                                });
                                toast('New article category created.', 'success');
                                form.reset();
                                loadData();
                              }}
                              className="bg-white dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-850 space-y-3 shadow-sm"
                            >
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">Category Name</label>
                                <input type="text" name="name" required placeholder="e.g. Cybersecurity" className="w-full bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs text-slate-900 dark:text-white" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 block">Icon Class (from Lucide)</label>
                                <input type="text" name="icon" defaultValue="Layers" placeholder="Layers, Award, Globe, etc." className="w-full bg-slate-50 dark:bg-slate-900 p-2 rounded text-xs text-slate-900 dark:text-white" />
                              </div>
                              <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                                <Plus size={13} />
                                Add Category
                              </button>
                            </form>

                            {/* List of Existing Categories */}
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                              {adminCategories.sort((a,b) => a.display_order - b.display_order).map((cat) => (
                                <div key={cat.id} className="bg-white dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-850 flex items-center justify-between shadow-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                                      <LucideIcon name={cat.icon} size={13} className="text-emerald-500" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                                  </div>
                                  <button 
                                    onClick={async () => {
                                      if (adminCategories.length <= 1) {
                                        toast('Must retain at least one category.', 'warning');
                                        return;
                                      }
                                      if (confirm(`Remove category: "${cat.name}"? Articles using this category will still exist but should be re-assigned.`)) {
                                        await db.deleteArticleCategory(cat.id);
                                        toast('Category deleted.', 'info');
                                        loadData();
                                      }
                                    }}
                                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-red-500 transition-colors"
                                    title="Delete category"
                                  >
                                    <Trash size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ARTICLES LIST COLUMN */}
                        <div className="lg:col-span-8">
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            {adminArticles.length === 0 ? (
                              <div className="p-16 text-center text-slate-400">
                                No technical articles found. Click "Add New Record" at the top to write your first article.
                              </div>
                            ) : (
                              paginate(adminArticles).map((article, idx) => {
                                const isFirst = (currentPage - 1) * itemsPerPage + idx === 0;
                                const isLast = (currentPage - 1) * itemsPerPage + idx === adminArticles.length - 1;
                                
                                return (
                                  <div key={article.id} className="p-5 flex flex-col sm:flex-row items-center gap-5 justify-between hover:bg-slate-50/50 dark:hover:bg-slate-950/25 transition-colors">
                                    <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                                      <img 
                                        src={article.cover_image} 
                                        alt={article.title} 
                                        className="w-20 h-14 object-cover rounded-xl border shrink-0 bg-slate-100" 
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-[8px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase">
                                            {article.category}
                                          </span>
                                          {article.is_active ? (
                                            <span className="text-[8px] bg-blue-500/10 text-blue-600 font-bold px-2 py-0.5 rounded uppercase">
                                              Active
                                            </span>
                                          ) : (
                                            <span className="text-[8px] bg-slate-500/10 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                                              Draft
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                                          {article.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 font-medium truncate">
                                          By {article.author_name} &bull; {article.read_time}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 shrink-0">
                                      {/* Reorder Buttons */}
                                      <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2">
                                        <button
                                          onClick={() => handleReorderArticle(article.id, 'up')}
                                          disabled={isFirst}
                                          className={`p-1.5 rounded-lg transition-colors ${isFirst ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                          title="Move Up"
                                        >
                                          <ArrowUp size={12} />
                                        </button>
                                        <button
                                          onClick={() => handleReorderArticle(article.id, 'down')}
                                          disabled={isLast}
                                          className={`p-1.5 rounded-lg transition-colors ${isLast ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                          title="Move Down"
                                        >
                                          <ArrowDown size={12} />
                                        </button>
                                      </div>

                                      {/* Status Toggle Button */}
                                      <button
                                        onClick={async () => {
                                          const nextActive = !article.is_active;
                                          await db.saveArticle({ ...article, is_active: nextActive });
                                          toast(`Article status changed to ${nextActive ? 'Active' : 'Draft'}.`, 'success');
                                          loadData();
                                        }}
                                        className={`p-2 rounded-xl border transition-all ${
                                          article.is_active 
                                            ? 'bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-600' 
                                            : 'bg-slate-50 hover:bg-slate-100 border-slate-250 text-slate-500'
                                        }`}
                                        title={article.is_active ? "Switch to Draft" : "Switch to Active"}
                                      >
                                        <Eye size={14} />
                                      </button>

                                      <button 
                                        onClick={() => { setEditingItem(article); setUploadedImageUrl(article.cover_image); }}
                                        className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300 border dark:border-slate-800"
                                      >
                                        <Edit size={14} />
                                      </button>
                                      <button 
                                        onClick={async () => {
                                          if (confirm(`Remove dynamic tech article: "${article.title}"?`)) {
                                            await db.deleteArticle(article.id);
                                            toast('Dynamic tech article deleted.', 'info');
                                            loadData();
                                          }
                                        }}
                                        className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 border border-red-100"
                                      >
                                        <Trash size={14} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'team' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {team.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">Team is empty. Click "Add New" to customize.</div>
                      ) : (
                        paginate(team).map((member) => (
                          <div key={member.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <img src={member.photoUrl} alt={member.name} className="w-14 h-14 object-cover rounded-full border ring-2 ring-emerald-500/10" referrerPolicy="no-referrer" />
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{member.name}</h4>
                                <p className="text-xs text-emerald-600 font-bold">{member.designation}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(member); setUploadedImageUrl(member.photoUrl); }}
                                className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Remove member: "${member.name}"?`)) {
                                    await db.deleteTeamMember(member.id);
                                    toast('Team member deleted.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'testimonials' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {testimonials.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No reviews configured.</div>
                      ) : (
                        paginate(testimonials).map((test) => (
                          <div key={test.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <img src={test.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} alt={test.name} className="w-12 h-12 object-cover rounded-full border" referrerPolicy="no-referrer" />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{test.name}</h4>
                                  <span className="text-[8px] bg-blue-500/10 text-blue-600 px-2 rounded-full font-bold uppercase">{test.type}</span>
                                </div>
                                <p className="text-xs text-slate-400">{test.companyOrCollege}</p>
                                <p className="text-xs text-slate-500 italic">"{test.text}"</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(test); setUploadedImageUrl(test.avatarUrl || ''); }}
                                className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Delete review from "${test.name}"?`)) {
                                    await db.deleteTestimonial(test.id);
                                    toast('Testimonial feed entry deleted.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'careers' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {jobs.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No dynamic careers listings configured.</div>
                      ) : (
                        paginate(jobs).map((job) => (
                          <div key={job.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{job.title}</h4>
                                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${job.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                                  {job.isActive ? 'Hiring' : 'On Hold'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">Dept: {job.department} &bull; Loc: {job.location} &bull; Type: {job.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(job); }}
                                className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Remove job listing: "${job.title}"?`)) {
                                    await db.deleteJob(job.id);
                                    toast('Careers listing item removed.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {applications.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">No applications logs recorded.</div>
                      ) : (
                        paginate(applications).map((app) => (
                          <div key={app.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5 flex-1 text-xs">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.fullName}</h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                                  app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                                  app.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                                }`}>{app.status}</span>
                              </div>
                              <p className="text-slate-500 font-bold">Applying For: <span className="text-emerald-500 font-extrabold">{app.jobTitle}</span></p>
                              <p className="text-slate-400">Email: {app.email} &bull; Phone: {app.phone} &bull; Experience: {app.experienceYears} Years</p>
                              {app.coverLetter && <p className="italic text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 p-2 rounded">"{app.coverLetter}"</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              <select 
                                value={app.status}
                                onChange={async (e) => {
                                  await db.updateApplicationStatus(app.id, e.target.value as any);
                                  toast(`Applicant status marked as ${e.target.value}`, 'success');
                                  loadData();
                                }}
                                className="bg-slate-50 dark:bg-slate-800 border p-2 rounded text-xs text-slate-700 dark:text-slate-100"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                              </select>

                              <button 
                                onClick={async () => {
                                  if (confirm("Delete this candidate application log?")) {
                                    await (db as any).deleteApplication(app.id);
                                    toast('Application record cleared.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'contacts' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {messages.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">Inbox is empty. No inquiries recorded yet.</div>
                      ) : (
                        paginate(messages).map((msg) => (
                          <div key={msg.id} className="p-6 text-xs space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</h4>
                                  {!msg.isRead && (
                                    <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded font-bold animate-pulse">New</span>
                                  )}
                                </div>
                                <p className="text-slate-400 font-semibold">{msg.email} &bull; {msg.phone}</p>
                              </div>
                              <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-850">
                              <p className="font-bold text-slate-850 dark:text-slate-200">Subject: "{msg.subject}"</p>
                              <p className="text-slate-500 mt-1">{msg.message}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {!msg.isRead && (
                                <button 
                                  onClick={async () => {
                                    await db.markContactMessageRead(msg.id);
                                    toast('Message marked as read.', 'success');
                                    loadData();
                                  }}
                                  className="bg-emerald-600 text-white font-bold p-1 px-3 rounded hover:bg-emerald-500"
                                >
                                  Mark Read
                                </button>
                              )}
                              
                              <button 
                                onClick={() => {
                                  setReplyingMessage(msg);
                                  setReplyText('');
                                }}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold p-1 px-3 rounded flex items-center gap-1"
                              >
                                <Send size={12} />
                                Send Reply
                              </button>

                              <button 
                                onClick={async () => {
                                  if (confirm("Delete this inquiry from records?")) {
                                    await (db as any).deleteContactMessage(msg.id);
                                    toast('Contact message log deleted.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-1 px-2.5 rounded text-red-500 hover:bg-red-50"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'faqs' && (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {faqs.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">FAQs is empty. Add new questions.</div>
                      ) : (
                        paginate(faqs).map((faq) => (
                          <div key={faq.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex-1 space-y-1">
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded font-bold uppercase">{faq.category}</span>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Q: {faq.question}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">A: {faq.answer}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { setEditingItem(faq); }}
                                className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm(`Remove dynamic FAQ: "${faq.question}"?`)) {
                                    await db.deleteFaq(faq.id);
                                    toast('Dynamic FAQ deleted.', 'info');
                                    loadData();
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'why_choose_us' && (
                    <div className="space-y-6">
                      {/* Section Title Customizer */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/85 space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Section Configuration
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-3 items-end">
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Section Title</label>
                            <input 
                              type="text" 
                              value={settings?.whyChooseUsTitle || 'Why Choose Us?'} 
                              onChange={async (e) => {
                                const newTitle = e.target.value;
                                if (settings) {
                                  const updatedSettings = { ...settings, whyChooseUsTitle: newTitle };
                                  setSettings(updatedSettings);
                                  await db.updateSettings(updatedSettings);
                                }
                              }}
                              className="w-full bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm">
                            <Check size={14} />
                            Saved Instantly
                          </div>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {whyChooseUs.length === 0 ? (
                          <div className="p-16 text-center text-slate-400">"Why Choose Us" is empty. Add new features.</div>
                        ) : (
                          [...whyChooseUs].sort((a, b) => a.display_order - b.display_order).map((item, index, arr) => (
                            <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0 border dark:border-slate-800">
                                  <LucideIcon name={item.icon} size={20} className="text-blue-500" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                      {item.title}
                                    </h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                      item.is_active 
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
                                    }`}>
                                      {item.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 max-w-lg leading-snug">
                                    {item.description || 'No description provided.'}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {item.bottom_badge && (
                                      <span className="inline-block text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100/40 dark:border-blue-900/30 px-2 py-0.5 rounded-full font-bold">
                                        Badge: {item.bottom_badge}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      Order: {item.display_order} • Icon: {item.icon}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Order up / down buttons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={async () => {
                                      if (index === 0) return;
                                      const prevItem = arr[index - 1];
                                      const oldOrder = item.display_order;
                                      item.display_order = prevItem.display_order;
                                      prevItem.display_order = oldOrder;
                                      await db.saveWhyChooseUsOrder([...whyChooseUs]);
                                      loadData();
                                    }}
                                    disabled={index === 0}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (index === arr.length - 1) return;
                                      const nextItem = arr[index + 1];
                                      const oldOrder = item.display_order;
                                      item.display_order = nextItem.display_order;
                                      nextItem.display_order = oldOrder;
                                      await db.saveWhyChooseUsOrder([...whyChooseUs]);
                                      loadData();
                                    }}
                                    disabled={index === arr.length - 1}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                                {/* Edit and Delete */}
                                <button 
                                  onClick={() => { setEditingItem(item); }}
                                  className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Remove dynamic "Why Choose Us" feature: "${item.title}"?`)) {
                                      await db.deleteWhyChooseUsItem(item.id);
                                      toast('Feature deleted successfully.', 'info');
                                      loadData();
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                                  title="Delete"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'student_journey' && (
                    <div className="space-y-6">
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {studentJourneySteps.length === 0 ? (
                          <div className="p-16 text-center text-slate-400">Student Success Journey is empty. Add a new step.</div>
                        ) : (
                          [...studentJourneySteps].sort((a, b) => a.display_order - b.display_order).map((item, index, arr) => (
                            <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0 border dark:border-slate-800 text-blue-500">
                                  <LucideIcon name={item.icon} size={20} />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                      {item.title}
                                    </h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                      item.is_active 
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
                                    }`}>
                                      {item.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                                    {item.description}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    Display Order: {item.display_order} &bull; Icon: {item.icon}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={async () => {
                                      if (index === 0) return;
                                      const prevItem = arr[index - 1];
                                      const oldOrder = item.display_order;
                                      item.display_order = prevItem.display_order;
                                      prevItem.display_order = oldOrder;
                                      await db.saveStudentJourneyStepOrder([...studentJourneySteps]);
                                      loadData();
                                    }}
                                    disabled={index === 0}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (index === arr.length - 1) return;
                                      const nextItem = arr[index + 1];
                                      const oldOrder = item.display_order;
                                      item.display_order = nextItem.display_order;
                                      nextItem.display_order = oldOrder;
                                      await db.saveStudentJourneyStepOrder([...studentJourneySteps]);
                                      loadData();
                                    }}
                                    disabled={index === arr.length - 1}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                                <button 
                                  onClick={() => { setEditingItem(item); }}
                                  className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Remove student success step: "${item.title}"?`)) {
                                      await db.deleteStudentJourneyStep(item.id);
                                      toast('Step deleted successfully.', 'info');
                                      loadData();
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                                  title="Delete"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'industry_network' && (
                    <div className="space-y-6">
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {industryPartners.length === 0 ? (
                          <div className="p-16 text-center text-slate-400">Industry Network is empty. Add a new company.</div>
                        ) : (
                          paginate([...industryPartners].sort((a, b) => a.display_order - b.display_order)).map((item, index, arr) => (
                            <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center shrink-0 border dark:border-slate-800 p-2">
                                  {renderPartnerLogo(item, "max-h-full max-w-full object-contain")}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                      {item.company_name}
                                    </h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                      item.is_active 
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
                                    }`}>
                                      {item.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                  </div>
                                  {item.website_url && (
                                    <p className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-medium">
                                      <Globe size={12} />
                                      <a href={item.website_url} target="_blank" rel="noopener noreferrer">
                                        {item.website_url}
                                      </a>
                                    </p>
                                  )}
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    Display Order: {item.display_order}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={async () => {
                                      if (index === 0) return;
                                      const prevItem = arr[index - 1];
                                      const oldOrder = item.display_order;
                                      item.display_order = prevItem.display_order;
                                      prevItem.display_order = oldOrder;
                                      await db.saveIndustryPartnerOrder([...industryPartners]);
                                      loadData();
                                    }}
                                    disabled={index === 0}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (index === arr.length - 1) return;
                                      const nextItem = arr[index + 1];
                                      const oldOrder = item.display_order;
                                      item.display_order = nextItem.display_order;
                                      nextItem.display_order = oldOrder;
                                      await db.saveIndustryPartnerOrder([...industryPartners]);
                                      loadData();
                                    }}
                                    disabled={index === arr.length - 1}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                                <button 
                                  onClick={() => { setEditingItem(item); }}
                                  className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Remove company: "${item.company_name}"?`)) {
                                      await db.deleteIndustryPartner(item.id);
                                      toast('Company deleted successfully.', 'info');
                                      loadData();
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                                  title="Delete"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'placements' && (
                    <div className="space-y-6">
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {adminPlacements.length === 0 ? (
                          <div className="p-16 text-center text-slate-400">No placements recorded yet. Add your first student record!</div>
                        ) : (
                          paginate([...adminPlacements].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))).map((item, index, arr) => (
                            <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                {item.photo ? (
                                  <img 
                                    src={item.photo} 
                                    alt={item.student_name} 
                                    className="w-16 h-16 rounded-xl object-cover shrink-0 border dark:border-slate-800" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border dark:border-slate-800">
                                    <GraduationCap className="text-slate-400" size={24} />
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                      {item.student_name}
                                    </h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                      item.is_active 
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
                                    }`}>
                                      {item.is_active ? 'Active' : 'Disabled'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    {item.job_role} • {item.degree} ({item.batch})
                                  </p>
                                  <div className="flex items-center gap-2 pt-0.5">
                                    <CompanyLogo name={item.company_logo} className="h-4 w-auto text-slate-700 dark:text-slate-300" />
                                    {item.package && (
                                      <span className="text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-bold px-1.5 py-0.5 rounded">
                                        {item.package} LPA {item.show_package ? '' : '(Hidden)'}
                                      </span>
                                    )}
                                    {item.placement_badge && (
                                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                                        {item.placement_badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-mono pt-1">
                                    Display Order: {item.display_order}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleReorderPlacement(item.id, 'up')}
                                    disabled={index === 0}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleReorderPlacement(item.id, 'down')}
                                    disabled={index === arr.length - 1}
                                    className="p-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

                                <button 
                                  onClick={() => { setEditingItem(item); setUploadedImageUrl(item.photo); }}
                                  className="p-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 rounded-xl text-slate-600 dark:text-slate-300"
                                  title="Edit"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Remove placement record for student "${item.student_name}"?`)) {
                                      await db.deletePlacement(item.id);
                                      toast('Placement record deleted successfully.', 'info');
                                      loadData();
                                    }
                                  }}
                                  className="p-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-500"
                                  title="Delete"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Simple Pagination controls */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                    <span className="text-slate-500">Page {currentPage} of records list</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 px-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 disabled:opacity-50"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={
                          (activeTab === 'hero' && heroSlides.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'services' && services.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'internships' && internships.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'courses' && courses.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'programs' && programs.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'gallery' && galleryItems.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'blogs' && blogs.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'articles' && adminArticles.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'team' && team.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'testimonials' && testimonials.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'careers' && jobs.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'applications' && applications.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'contacts' && messages.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'faqs' && faqs.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'why_choose_us' && whyChooseUs.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'student_journey' && studentJourneySteps.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'industry_network' && industryPartners.length <= currentPage * itemsPerPage) ||
                          (activeTab === 'placements' && adminPlacements.length <= currentPage * itemsPerPage)
                        }
                        className="p-2 px-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 disabled:opacity-50"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* REPLY MODAL INBOX POPUP */}
      {replyingMessage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                <Send className="text-emerald-500" size={16} />
                Send Inquiry Reply E-Mail
              </h3>
              <button onClick={() => setReplyingMessage(null)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <p className="font-bold">Recipient: <span className="text-slate-600 dark:text-slate-350">{replyingMessage.name} ({replyingMessage.email})</span></p>
              <p className="font-bold">Original Message:</p>
              <p className="text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl">"{replyingMessage.message}"</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">Your Response Body *</label>
              <textarea 
                rows={5} 
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Dear applicant, thank you for reaching out..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setReplyingMessage(null)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold p-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!replyText.trim()) {
                    toast('Response text cannot be empty.', 'warning');
                    return;
                  }
                  toast(`Reply successfully dispatched via email to ${replyingMessage.email}!`, 'success');
                  await db.markContactMessageRead(replyingMessage.id);
                  setReplyingMessage(null);
                  loadData();
                }}
                className="bg-emerald-600 text-white font-bold text-xs p-2 px-5 rounded-xl flex items-center gap-1 shadow-md shadow-emerald-500/10"
              >
                <Send size={13} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
