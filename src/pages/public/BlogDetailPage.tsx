import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { BlogPost } from '../../types/database';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { success } = useToast();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    dataService.getBlogPostBySlug(slug).then(async (p) => {
      setPost(p);
      if (p) {
        const all = await dataService.getBlogPosts(true);
        setRecentPosts(all.filter(item => item.id !== p.id).slice(0, 3));
      }
      setLoading(false);
    });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Link Copied', 'Article link copied to clipboard.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">The requested publication could not be found.</p>
        <Link to="/blog" className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold text-sm">
          Return to Technical Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="space-y-4">
            <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <User className="w-4 h-4 text-amber-500" />
                {post.author_name} ({post.author_role})
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {new Date(post.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {post.read_time}
              </span>

              <button
                type="button"
                onClick={handleShare}
                className="ml-auto inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 p-1 rounded transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cover Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-12 h-80 sm:h-[420px]">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Excerpt Lead */}
          <div className="bg-slate-900 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-10 text-slate-200 text-base leading-relaxed italic">
            {post.excerpt}
          </div>

          {/* Body Content */}
          <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm sm:text-base space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl font-black text-white mt-10 mb-4 pb-2 border-b border-slate-800">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-amber-400 mt-8 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500 mr-2" />
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Card */}
          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-xl flex items-center justify-center shrink-0">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <p className="text-base font-bold text-white">{post.author_name}</p>
              <p className="text-xs text-amber-400 font-medium mb-1">{post.author_role}</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contributing Senior Specialist at ApexBuild Engineering & Construction Ltd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-white mb-8">Related Technical Publications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-amber-500/40 transition-all"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-amber-400 font-bold mb-1">{p.category}</p>
                      <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                    <Link
                      to={`/blog/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 pt-3 border-t border-slate-800"
                    >
                      Read Article <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
