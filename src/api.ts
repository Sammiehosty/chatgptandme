import type { Sermon, Pagination, MonthFilter, AppStats } from './types';

const API_BASE = 'https://vcc.sammiehosty.com/api';

// Demo data for when backend is not connected
const DEMO_SERMONS: Sermon[] = [
  {
    id: 1, telegram_msg_id: 1001, title: "The Power of Faith in Trying Times",
    file_name: "The Power of Faith in Trying Times.mp3", file_size: 15728640, duration: 2700,
    mime_type: "audio/mpeg", message_date: "2025-01-12 10:00:00", description: "A powerful sermon on maintaining faith during difficult seasons",
    play_count: 245, stream_url: "", duration_formatted: "45:00", file_size_formatted: "15.0 MB",
    date_formatted: "Jan 12, 2025", month_name: "January", year: "2025", created_at: "2025-01-12"
  },
  {
    id: 2, telegram_msg_id: 1002, title: "Walking in Divine Purpose",
    file_name: "Walking in Divine Purpose.mp3", file_size: 18874368, duration: 3240,
    mime_type: "audio/mpeg", message_date: "2025-01-19 10:00:00", description: "Understanding and walking in God's purpose for your life",
    play_count: 189, stream_url: "", duration_formatted: "54:00", file_size_formatted: "18.0 MB",
    date_formatted: "Jan 19, 2025", month_name: "January", year: "2025", created_at: "2025-01-19"
  },
  {
    id: 3, telegram_msg_id: 1003, title: "The Grace That Transforms",
    file_name: "The Grace That Transforms.mp3", file_size: 20971520, duration: 3600,
    mime_type: "audio/mpeg", message_date: "2025-02-02 10:00:00", description: "How God's grace transforms every area of our lives",
    play_count: 312, stream_url: "", duration_formatted: "1:00:00", file_size_formatted: "20.0 MB",
    date_formatted: "Feb 02, 2025", month_name: "February", year: "2025", created_at: "2025-02-02"
  },
  {
    id: 4, telegram_msg_id: 1004, title: "Breaking Limitations Through Prayer",
    file_name: "Breaking Limitations Through Prayer.mp3", file_size: 16777216, duration: 2880,
    mime_type: "audio/mpeg", message_date: "2025-02-09 10:00:00", description: "The power of persistent prayer in breaking every limitation",
    play_count: 278, stream_url: "", duration_formatted: "48:00", file_size_formatted: "16.0 MB",
    date_formatted: "Feb 09, 2025", month_name: "February", year: "2025", created_at: "2025-02-09"
  },
  {
    id: 5, telegram_msg_id: 1005, title: "Living in the Overflow",
    file_name: "Living in the Overflow.mp3", file_size: 22020096, duration: 3780,
    mime_type: "audio/mpeg", message_date: "2025-02-16 10:00:00", description: "God wants us to live in abundance and overflow",
    play_count: 156, stream_url: "", duration_formatted: "1:03:00", file_size_formatted: "21.0 MB",
    date_formatted: "Feb 16, 2025", month_name: "February", year: "2025", created_at: "2025-02-16"
  },
  {
    id: 6, telegram_msg_id: 1006, title: "The Covenant of Healing",
    file_name: "The Covenant of Healing.mp3", file_size: 14680064, duration: 2520,
    mime_type: "audio/mpeg", message_date: "2025-03-02 10:00:00", description: "Understanding divine healing through covenant",
    play_count: 421, stream_url: "", duration_formatted: "42:00", file_size_formatted: "14.0 MB",
    date_formatted: "Mar 02, 2025", month_name: "March", year: "2025", created_at: "2025-03-02"
  },
  {
    id: 7, telegram_msg_id: 1007, title: "Seeds of Greatness",
    file_name: "Seeds of Greatness.mp3", file_size: 17825792, duration: 3060,
    mime_type: "audio/mpeg", message_date: "2025-03-09 10:00:00", description: "Discovering the seeds of greatness God has placed within you",
    play_count: 198, stream_url: "", duration_formatted: "51:00", file_size_formatted: "17.0 MB",
    date_formatted: "Mar 09, 2025", month_name: "March", year: "2025", created_at: "2025-03-09"
  },
  {
    id: 8, telegram_msg_id: 1008, title: "Positioned for Victory",
    file_name: "Positioned for Victory.mp3", file_size: 19922944, duration: 3420,
    mime_type: "audio/mpeg", message_date: "2025-03-16 10:00:00", description: "God is positioning you for total victory in every area",
    play_count: 167, stream_url: "", duration_formatted: "57:00", file_size_formatted: "19.0 MB",
    date_formatted: "Mar 16, 2025", month_name: "March", year: "2025", created_at: "2025-03-16"
  },
  {
    id: 9, telegram_msg_id: 1009, title: "The Spirit of Excellence",
    file_name: "The Spirit of Excellence.mp3", file_size: 21495808, duration: 3690,
    mime_type: "audio/mpeg", message_date: "2025-04-06 10:00:00", description: "Cultivating a spirit of excellence in all that we do",
    play_count: 134, stream_url: "", duration_formatted: "1:01:30", file_size_formatted: "20.5 MB",
    date_formatted: "Apr 06, 2025", month_name: "April", year: "2025", created_at: "2025-04-06"
  },
  {
    id: 10, telegram_msg_id: 1010, title: "Supernatural Breakthrough",
    file_name: "Supernatural Breakthrough.mp3", file_size: 23068672, duration: 3960,
    mime_type: "audio/mpeg", message_date: "2025-04-13 10:00:00", description: "Accessing supernatural breakthrough by the Holy Spirit",
    play_count: 289, stream_url: "", duration_formatted: "1:06:00", file_size_formatted: "22.0 MB",
    date_formatted: "Apr 13, 2025", month_name: "April", year: "2025", created_at: "2025-04-13"
  },
  {
    id: 11, telegram_msg_id: 1011, title: "Dwelling in God's Presence",
    file_name: "Dwelling in God's Presence.mp3", file_size: 16252928, duration: 2790,
    mime_type: "audio/mpeg", message_date: "2025-05-04 10:00:00", description: "The blessing of dwelling in the presence of God",
    play_count: 356, stream_url: "", duration_formatted: "46:30", file_size_formatted: "15.5 MB",
    date_formatted: "May 04, 2025", month_name: "May", year: "2025", created_at: "2025-05-04"
  },
  {
    id: 12, telegram_msg_id: 1012, title: "Uncommon Favour",
    file_name: "Uncommon Favour.mp3", file_size: 18350080, duration: 3150,
    mime_type: "audio/mpeg", message_date: "2025-05-11 10:00:00", description: "Receiving and walking in God's uncommon favour",
    play_count: 223, stream_url: "", duration_formatted: "52:30", file_size_formatted: "17.5 MB",
    date_formatted: "May 11, 2025", month_name: "May", year: "2025", created_at: "2025-05-11"
  },
];

