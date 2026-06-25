import {
  Headphones,
  BookOpen,
  Flame,
  Trophy,
  Calendar,
  Clock
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useListeningStats from "../hooks/useListeningStats";

function formatHours(seconds: number) {
  const hours = seconds / 3600;

  if (hours < 1) {
    return `${Math.round(seconds / 60)} mins`;
  }

  return `${hours.toFixed(1)} hrs`;
}

export default function ListeningStats() {
  const { user } = useAuth();

  const { stats, loading } =
    useListeningStats(user);

  if (!user) return null;

  if (loading) return null;

  const cards = [
    {
      icon: Headphones,
      title: "Listening Time",
      value: formatHours(
        stats.total_listening_seconds
      ),
      color:
        "from-amber-500 to-orange-500",
    },

    {
      icon: BookOpen,
      title: "Completed",
      value: stats.completed_sermons,
      color:
        "from-indigo-500 to-purple-500",
    },

    {
      icon: Flame,
      title: "Current Streak",
      value: `${stats.current_streak} Days`,
      color:
        "from-red-500 to-orange-500",
    },

    {
      icon: Trophy,
      title: "Longest Streak",
      value: `${stats.longest_streak} Days`,
      color:
        "from-green-500 to-emerald-500",
    },

    {
      icon: Calendar,
      title: "Favorite Month",
      value:
        stats.favorite_month ||
        "N/A",
      color:
        "from-cyan-500 to-blue-500",
    },

    {
      icon: Clock,
      title: "Last Listened",
      value:
        stats.last_listened
          ? new Date(
              stats.last_listened
            ).toLocaleDateString()
          : "Never",
      color:
        "from-pink-500 to-rose-500",
    },
  ];

  return (
    <section className="mb-10">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-bold text-white">
          Your Listening
        </h2>

        <span className="text-xs uppercase tracking-widest text-amber-400">
          Statistics
        </span>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-5 hover:border-amber-500/40 transition-all"
            >

              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg mb-4`}
              >

                <Icon className="w-6 h-6 text-white" />

              </div>

              <p className="text-sm text-slate-400">
                {card.title}
              </p>

              <h3 className="text-2xl font-bold text-white mt-1">
                {card.value}
              </h3>

            </div>

          );

        })}

      </div>

    </section>
  );
}