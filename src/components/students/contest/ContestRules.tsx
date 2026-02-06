import parse from "html-react-parser";
import type { ContestData } from "../../Interfaces";

interface ContestRulesProps {
  contest: ContestData | null;
  start: (value: boolean) => void;
}

export const ContestRules = ({ contest, start }: ContestRulesProps) => {
  return (
    <div className="w-1/2 mx-auto border rounded-lg p-6 my-10">
      <h2 className="text-2xl font-bold mb-4">Instructions</h2>

      <div className="mb-6">{contest && parse(contest.rules || "")}</div>

      <button
        className="bg-green-600 hover:bg-green-700 text-black font-bold py-2 px-6 rounded"
        onClick={() => {
          const ok = window.confirm(
            "Please read all instructions carefully.\n\nDo you want to start the assessment?",
          );

          if (!ok) return;

          start(true);

          // Try fullscreen after starting (non-blocking)
          document.documentElement
            .requestFullscreen({ navigationUI: "hide" })
            .catch(() => {});
        }}
      >
        Start Assessment
      </button>
    </div>
  );
};
