import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getStats,
  getSermons,
} from "../api";

import type {
  Sermon,
  AppStats,
} from "../types";

interface DashboardData {

  loading: boolean;

  stats: AppStats | null;

  latestSermons: Sermon[];

  popularSermons: Sermon[];

  refresh: () => Promise<void>;
}

const DashboardContext =
  createContext<DashboardData | null>(
    null
  );

export function DashboardProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<AppStats | null>(null);

  const [latestSermons, setLatest] =
    useState<Sermon[]>([]);

  const [popularSermons, setPopular] =
    useState<Sermon[]>([]);

  async function load() {

    setLoading(true);

    try {

      const [

        statsData,

        latestData,

        popularData,

      ] = await Promise.all([

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

      setStats(statsData);

      setLatest(
        latestData.sermons
      );

      setPopular(
        popularData.sermons
      );

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  }

  useEffect(() => {

    load();

  }, []);

  return (

    <DashboardContext.Provider
      value={{

        loading,

        stats,

        latestSermons,

        popularSermons,

        refresh: load,

      }}
    >

      {children}

    </DashboardContext.Provider>

  );

}

export function useDashboardData() {

  const context =
    useContext(DashboardContext);

  if (!context) {

    throw new Error(
      "useDashboardData must be inside DashboardProvider"
    );

  }

  return context;

}