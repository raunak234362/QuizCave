
import parse from 'html-react-parser';

import type { ContestData } from "../../Interfaces/index";

interface ContestRulesProps {
  contest: ContestData | null;
  start: (value: boolean) => void;
}

export const ContestRules = ({ contest, start }: ContestRulesProps) => {
  console.log("Rendering ContestRules with rules:", contest);
  return (
    <>
      <div className="w-1/2 mx-auto border-2 rounded-lg p-3 my-5 overflow-y-auto">
        {contest && (
          <div className="text-lg my-5">
            <div className="text-black text-2xl font-bold">Instructions</div>
            <div className="mx-10">{parse(contest?.rules || "")}</div>
          </div>
        )}
        <div className="text-lg">
          <button
            className="bg-[#6adb45] hover:bg-[#40852f] text-white font-bold py-2 px-4 rounded"
            onClick={async (e) => {
              e.preventDefault();
              const info = await confirm(
                "Please read the rules and regulation carefully before starting the assessment.\n\nDo you want to start the assessment?"
              );
              if (info) {
                start(true);
              }
            }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    </>
  );
};
