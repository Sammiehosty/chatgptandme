import { Play, Clock } from "lucide-react";
import type { Sermon } from "../types";

interface ContinueListeningCardProps {
  sermon: Sermon | null;
  progress: number;
  onResume: () => void;
}

export default function ContinueListeningCard({
  sermon,
  progress,
  onResume,
}: ContinueListeningCardProps) {
  if (!sermon) return null;

  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950">

        <div className="absolute right-0 top-0 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full" />

        <div className="relative p-8">

          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
            Continue Listening
          </p>

          <h2 className="text-white text-3xl font-bold mt-2">
            {sermon.title}
          </h2>

          <div className="flex items-center gap-2 mt-3 text-slate-400">

            <Clock size={16} />

            <span>{progress}% completed</span>

          </div>

          <div className="mt-6">

            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">

              <div
                className="h-full bg-amber-400 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <button
            onClick={onResume}
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 transition-all hover:scale-105"
          >
            <Play fill="currentColor" />

            Resume Listening
          </button>

        </div>

      </div>
    </section>
  );
}
