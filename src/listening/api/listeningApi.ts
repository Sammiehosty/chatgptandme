import { API_BASE } from "../../api";

export interface SaveProgressPayload {
  user_id: number;
  sermon_id: number;
  current_time: number;
  duration: number;
}

export interface ContinueListening {
  id: number;
  sermon_id: number;
  title: string;
  current_time: number;
  duration: number;
  progress_percent: number;
}

class ListeningApi {
  async saveProgress(data: SaveProgressPayload) {
    const response = await fetch(
      `${API_BASE}/listening/save_progress.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.json();
  }

  async loadProgress(userId: number) {
    const response = await fetch(
      `${API_BASE}/listening/load_progress.php?user_id=${userId}`
    );

    return response.json();
  }

  async saveRecentlyPlayed(
    userId: number,
    sermonId: number
  ) {
    const response = await fetch(
      `${API_BASE}/listening/recently_played.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          sermon_id: sermonId,
        }),
      }
    );

    return response.json();
  }

  async getRecentlyPlayed(userId: number) {
    const response = await fetch(
      `${API_BASE}/listening/recently_played.php?user_id=${userId}`
    );

    return response.json();
  }

  async getStats(userId: number) {
    const response = await fetch(
      `${API_BASE}/listening/stats.php?user_id=${userId}`
    );

    return response.json();
  }

  async getHistory(userId: number) {
    const response = await fetch(
      `${API_BASE}/listening/history.php?user_id=${userId}`
    );

    return response.json();
  }

  async getAchievements(userId: number) {
    const response = await fetch(
      `${API_BASE}/listening/achievements.php?user_id=${userId}`
    );

    return response.json();
  }

  async getQueue(userId: number) {
    const response = await fetch(
      `${API_BASE}/listening/queue.php?user_id=${userId}`
    );

    return response.json();
  }
}

export default new ListeningApi();