const DEMO_MONTHS: MonthFilter[] = [
  { year: 2025, month: 5, label: "May 2025", count: 2 },
  { year: 2025, month: 4, label: "April 2025", count: 2 },
  { year: 2025, month: 3, label: "March 2025", count: 3 },
  { year: 2025, month: 2, label: "February 2025", count: 3 },
  { year: 2025, month: 1, label: "January 2025", count: 2 },
];

const DEMO_STATS: AppStats = {
  total_sermons: 12,
  total_plays: 2968,
  total_duration: 38790,
  total_duration_formatted: "10:46:30",
  latest_sermon_date: "May 11, 2025"
};

let useDemo = false;

async function fetchAPI(endpoint: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    useDemo = true;
    return null;
  }
}

export async function getSermons(params: {
  page?: number;
  limit?: number;
  search?: string;
  month?: number;
  year?: number;
  sort?: string;
}): Promise<{ sermons: Sermon[]; pagination: Pagination }> {
  const query = new URLSearchParams();
  query.set('action', 'list');
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.search) query.set('search', params.search);
  if (params.month) query.set('month', String(params.month));
  if (params.year) query.set('year', String(params.year));
  if (params.sort) query.set('sort', params.sort);

  const data = await fetchAPI(`/sermons.php?${query.toString()}`);
  
  if (!data || useDemo) {
    // Filter demo data
    let filtered = [...DEMO_SERMONS];
    
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        ser => ser.title.toLowerCase().includes(s) || ser.description.toLowerCase().includes(s)
      );
    }
    if (params.month) {
      filtered = filtered.filter(ser => {
        const d = new Date(ser.message_date);
        return d.getMonth() + 1 === params.month;
      });
    }
    if (params.year) {
      filtered = filtered.filter(ser => {
        const d = new Date(ser.message_date);
        return d.getFullYear() === params.year;
      });
    }
    
    if (params.sort === 'oldest') filtered.sort((a, b) => new Date(a.message_date).getTime() - new Date(b.message_date).getTime());
    else if (params.sort === 'popular') filtered.sort((a, b) => b.play_count - a.play_count);
    else filtered.sort((a, b) => new Date(b.message_date).getTime() - new Date(a.message_date).getTime());
    
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    
    return {
      sermons: paged,
      pagination: { page, limit, total: filtered.length, pages: Math.ceil(filtered.length / limit) }
    };
  }
  
  return { sermons: data.sermons, pagination: data.pagination };
}

