import { Play, Clock } from "lucide-react";
import type { Sermon } from "../types";

interface Props {
    sermon: Sermon | null;
    progress: number;
    onResume: () => void;
}

export default function ContinueListeningCard({
    sermon,
    progress,
    onResume
}: Props) {

    if (!sermon) return null;

    return (

        <section className="mb-10">

            <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 overflow-hidden">

                <div className="p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-amber-400 text-sm font-semibold mb-2">
                                Continue Listening
                            </p>

                            <h2 className="text-white text-2xl font-bold">
                                {sermon.title}
                            </h2>

                            <div className="flex items-center gap-2 mt-3 text-slate-400">

                                <Clock size={16} />

                                <span>

                                    {progress}% completed

                                </span>

                            </div>

                        </div>

                        <button

                            onClick={onResume}

                            className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 transition flex items-center justify-center shadow-lg"

                        >

                            <Play
                                className="text-black"
                                fill="currentColor"
                            />

                        </button>

                    </div>

                    <div className="mt-6">

                        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">

                            <div

                                className="h-full bg-amber-400 transition-all"

                                style={{

                                    width: `${progress}%`

                                }}

                            />

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}
