import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../services/db';
import { StudentJourneyStep } from '../types';
import LucideIcon from './LucideIcon';

export default function StudentJourney() {
  const [steps, setSteps] = useState<StudentJourneyStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const data = await db.getStudentJourneySteps();
        // Filter out inactive steps and sort by display_order
        const activeSteps = data
          .filter((step) => step.is_active)
          .sort((a, b) => a.display_order - b.display_order);
        setSteps(activeSteps);
      } catch (error) {
        console.error('Failed to load student journey:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-[#0B1220] transition-colors duration-350 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (steps.length === 0) {
    return null;
  }

  return (
    <section 
      id="student-journey-section"
      className="relative py-24 bg-white dark:bg-[#0B1220] border-t border-b border-slate-100 dark:border-slate-900 overflow-hidden transition-colors duration-350 ease-in-out"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm inline-block">
              Career Roadmap
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Student <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Success Journey</span>
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A structured learning path designed to help students become industry-ready professionals.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Timeline for Large Screens (md+) */}
        <div className="hidden lg:block relative mt-16 mb-8">
          
          {/* Central Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500"
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-6 gap-6 relative">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: isEven ? 40 : -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
                  className={`flex flex-col items-center ${isEven ? 'justify-end pb-12' : 'justify-start pt-12'}`}
                  style={{ minHeight: '380px' }}
                >
                  {/* Step Card (Top or Bottom based on alternating pattern) */}
                  <div className={`w-full ${isEven ? 'order-1' : 'order-3'}`}>
                    <div className="group relative p-5 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/40 dark:hover:border-blue-500/40 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1.5 flex flex-col items-center text-center">
                      
                      {/* Gradient Border Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                      {/* Step Number Badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-[10px] font-black text-white shadow-md uppercase tracking-wider">
                        Step {idx + 1}
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-slate-950 dark:to-slate-900 border border-slate-150 dark:border-slate-850 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 mt-1 transition-all duration-300 group-hover:scale-110 shadow-sm">
                        <LucideIcon name={step.icon} size={22} />
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Node on Center Line */}
                  <div className="order-2 relative w-8 h-8 flex items-center justify-center my-6">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 animate-ping opacity-25 scale-110" />
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 border-2 border-white dark:border-[#0B1220] z-10 shadow-md" />
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vertical Timeline for Medium/Small Screens (lg-) */}
        <div className="block lg:hidden relative pl-8 sm:pl-12 max-w-2xl mx-auto space-y-12">
          
          {/* Connecting vertical line */}
          <div className="absolute top-2 bottom-2 left-3 sm:left-5 w-1 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
            <motion.div 
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-gradient-to-b from-blue-600 via-blue-500 to-emerald-500"
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Connecting point */}
              <div className="absolute -left-8 sm:-left-12 top-4 w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 animate-ping opacity-15 scale-110" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 border-2 border-white dark:border-[#0B1220] z-10 shadow-md" />
              </div>

              {/* Card */}
              <div className="relative p-6 sm:p-8 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/40 dark:hover:border-blue-500/40 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
                
                {/* Step number on cards */}
                <div className="absolute top-4 right-4 text-xs font-black bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent opacity-80 uppercase tracking-widest">
                  Step {idx + 1}
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-slate-950 dark:to-slate-900 border border-slate-150 dark:border-slate-850 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <LucideIcon name={step.icon} size={22} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
