import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { WebsiteSettings } from '../types';
import { Mail, Phone, MapPin, Send, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Contact() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const { toast } = useToast();

  // Contact Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    db.getSettings().then(setSettings);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast('Please complete all required fields.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await db.createContactMessage({
        id: 'con_' + Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      toast('Message sent successfully! Our support desk will reply shortly.', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      toast('Failed to deliver message. Please retry shortly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Let's Collaborate
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Connect With Our Solution Architects
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Have an enterprise product to scale, or need to discuss university training alliances? Drop us a line or visit our physical Bangalore labs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column - Contact Details & Map */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
                Corporate Directory
              </h3>

              <div className="space-y-5">
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Corporate Headquarters</span>
                    <p className="text-sm text-slate-755 dark:text-slate-300 leading-snug">
                      {settings?.address || 'Outer Ring Road, Bangalore, KA'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Contact Email</span>
                    <a href={`mailto:${settings?.contactEmail}`} className="text-sm text-slate-755 dark:text-slate-300 hover:text-blue-500 font-semibold">
                      {settings?.contactEmail || 'info@zentriya.com'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Direct Helplines</span>
                    <div className="flex flex-col gap-1">
                      {settings?.contactPhones.map((ph, idx) => (
                        <a href={`tel:${ph}`} key={idx} className="text-sm text-slate-755 dark:text-slate-300 hover:text-blue-500 font-semibold">
                          {ph}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map Embed Card */}
            {settings?.googleMapEmbedUrl && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl p-3">
                <iframe 
                  src={settings.googleMapEmbedUrl}
                  className="w-full h-64 rounded-2xl"
                  loading="lazy"
                  title="Zentriya Bangalore Headquarters Map Locator"
                />
              </div>
            )}

          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight mb-2">
                Leave an Inquiry Message
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                All messages automatically write into our support database. Our consulting coordinators generally respond within 4 hours.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-755 dark:text-slate-300 uppercase tracking-wider">Your Name *</label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Suresh Kumar"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-755 dark:text-slate-300 uppercase tracking-wider">Email Address *</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="suresh@company.com"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-755 dark:text-slate-300 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 99887 76655"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-755 dark:text-slate-300 uppercase tracking-wider">Subject Matter *</label>
                    <input 
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="SaaS Engineering Consult"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-755 dark:text-slate-300 uppercase tracking-wider">Your Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your project scope or training requirements..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:scale-[1.02] duration-200"
                  >
                    {isSubmitting ? 'Transmitting Message...' : 'Transmit Inquiry Message'}
                    <Send size={15} />
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
