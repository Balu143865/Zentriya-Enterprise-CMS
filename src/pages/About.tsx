import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { AboutSection } from '../types';
import LucideIcon from '../components/LucideIcon';
import { ShieldCheck, History, Compass, Milestone, Users } from 'lucide-react';

export default function About() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getAbout().then((data) => {
      setAbout(data);
      setLoading(false);
    });
  }, []);

  if (loading || !about) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="about-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Corporate Integrity & Excellence
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Our Mission, Vision & Timelines
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Discover the founders, philosophy, core technical pillars, and historic milestones that define Zentriya IT Solutions.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* 1. Overview */}
        <section id="about-overview" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              A Bespoke Software Consulting Agency & Technical Academy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {about.companyOverview}
            </p>
          </div>
          
          <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="text-blue-500" size={20} />
              Accredited Quality Seal
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Our engineering standards mimic global titans like IBM and Microsoft, with highly streamlined code deployment pipelines and verified secure multi-tenant cloud storage structures.
            </p>
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>ISO 9001:2015 Operations Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Authorized Cloud Enablement Partner</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>120+ Software Recruiter Associations</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Vision and Mission cards */}
        <section id="about-vision-mission" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {about.vision}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Milestone size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {about.mission}
            </p>
          </div>

        </section>

        {/* 3. Core Values Grid */}
        <section id="about-core-values">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 font-bold text-xs uppercase tracking-widest block font-mono">
              Our Pillars
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Values Driving Zentriya Coding Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {about.coreValues.map((val, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-md space-y-3.5 hover:-translate-y-1 transition-transform"
              >
                <div className="text-blue-500">
                  <LucideIcon name={val.icon} size={24} />
                </div>
                <h4 className="font-bold text-slate-950 dark:text-white text-base">
                  {val.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Timeline Tracker */}
        <section id="about-timeline">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 font-bold text-xs uppercase tracking-widest block font-mono">
              Historic Records
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Zentriya Evolution Journey
            </h2>
          </div>

          <div className="relative border-l-2 border-blue-500/20 max-w-4xl mx-auto pl-8 sm:pl-10 space-y-10 py-2">
            {about.timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Bullet point bubble */}
                <div className="absolute -left-[45px] sm:-left-[49px] top-1 w-6 h-6 rounded-full bg-slate-900 border-4 border-blue-500 text-white flex items-center justify-center text-[10px] group-hover:scale-110 transition-transform">
                  <History size={10} />
                </div>
                
                <div className="space-y-1">
                  <div className="inline-block bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs px-2.5 py-1 rounded-md font-bold tracking-wider font-mono">
                    {item.year}
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight pt-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <section id="about-why-choose" className="bg-slate-100 dark:bg-slate-900/40 p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 space-y-4">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest block font-mono">
                Decision Metrics
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
                Why IT Leaders & Trainees Partner With Us
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Discover the specific structural mechanisms that ensure our delivery outclasses industry averages.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {about.whyChooseUs.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Users size={16} className="text-blue-500 shrink-0" />
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
