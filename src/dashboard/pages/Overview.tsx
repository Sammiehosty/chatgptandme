import {
  Heart,
  History,
  Trophy,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import { useDashboard } from "../DashboardContext";

import ContinueListening from "../../listening/components/ContinueListening";
import RecentlyPlayed from "../../listening/components/RecentlyPlayed";
import ListeningStats from "../../listening/components/ListeningStats";

import type { Sermon } from "../../types";

interface Props {
  sermons: Sermon[];
}

export default function Overview({
  sermons,
}: Props) {
  const { user } = useAuth();

  const { setPage } = useDashboard();

  return (
    <div className="space-y-8">

      {/* Welcome */}

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-8">

        <p className="text-slate-400">
          Welcome Back
        </p>

        <h1 className="text-4xl font-bold text-white mt-2">

          {user?.fullname || "Guest"} 👋

        </h1>

        <p className="text-slate-500 mt-3">

          Continue growing spiritually today.

        </p>

      </section>

      <ContinueListening
        sermons={sermons}
      />

      <ListeningStats />

      <RecentlyPlayed
        sermons={sermons}
      />

      {/* Quick Actions */}

      <section>

        <h2 className="text-xl font-bold text-white mb-5">

          Quick Actions

        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <DashboardButton
            title="Favorites"
            description="Your saved sermons"
            icon={<Heart className="w-6 h-6" />}
            onClick={() =>
              setPage("favorites")
            }
          />

          <DashboardButton
            title="History"
            description="Recently listened"
            icon={<History className="w-6 h-6" />}
            onClick={() =>
              setPage("history")
            }
          />

          <DashboardButton
            title="Statistics"
            description="Your listening"
            icon={<BarChart3 className="w-6 h-6" />}
            onClick={() =>
              setPage("statistics")
            }
          />

          <DashboardButton
            title="Achievements"
            description="Your badges"
            icon={<Trophy className="w-6 h-6" />}
            onClick={() =>
              setPage("achievements")
            }
          />

        </div>

      </section>

    </div>
  );
}

interface ButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function DashboardButton({
  title,
  description,
  icon,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left hover:border-amber-500/40 hover:bg-white/[0.08] transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mb-5">

        {icon}

      </div>

      <h3 className="text-lg font-bold text-white">

        {title}

      </h3>

      <p className="text-sm text-slate-400 mt-2">

        {description}

      </p>

      <div className="mt-6 flex items-center text-amber-400 text-sm font-semibold">

        Open

        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />

      </div>

    </button>
  );
}