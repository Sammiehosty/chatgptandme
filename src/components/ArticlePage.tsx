import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, BookOpen, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSettings } from '../api';

const API_BASE = 'https://pst.sammiehosty.com/api';

interface ArticleListItem {
  id: number;
  author_name: string;
  author_photo: string;
  title: string;
  thumbnail: string;
  created_at: string;
}

interface ArticleFull extends ArticleListItem {
  content: string;
}

function ArticleContent({ content }: { content: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  const paragraphsPerPage = 5; // Show 5 paragraphs per sub-page for articles
  const totalPages = Math.ceil(paragraphs.length / paragraphsPerPage);

  if (paragraphs.length === 0) return null;

  const currentParagraphs = paragraphs.slice(
    currentPage * paragraphsPerPage,
    (currentPage + 1) * paragraphsPerPage
  );

  return (
    <div>
      {currentParagraphs.map((p, i) => (
        <p key={i} className="text-slate-300 leading-relaxed mb-6 text-[16px] font-medium">{p}</p>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
          <button
            disabled={currentPage === 0}
            onClick={() => {
              setCurrentPage(p => p - 1);
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 disabled:opacity-20 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Part {currentPage + 1} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => {
              setCurrentPage(p => p + 1);
              window.scrollTo({ top: 100, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 disabled:opacity-20 transition-opacity"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ArticlePage() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ArticleFull | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [menuText, setMenuText] = useState('Articles');

  useEffect(() => {
    getSettings().then(s => {
      if (s.article_menu_text) setMenuText(s.article_menu_text);
    });
  }, []);

  const fetchArticles = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/articles.php?action=list&page=${pageNum}&limit=5`);
      const d = await r.json();
      if (d.success) {
        setArticles(d.articles || []);
        setPagination(d.pagination);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArticles(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, fetchArticles]);

  const openArticle = async (id: number) => {
    setLoadingDetail(true);
    try {
      const r = await fetch(`${API_BASE}/articles.php?action=get&id=${id}`);
      const d = await r.json();
      if (d.article) setSelected(d.article);
    } catch { /* ignore */ }
    setLoadingDetail(false);
  };

  // Detail view
  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to {menuText}
        </button>

        <article className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
            {selected.author_photo ? (
              <img src={selected.author_photo} alt={selected.author_name} className="w-24 h-24 rounded-2xl object-cover ring-2 ring-amber-500/20 shadow-2xl shadow-amber-500/10" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-3xl">{selected.author_name.charAt(0)}</div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif-display leading-tight tracking-tight mb-2">{selected.title}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="text-sm text-amber-400 font-semibold tracking-wide">{selected.author_name}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
                <span className="text-xs text-slate-500 font-medium">{selected.created_at?.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Quote className="w-10 h-10 text-amber-500/20" />
          </div>

          <div className="prose prose-invert max-w-none">
            <ArticleContent content={selected.content} />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase">Inspiration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-serif-display tracking-tight">{menuText}</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-500 font-medium">No articles yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            {articles.map(a => (
              <button
                key={a.id}
                onClick={() => openArticle(a.id)}
                className="text-left group flex items-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-500/20 rounded-2xl transition-all duration-300 p-3"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-white/5">
                  { (a.thumbnail || a.author_photo) ? (
                    <img
                      src={a.thumbnail || a.author_photo}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate-600 font-bold text-2xl font-serif-display">{a.author_name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate group-hover:text-amber-400 transition-colors tracking-tight">{a.title}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] sm:text-xs text-amber-500/80 font-semibold tracking-wide">{a.author_name}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">{a.created_at?.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                </div>
              </button>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-6 pt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 rounded-full bg-white/5 text-slate-400 disabled:opacity-20 hover:text-amber-500 hover:bg-amber-500/10 transition-all border border-white/5"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-sm font-bold text-slate-500 tracking-widest uppercase">
                Page <span className="text-white">{page}</span> of <span className="text-slate-600">{pagination.pages}</span>
              </div>

              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-3 rounded-full bg-white/5 text-slate-400 disabled:opacity-20 hover:text-amber-500 hover:bg-amber-500/10 transition-all border border-white/5"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {loadingDetail && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
          <p className="text-white text-sm font-bold tracking-widest uppercase">Opening...</p>
        </div>
      )}
    </div>
  );
}
