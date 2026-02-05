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
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        onClick={() => {
          console.log("Start Assessment button clicked");
          console.log("start function:", start);

          const ok = window.confirm(
            "Please read all instructions carefully.\n\nDo you want to start the assessment?",
          );

          if (!ok) {
            console.log("User cancelled");
            return;
          }

          console.log("User confirmed, calling start(true)...");
          start(true);
          console.log("start(true) called successfully");

          // Try fullscreen after starting (non-blocking)
          document.documentElement
            .requestFullscreen({ navigationUI: "hide" })
            .then(() => console.log("Fullscreen activated"))
            .catch((err) => console.warn("Fullscreen failed:", err));
        }}
      >
        Start Assessment
      </button>
    </div>
  );
};
