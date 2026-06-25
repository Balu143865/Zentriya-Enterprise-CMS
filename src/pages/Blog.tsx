import { useState, useEffect } from 'react';
import { db } from '../services/db';
import { BlogPost } from '../types';
import { Search, Tag, Calendar, User, ArrowRight, X, Sparkles, BookOpen } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Reading active blog
  const [activeReadBlog, setActiveReadBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    db.getBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = blogs.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredBlogs.find(b => b.featured) || filteredBlogs[0];
  const secondaryPosts = filteredBlogs.filter(b => b.id !== featuredPost?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/10 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div id="blog-page-root" className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 text-center relative border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4 animate-fade-in">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-bold tracking-widest text-xs uppercase block">
            Corporate Technical Council
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white font-display">
            Journal & Software Insights
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Read engineering strategies, serverless cost optimization matrices, microservices scaling checklists, and secure Generative AI integrations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Search & Categories filtering panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          
          {/* Category Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-500/15 scale-[1.03]' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar Input */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3.5 py-2 rounded-xl w-full md:w-80">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tech articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 ring-0 focus:ring-0 text-xs text-slate-800 dark:text-slate-100 outline-none w-full"
            />
          </div>

        </div>

        {/* 1. FEATURED BLOG POST (Large horizontal banner) */}
        {featuredPost && (
          <div 
            id={`featured-blog-${featuredPost.id}`}
            onClick={() => setActiveReadBlog(featuredPost)}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all grid grid-cols-1 lg:grid-cols-12 cursor-pointer"
          >
            <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative bg-slate-900">
              <img 
                src={featuredPost.imageUrl} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                <Sparkles size={11} fill="white" />
                Featured Article
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                  {featuredPost.category}
                </span>

                <h2 className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl leading-tight hover:text-blue-500 transition-colors font-display">
                  {featuredPost.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <User size={14} className="text-blue-500" />
                  <span>By {featuredPost.author}</span>
                </div>

                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Read Article
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>

          </div>
        )}

        {/* 2. SECONDARY BLOG LIST GRID */}
        {secondaryPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryPosts.map((post) => (
              <div 
                id={`secondary-blog-card-${post.id}`}
                key={post.id}
                onClick={() => setActiveReadBlog(post)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-slate-900 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-6 space-y-3.5">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                      {post.category}
                    </span>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight tracking-tight line-clamp-2 hover:text-blue-500 transition-colors font-display">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Read
                    <ArrowRight size={13} />
                  </span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          !featuredPost && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm font-medium">No matching tech articles located.</p>
            </div>
          )
        )}

      </div>

      {/* Full Article Viewer Drawer Modal */}
      {activeReadBlog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-scale-in max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setActiveReadBlog(null)}
              className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              title="Close Drawer"
            >
              <X size={18} />
            </button>

            {/* Content area */}
            <article className="space-y-6">
              
              <div className="space-y-3">
                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider font-mono">
                  {activeReadBlog.category}
                </span>

                <h1 className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight font-display">
                  {activeReadBlog.title}
                </h1>

                <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                  <span className="flex items-center gap-1 text-blue-600">
                    <User size={13} />
                    {activeReadBlog.author}
                  </span>
                  <span>&bull;</span>
                  <span>Published: {new Date(activeReadBlog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Banner image */}
              <div className="h-56 sm:h-64 bg-slate-900 rounded-2xl overflow-hidden">
                <img 
                  src={activeReadBlog.imageUrl} 
                  alt={activeReadBlog.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tags block */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <Tag size={13} className="text-slate-400 shrink-0" />
                {activeReadBlog.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-bold uppercase">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Render article markdown / HTML safely */}
              <div 
                className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 prose prose-slate dark:prose-invert max-w-none border-t border-slate-100 dark:border-slate-800/80 pt-6"
                dangerouslySetInnerHTML={{ __html: activeReadBlog.content }}
              />

            </article>

          </div>
        </div>
      )}

    </div>
  );
}
