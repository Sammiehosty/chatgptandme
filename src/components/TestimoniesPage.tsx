import { useState, useEffect, useCallback } from 'react';
import { Loader2, ArrowLeft, Quote, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = 'https://pst.sammiehosty.com/api';

interface TestimonyListItem {
  id: number;
  member_name: string;
  member_photo: string;
  title: string;
  thumbnail: string;
  created_at: string;
}

interface TestimonyFull extends TestimonyListItem {
  content: string;
}

function TestimonyContent({ content }: { content: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');
  const paragraphsPerPage = 4; // Show 4 paragraphs per sub-page
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
            Page {currentPage + 1} of {totalPages}
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

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<TestimonyListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TestimonyFull | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchTestimonies = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/testimonies.php?action=list&page=${pageNum}&limit=6`);
      const d = await r.json();
      if (d.success) {
        setTestimonies(d.testimonies || []);
        setPagination(d.pagination);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTestimonies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, fetchTestimonies]);

  const openTestimony = async (id: number) => {
    setLoadingDetail(true);
    try {
      const r = await fetch(`${API_BASE}/testimonies.php?action=get&id=${id}`);
      const d = await r.json();
      if (d.testimony) setSelected(d.testimony);
    } catch { /* ignore */ }
    setLoadingDetail(false);
  };

  // Detail view
  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Testimonies
        </button>

        <article>
          {/* Member info */}
          <div className="flex items-center gap-4 mb-6">
            {selected.member_photo && (
              <img src={selected.member_photo} alt={selected.member_name} className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/30 shadow-lg" />
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight">{selected.title}</h2>
              <p className="text-sm text-amber-400 font-medium mt-1">{selected.member_name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{selected.created_at?.split(' ')[0]}</p>
            </div>
          </div>

          {/* Quote icon */}
          <div className="mb-6">
            <Quote className="w-8 h-8 text-amber-500/30" />
          </div>

          {/* Paginated Content */}
          <div className="prose prose-invert max-w-none">
            <TestimonyContent content={selected.content} />
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-sm">
              {selected.member_name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{selected.member_name}</p>
              <p className="text-xs text-slate-500">Member Testimony</p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // List view
  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
          <Heart className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">Praise Reports</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display">Testimonies</h1>
        <p className="text-slate-400 text-sm">Read how God has been moving in the lives of our members</p>
      </div>

      {testimonies.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No testimonies yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            {testimonies.map(t => (
              <button
                key={t.id}
                onClick={() => openTestimony(t.id)}
                className="text-left group flex items-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-500/20 rounded-2xl transition-all duration-300 p-3"
              >
                {/* Compact Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-white/5">
                  { (t.thumbnail || t.member_photo) ? (
                    <img
                      src={t.thumbnail || t.member_photo}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-slate-600 font-bold text-2xl font-serif-display">{t.member_name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate group-hover:text-amber-400 transition-colors tracking-tight">{t.title}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] sm:text-xs text-amber-500/80 font-semibold tracking-wide">{t.member_name}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">{t.created_at?.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-amber-500" />
                </div>
              </button>
            ))}
          </div>

          {/* Minimalist Pagination */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
