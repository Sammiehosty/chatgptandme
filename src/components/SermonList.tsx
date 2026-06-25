import { useState, useEffect, useCallback } from 'react';
import { ArrowUpDown, Calendar, ChevronLeft, ChevronRight, Loader2, Music } from 'lucide-react';
import type { Sermon, MonthFilter, Pagination } from '../types';
import { getSermons, getMonths } from '../api';
import SermonCard from './SermonCard';

interface SermonListProps {
  searchQuery: string;
  view: 'sermons' | 'browse';
}

export default function SermonList({ searchQuery, view }: SermonListProps) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [months, setMonths] = useState<MonthFilter[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const loadSermons = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSermons({
        page,
        limit: 20,
        search: searchQuery,
        month: selectedMonth || undefined,
        year: selectedYear || undefined,
        sort,
      });
      setSermons(result.sermons);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error loading sermons:', err);
    }
    setLoading(false);
  }, [page, searchQuery, selectedMonth, selectedYear, sort]);

  const loadMonths = useCallback(async () => {
    try {
      const data = await getMonths();
      setMonths(data);
    } catch (err) {
      console.error('Error loading months:', err);
    }
  }, []);

  useEffect(() => {
    loadSermons();
  }, [loadSermons]);

  useEffect(() => {
    loadMonths();
  }, [loadMonths]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedMonth, selectedYear, sort]);

  // Listen for sort changes from header menu
  useEffect(() => {
    const handleSortChange = (e: CustomEvent) => {
      setSort(e.detail);
      setSelectedMonth(null);
      setSelectedYear(null);
    };
    window.addEventListener('setSermonSort', handleSortChange as EventListener);
    return () => window.removeEventListener('setSermonSort', handleSortChange as EventListener);
  }, []);

  const handleMonthFilter = (month: number | null, year: number | null) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setPage(1);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Title A-Z' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {view === 'browse' && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6 font-display">Browse by Month</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => handleMonthFilter(null, null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !selectedMonth ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              All Months
            </button>
            {months.map(m => (
              <button
                key={`${m.year}-${m.month}`}
                onClick={() => handleMonthFilter(m.month, m.year)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedMonth === m.month && selectedYear === m.year
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Calendar className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                {m.label}
                <span className="ml-1.5 text-xs opacity-70">({m.count})</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Header with sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            {searchQuery ? `Search: "${searchQuery}"` : view === 'browse' && selectedMonth ? 'Filtered Sermons' : 'All Sermons'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {pagination.total} sermon{pagination.total !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-500" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 appearance-none cursor-pointer"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && sermons.length === 0 && (
        <div className="text-center py-20">
          <Music className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No Sermons Found</h3>
          <p className="text-sm text-slate-600">
            {searchQuery ? 'Try a different search term.' : 'No sermons available for the selected filter.'}
          </p>
        </div>
      )}

      {/* Sermon grid */}
      {!loading && sermons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sermons.map(sermon => (
            <SermonCard key={sermon.id} sermon={sermon} sermonList={sermons} variant="default" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:text-slate-700 disabled:bg-transparent hover:bg-white/10 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum: number;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  page === pageNum
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="p-2 rounded-lg bg-white/5 text-slate-400 disabled:text-slate-700 disabled:bg-transparent hover:bg-white/10 hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
