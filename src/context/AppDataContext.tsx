import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getSettings,
  getStats,
  getSermons,
} from "../api";

import type {
  Sermon,
  AppStats,
} from "../types";

interface AppDataContextType {
  loading: boolean;

  settings: any;

  stats: AppStats | null;

  latestSermons: Sermon[];

  popularSermons: Sermon[];

  refresh: () => Promise<void>;
}

const AppDataContext =
  createContext<AppDataContextType | null>(
    null
  );

export function AppDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] =
    useState(true);

  const [settings, setSettings] =
    useState<any>(null);

  const [stats, setStats] =
    useState<AppStats | null>(null);

  const [latestSermons, setLatestSermons] =
    useState<Sermon[]>([]);

  const [popularSermons, setPopularSermons] =
    useState<Sermon[]>([]);

  async function loadData() {
    setLoading(true);

    try {
      const [
        settingsData,
        statsData,
        latestData,
        popularData,
      ] = await Promise.all([
        getSettings(),

        getStats(),

        getSermons({
          limit: 20,
          sort: "newest",
        }),

        getSermons({
          limit: 20,
          sort: "popular",
        }),
      ]);

      setSettings(settingsData);

      setStats(statsData);

      setLatestSermons(
        latestData.sermons ?? []
      );

      setPopularSermons(
        popularData.sermons ?? []
      );
    } catch (err) {
      console.error(
        "AppDataProvider Error",
        err
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        loading,

        settings,

        stats,

        latestSermons,

        popularSermons,

        refresh: loadData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context =
    useContext(AppDataContext);

  if (!context) {
    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
}