import { Button } from "@headlessui/react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces/index";
import { useState, useEffect } from "react";
import Service from "../../../config/Service";
import { Assessment } from "./Assessment";

const ContestCard = ({ contest }: { contest: ContestData }) => {
  const [attempt, setAttempt] = useState(false);
  const [contestData, setContestData] = useState(contest);
  const [resultData, setResultData] = useState<ResultDetails>();
  const [questionData, setQuestionData] = useState<QuestionData[]>();

  const contestID = contest._id;

  // 🔍 Check status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
      } catch (err: any) {
        if (err.response && err.response.status === 409) {
          alert("You have already attempted this assessment.");
        } else {
          console.error("Error checking contest status:", err);
        }
      }
    };

    checkStatus();
  }, [contestID]);

  const handleAttendClick = async () => {
    try {
      // Request fullscreen before starting the assessment
      try {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
      } catch (fsError) {
        console.warn("Fullscreen not supported or denied:", fsError);
        const proceed = window.confirm(
          "Fullscreen mode is required for this assessment. Please enable fullscreen when prompted. Continue?",
        );
        if (!proceed) return;
      }

      const response = await Service.studentContestAttempt({ id: contestID });

      setResultData(response.data.result);
      setContestData(response.data.contest);
      setQuestionData(response.data.questions);
      setAttempt(true);
    } catch (err: any) {
      // Exit fullscreen if there's an error
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }

      if (err.response?.status === 500) {
        alert("⚠️ You have already attempted this assessment.");
      } else {
        alert("Unable to load assessment. Please try again.");
      }
    }
  };

  if (attempt) {
    return (
      <Assessment
        contest={contestData}
        resultDetails={resultData || null}
        questionDetails={questionData || null}
      />
    );
  }

  return (
    <div className="w-80 p-5 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-bold">{contest.name}</h2>

      <Button
        onClick={handleAttendClick}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Attend
      </Button>
    </div>
  );
};

export default ContestCard;
