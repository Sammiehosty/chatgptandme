import { Play, Clock } from "lucide-react";
import { usePlayer } from "../../PlayerContext";
import { useAuth } from "../../context/AuthContext";
import useContinueListening from "../hooks/useContinueListening";

interface Props {
  sermons: any[];
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);

  const m = Math.floor((seconds % 3600) / 60);

  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }

  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ContinueListening({
  sermons,
}: Props) {
  const { user } = useAuth();

  const { continueListening, loading } =
    useContinueListening(user);

  const { play } = usePlayer();

  if (loading) return null;

  if (!continueListening) return null;

  const sermon = sermons.find(
    (s) => Number(s.id) === Number(continueListening.sermon_id)
  );

  if (!sermon) return null;

  const progress =
    continueListening.progress_percent || 0;

  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-6 backdrop-blur-xl">

      <div className="flex items-center justify-between mb-5">

        <div>

          <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">
            Continue Listening
          </p>

          <h2 className="text-xl font-bold text-white mt-1">
            {sermon.title}
          </h2>

        </div>

        <button
          onClick={() => play(sermon, sermons)}
          className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 transition-all flex items-center justify-center shadow-xl"
        >
          <Play
            className="w-6 h-6 text-white ml-1"
            fill="white"
          />
        </button>

      </div>

      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">

        <div className="flex items-center gap-2">

          <Clock className="w-3 h-3" />

          {formatTime(
            continueListening.current_time
          )}

        </div>

        <div>

          {formatTime(
            continueListening.duration
          )}

        </div>

      </div>

    </div>
  );
}