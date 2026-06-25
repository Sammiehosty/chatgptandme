export interface Sermon {
  id: number;
  telegram_msg_id: number;
  title: string;
  file_name: string;
  file_size: number;
  duration: number;
  mime_type: string;
  message_date: string;
  description: string;
  play_count: number;
  stream_url: string;
  duration_formatted: string;
  file_size_formatted: string;
  date_formatted: string;
  month_name: string;
  year: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface MonthFilter {
  year: number;
  month: number;
  label: string;
  count: number;
}

export interface AppStats {
  total_sermons: number;
  total_plays: number;
  total_duration: number;
  total_duration_formatted: string;
  latest_sermon_date: string;
}

export interface PlayerState {
  currentSermon: Sermon | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

export interface User {
  id:number;
  fullname:string;
  email:string;
}