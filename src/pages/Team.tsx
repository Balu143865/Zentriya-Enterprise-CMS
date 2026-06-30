import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { TeamMember } from '../types';
import { Linkedin, Twitter, Mail, Award, Users } from 'lucide-react';

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getTeam().then((data) => {
      setTeam(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="team-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Founders & Leadership
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Meet the Zentriya Executive Council
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Our directors, operations officers, and principal corporate recruiters have decades of collective software engineering experience at Siemens, IBM, and top-tier consultancies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        
        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {team.map((member) => (
            <div 
              id={`team-member-profile-${member.id}`}
              key={member.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Member Picture */}
                <div className="h-64 sm:h-72 bg-slate-900 relative overflow-hidden">
                  <img 
                    src={member.photoUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Decorative shading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                    Executive
                  </span>
                  
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl tracking-tight font-display">
                    {member.name}
                  </h3>
                  
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 -mt-1 uppercase tracking-wide">
                    <Award size={13} />
                    {member.designation}
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Social Link row */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                {member.socialLinks.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
                {member.socialLinks.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-9 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <Twitter size={16} />
                  </a>
                )}
                {member.socialLinks.email && (
                  <a 
                    href={`mailto:${member.socialLinks.email}`}
                    className="w-9 h-9 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                  >
                    <Mail size={16} />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
