import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Linkedin, 
  Instagram, Youtube, ArrowUp, Send, CheckCircle2 
} from 'lucide-react';
import { db } from '../services/db';
import { WebsiteSettings } from '../types';

export default function Footer() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    db.getSettings().then(setSettings);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail.trim()) {
      setSubscribed(true);
      setSubEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="website-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 relative pt-16 pb-8 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Upper Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Company Brief Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.companyName} 
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  Z
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-white text-lg leading-tight">
                  Zentriya IT
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Solutions Pvt Ltd
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Zentriya is an elite enterprise technology consulting firm and placement-driven mentorship institute delivering code integrity, microservices, and certified enablement.
            </p>

            {/* Social Links Grid */}
            <div className="flex items-center gap-3">
              {settings?.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-all text-slate-400">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-all text-slate-400">
                  <Twitter size={16} />
                </a>
              )}
              {settings?.socialLinks.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-all text-slate-400">
                  <Linkedin size={16} />
                </a>
              )}
              {settings?.socialLinks.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-all text-slate-400">
                  <Instagram size={16} />
                </a>
              )}
              {settings?.socialLinks.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-all text-slate-400">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-emerald-500 pb-2">
              Technology Sectors
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">Custom Software Development</Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-emerald-400 transition-colors">Placement Internships</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">Cloud Consulting & DevOps</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-emerald-400 transition-colors">Advanced Tech Bootcamps</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-emerald-400 transition-colors">Student Success Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-emerald-500 pb-2">
              Corporate Office
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="text-emerald-500 shrink-0 mt-0.5" size={17} />
                <span className="text-slate-400 leading-snug">
                  {settings?.address || 'Outer Ring Road, Bangalore'}
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-emerald-500 shrink-0" size={16} />
                <a href={`mailto:${settings?.contactEmail}`} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {settings?.contactEmail || 'info@zentriya.com'}
                </a>
              </li>
              {settings?.contactPhones && settings.contactPhones.length > 0 && (
                <li className="flex gap-3 items-start">
                  <Phone className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                  <div className="flex flex-col gap-1">
                    {settings.contactPhones.map((ph, idx) => (
                      <a href={`tel:${ph}`} key={idx} className="text-slate-400 hover:text-emerald-400 transition-colors">
                        {ph}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-emerald-500 pb-2">
              Corporate Newsletter
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to stay updated with advanced technical articles, system insights, and campus hiring calendar alerts.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-1 bg-slate-800 rounded-lg p-1.5 border border-slate-700 focus-within:border-emerald-500 transition-all">
                <input 
                  type="email" 
                  placeholder="Corporate Email" 
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  className="bg-transparent border-0 ring-0 focus:ring-0 text-sm w-full text-white px-2 outline-none"
                  required
                />
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-md transition-colors shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium py-1 animate-fade-in">
                  <CheckCircle2 size={13} />
                  Subscription successfully registered!
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Lower Row - Copyrights & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-xs text-slate-500 font-medium">
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {settings?.companyName || 'Zentriya IT Solutions Private Limited'}. All rights reserved.
            <div className="mt-1 flex justify-center sm:justify-start gap-4">
              <Link to="/about" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
              <Link to="/about" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
              <Link to="/about" className="hover:text-slate-400 transition-colors">Cookie Controls</Link>
            </div>
          </div>

          {/* WhatsApp Support & Scroll To Top */}
          <div className="flex items-center gap-3">
            {settings?.whatsappNumber && (
              <a 
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 bg-slate-800 hover:bg-emerald-950/40 hover:text-emerald-400 border border-slate-700 hover:border-emerald-800 px-4 py-2 rounded-lg transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>WhatsApp Live Chat</span>
              </a>
            )}

            <button 
              onClick={scrollToTop}
              className="p-2.5 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-slate-400 border border-slate-700 hover:border-emerald-500"
              title="Scroll back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
