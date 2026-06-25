import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { InternshipProgram } from '../types';
import { GraduationCap, Code2, Calendar, Users, CheckCircle, ArrowRight, ShieldCheck, FileText, Send, X } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Internships() {
  const [internships, setInternships] = useState<InternshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModelOpen, setApplyModelOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<InternshipProgram | null>(null);
  const { toast } = useToast();

  // Application State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('0');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    db.getInternships().then((data) => {
      setInternships(data.filter(i => i.isActive));
      setLoading(false);
    });
  }, []);

  const openApplyModel = (internship: InternshipProgram) => {
    setSelectedIntern(internship);
    setApplyModelOpen(true);
  };

  const closeApplyModel = () => {
    setApplyModelOpen(false);
    setSelectedIntern(null);
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

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      toast('Please fill out all required contact fields.', 'warning');
      return;
    }
    if (!resumeName) {
      toast('Please attach your technical Resume.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.createApplication({
        id: 'app_' + Date.now(),
        jobId: selectedIntern?.id || 'intern_custom',
        jobTitle: `Internship: ${selectedIntern?.title || 'Generic Track'}`,
        fullName,
        email,
        phone,
        experienceYears: Number(experience),
        resumeUrl: '#',
        coverLetter,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      toast('Application submitted successfully! Our HR team will reach out shortly.', 'success');
      closeApplyModel();
    } catch (err) {
      toast('Failed to register application. Please try again.', 'error');
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
    <div id="internships-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Header section */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Careers Enablement & Direct Hiring
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Placement-Driven Industry Internships
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Gain direct experience on live enterprise repositories, receive formal code-review check-ins, upskill in modern technologies, and secure corporate placement.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        
        {/* Dynamic Internships Loop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {internships.map((intern) => (
            <div 
              id={`internship-program-card-${intern.id}`}
              key={intern.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              
              <div>
                {/* Image & Banner Header */}
                <div className="h-56 relative bg-slate-900">
                  <img 
                    src={intern.bannerUrl} 
                    alt={intern.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                  
                  {/* Mode tag */}
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {intern.mode}
                  </div>

                  {/* Absolute Title layout */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-blue-500/20">
                      Technical Sprint
                    </span>
                    <h3 className="text-white font-extrabold text-xl tracking-tight mt-2.5 font-display">
                      {intern.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Technology labels */}
                  <div className="flex gap-1.5 items-start">
                    <Code2 className="text-blue-500 shrink-0 mt-0.5" size={17} />
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Stack:</span> {intern.technology}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {intern.description}
                  </p>

                  {/* Core Features bullets */}
                  <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
                      Included Deliverables
                    </h4>
                    <ul className="space-y-2">
                      {intern.features.map((feat, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-300 leading-tight font-medium">
                          <CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={14} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Certificate Specs */}
                  <div className="flex gap-2.5 items-start p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-xl border border-blue-100/50 dark:border-blue-900/30 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="text-blue-500 shrink-0" size={16} />
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 block">Credential:</span>
                      {intern.certificateDetails}
                    </div>
                  </div>

                </div>
              </div>

              {/* Price details and Action Block */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold line-through">₹{intern.price}</span>
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    ₹{intern.discountPrice || intern.price}
                    <span className="text-[10px] text-slate-400 block font-normal mt-0.5 uppercase tracking-wider">No hidden charges</span>
                  </div>
                </div>

                <button 
                  onClick={() => openApplyModel(intern)}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/10 flex items-center gap-1.5 hover:scale-105 transition-all text-sm"
                >
                  Apply Now
                  <ArrowRight size={15} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Dynamic Application Submission Modal */}
      {applyModelOpen && selectedIntern && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={closeApplyModel}
              className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X size={18} />
            </button>

            <div className="space-y-4 mb-6">
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                HR Fast-track
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl leading-tight font-display">
                Apply for {selectedIntern.title}
              </h3>
              <p className="text-xs text-slate-500">
                Submit your credentials to our HR coordinator team. All submissions appear dynamically in the Super Admin dashboard activity feed.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Preeti Deshmukh"
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
                    placeholder="name@gmail.com"
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Prior Tech Experience (Years)</label>
                <select 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="0">Student / Fresher</option>
                  <option value="1">1 Year</option>
                  <option value="2">2+ Years</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Cover Note / Remarks</label>
                <textarea 
                  rows={2}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="I am highly motivated to work with React and Node.js..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Upload Resume - Supports interactive drop select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">Upload Resume (PDF/DOC) *</label>
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
                      <span className="text-xs text-slate-500 font-medium">Click or Drag PDF file here to attach</span>
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
                  {isSubmitting ? 'Uploading Application...' : 'Submit Application Credentials'}
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
