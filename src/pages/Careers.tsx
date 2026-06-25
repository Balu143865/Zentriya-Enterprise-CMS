import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { JobListing } from '../types';
import { Briefcase, MapPin, Calendar, DollarSign, ArrowRight, FileText, Send, X, ShieldAlert } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Careers() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const { toast } = useToast();

  // Application Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('0');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    db.getJobs().then((data) => {
      setJobs(data.filter(j => j.isActive));
      setLoading(false);
    });
  }, []);

  const openApply = (job: JobListing) => {
    setSelectedJob(job);
    setApplyOpen(true);
  };

  const closeApply = () => {
    setApplyOpen(false);
    setSelectedJob(null);
    setResumeName('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
  };

  const handleResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      toast('Please complete all contact field parameters.', 'warning');
      return;
    }
    if (!resumeName) {
      toast('Please attach a technical PDF/DOC resume representation.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.createApplication({
        id: 'app_' + Date.now(),
        jobId: selectedJob?.id || 'job_custom',
        jobTitle: selectedJob?.title || 'Bespoke Role',
        fullName,
        email,
        phone,
        experienceYears: Number(experience),
        resumeUrl: '#',
        coverLetter,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      toast('Application recorded! Our HR recruitment desk is assessing your profile.', 'success');
      closeApply();
    } catch (err) {
      toast('Failed to post application credentials. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="careers-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Workforce Scaling & Careers
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Build the Future of IT Solutions With Us
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Explore active openings at our Bangalore engineering offices. Join our council of principal software instructors, web developers, and database orchestrators.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        
        {/* Core Listings Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <div 
                id={`job-listing-card-${job.id}`}
                key={job.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                
                <div className="space-y-6">
                  
                  {/* Top tags row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                      {job.department}
                    </span>
                    
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-blue-500" />
                        {job.location}
                      </span>
                      <span>&bull;</span>
                      <span className="text-blue-600 dark:text-blue-400">{job.type}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight font-display">
                      {job.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Core Requirements Bullet list */}
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      Key Technical Requirements
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <li key={idx} className="flex gap-2 items-start leading-snug">
                          <span className="text-blue-500 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Footer details & CTA Action */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6 flex items-center justify-between">
                  <div>
                    {job.salaryRange && (
                      <div className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                        <DollarSign size={13} className="text-blue-500" />
                        Salary: {job.salaryRange}
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase mt-0.5 tracking-wider">Experience: {job.experience}</span>
                  </div>

                  <button 
                    onClick={() => openApply(job)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 hover:scale-105 duration-200 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition-all text-xs flex items-center gap-1.5"
                  >
                    Apply Now
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <ShieldAlert className="text-slate-400 mx-auto" size={40} />
            <p className="text-slate-500 text-sm font-medium">Currently no active hiring openings. Check back shortly!</p>
          </div>
        )}

      </div>

      {/* Careers Apply Modal Overlay */}
      {applyOpen && selectedJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={closeApply}
              className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="space-y-4 mb-6">
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                Employment Application
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl leading-tight font-display">
                Submit Candidacy: {selectedJob.title}
              </h3>
              <p className="text-xs text-slate-500">
                Submit your professional PDF resume. Your application immediately propagates to the HR management desk in the Super Admin console.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Sen"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email Address *</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Phone Number *</label>
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99887 76655"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Prior Work Experience (Years) *</label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="30"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quick Pitch / Cover Note</label>
                <textarea 
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="I have engineered dashboard layers using Vite and React, and would love to upskill at Zentriya..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Upload Resume - Supports drag/drop click selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">Attach Resume File *</label>
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-950 relative">
                  <input 
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <FileText className="text-slate-400" size={24} />
                    {resumeName ? (
                      <span className="text-xs font-bold text-blue-600">{resumeName}</span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Drag/drop or click to select professional PDF</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading Credentials...' : 'Submit Job Application'}
                  <Send size={14} />
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
