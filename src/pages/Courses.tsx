import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { CourseItem } from '../types';
import { BookOpen, Clock, Tag, HelpCircle, ChevronDown, ChevronUp, Check, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Courses() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);

  useEffect(() => {
    db.getCourses().then((data) => {
      setCourses(data.filter(c => c.isActive));
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  const toggleSyllabus = (id: string) => {
    setExpandedSyllabus(prev => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="courses-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Accredited Tech Curriculums
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Enterprise Training & Bootcamps
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Acquire modern engineering skills. Learn production-grade design tokens, TypeScript decorators, multithread JVM operations, and container routing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Category filtering tags */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white border-transparent shadow-md shadow-blue-500/10' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Listing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <div 
              id={`course-item-card-${course.id}`}
              key={course.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all"
            >
              <div className="space-y-6">
                
                {/* Upper categorization labels */}
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                    {course.category}
                  </span>
                  
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-blue-500" />
                      {course.duration}
                    </span>
                    <span>&bull;</span>
                    <span className="text-blue-600 dark:text-blue-400">{course.mode}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight leading-snug font-display">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {course.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <Check className="text-blue-500 shrink-0" size={14} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Syllabus Collapsible disclosure */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-950/20">
                    <button 
                      onClick={() => toggleSyllabus(course.id)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-850/40"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen size={14} className="text-blue-500" />
                        Explore Weekly Syllabus Modules
                      </span>
                      {expandedSyllabus === course.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {expandedSyllabus === course.id && (
                      <div className="px-5 pb-5 pt-1 space-y-2 border-t border-slate-100 dark:border-slate-800/60 divide-y divide-slate-100/50 dark:divide-slate-800/30">
                        {course.syllabus.map((syl, idx) => (
                          <div key={idx} className="text-xs text-slate-500 dark:text-slate-400 py-2.5 leading-relaxed font-medium">
                            {syl}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Course pricing details and Action Button */}
              <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6 mt-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-semibold line-through">₹{course.price}</span>
                  <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                    ₹{course.discountPrice || course.price}
                    <span className="text-[9px] text-slate-400 block font-semibold tracking-wider uppercase mt-0.5">Accredited credential</span>
                  </div>
                </div>

                <Link 
                  to="/contact"
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/10 transition-all text-xs flex items-center gap-1.5"
                >
                  Request Demo
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