export async function getMonths(): Promise<MonthFilter[]> {
  const data = await fetchAPI('/sermons.php?action=months');
  if (!data || useDemo) return DEMO_MONTHS;
  return data.months;
}

export async function getStats(): Promise<AppStats> {
  const data = await fetchAPI('/sermons.php?action=stats');
  if (!data || useDemo) return DEMO_STATS;
  return data.stats;
}

export async function recordPlay(id: number): Promise<void> {

    try {

        await fetch(`${API_BASE}/sermons/play.php`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                id

            })

        });

    } catch (error) {

        console.error("Unable to record play:", error);

    }

}

export async function saveProgress(

    sermonId: number,

    position: number,

    duration: number

): Promise<void> {

    try {

        await fetch(`${API_BASE}/sermons/save-progress.php`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                sermon_id: sermonId,

                position,

                duration

            })

        });

    } catch (error) {

        console.error("Unable to save progress:", error);

    }

}


export function getStreamUrl(sermon: Sermon): string {

    if (sermon.stream_url && !useDemo) {

        return sermon.stream_url;

    }

    return `${API_BASE}/stream.php?id=${sermon.id}`;

}


export function isUsingDemo(): boolean {
  return useDemo;
}

export interface AppSettings {
  app_title?: string;
  app_description?: string;
  channel_name?: string;
  church_name?: string;
  pastor_name?: string;
  telegram_channel_link?: string;
  worship_text?: string;
  direction_button_text?: string;
  direction_link?: string;
  contact_description?: string;
  contact_map_iframe?: string;
  contact_phone1?: string;
  contact_phone2?: string;
  contact_address?: string;
  facebook_username?: string;
  album_art_url?: string;
  testimonies_enabled?: string;
  article_menu_enabled?: string;
  article_menu_text?: string;
  preloader_enabled?: string;
  preloader_time?: string;
  launch_popup_enabled?: string;
  launch_popup_title?: string;
  launch_popup_subtitle?: string;
  launch_popup_description?: string;
  launch_popup_button_text?: string;
  launch_popup_date?: string;
  maintenance_mode?: string;
  maintenance_title?: string;
  maintenance_description?: string;
  maintenance_date?: string;
  event_popup_enabled?: string;
  event_popup_mode?: string;
  event_popup_image_1?: string;
  event_popup_time_1?: string;
  event_popup_image_2?: string;
  event_popup_time_2?: string;
  event_popup_image_3?: string;
  event_popup_time_3?: string;
  event_popup_image_4?: string;
  event_popup_time_4?: string;
  event_popup_image_5?: string;
  event_popup_time_5?: string;
  event_popup_image_6?: string;
  event_popup_time_6?: string;
  event_popup_image_7?: string;
  event_popup_time_7?: string;
  event_popup_image_8?: string;
  event_popup_time_8?: string;
  event_popup_image_9?: string;
  event_popup_time_9?: string;
  event_popup_image_10?: string;
  event_popup_time_10?: string;
}

let cachedSettings: AppSettings | null = null;

export async function getSettings(): Promise<AppSettings> {
  if (cachedSettings) return cachedSettings;
  
  const data = await fetchAPI('/sermons.php?action=settings');
  if (!data || useDemo) {
    cachedSettings = {
      app_title: 'Pst Ifeanyi Sermon',
      app_description: 'Listen to powerful sermons',
      channel_name: 'Pst Ifeanyi Sermon',
      church_name: 'VCC AWKA',
      pastor_name: 'Pst Ifeanyi',
      telegram_channel_link: '',
      worship_text: 'Worship with us every Thursdays 5pm and Sundays 8am at Victorious City Church',
      direction_button_text: 'Get Direction',
      direction_link: ''
    };
    return cachedSettings;
  }
  cachedSettings = data.settings || {};
  return cachedSettings as AppSettings;
}

