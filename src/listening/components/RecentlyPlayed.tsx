import { Play, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { usePlayer } from "../../PlayerContext";
import useRecentlyPlayed from "../hooks/useRecentlyPlayed";

interface Props {
  sermons: any[];
}

export default function RecentlyPlayed({
  sermons,
}: Props) {
  const { user } = useAuth();

  const { recentlyPlayed, loading } =
    useRecentlyPlayed(user);

  const { play } = usePlayer();

  if (loading) return null;

  if (!recentlyPlayed.length) return null;

  return (
    <section className="mb-10">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-bold text-white">
          Recently Played
        </h2>

        <span className="text-xs uppercase tracking-wider text-amber-400">
          Last {recentlyPlayed.length}
        </span>

      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">

        {recentlyPlayed.map((item) => {

          const sermon = sermons.find(
            (s) => Number(s.id) === Number(item.id)
          );

          if (!sermon) return null;

          return (

            <button
              key={item.id}
              onClick={() => play(sermon, sermons)}
              className="group min-w-[260px] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 transition-all p-4 text-left"
            >

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">

                  <Play
                    className="w-6 h-6 text-white ml-1"
                    fill="white"
                  />

                </div>

                <div className="flex-1">

                  <h3 className="font-semibold text-white line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">

                    <Clock className="w-3 h-3" />

                    {sermon.duration_formatted}

                  </div>

                </div>

              </div>

            </button>

          );

        })}

      </div>

    </section>
  );
}