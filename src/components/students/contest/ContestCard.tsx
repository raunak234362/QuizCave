import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces";
import { useState } from "react";
import Service from "../../../config/Service";
import { Assessment } from "./Assessment";
import toast from "react-hot-toast";

const ContestCard = ({ contest }: { contest: ContestData }) => {
  const [attempt, setAttempt] = useState(false);
  const [contestData, setContestData] = useState(contest);
  const [resultData, setResultData] = useState<ResultDetails | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData[] | null>(null);

  const handleAttendClick = async () => {
    const loadingToast = toast.loading("Loading assessment...");

    try {
      const res = await Service.studentContestAttempt({ id: contest._id });
      console.log(res.data);

      setContestData(res.data.contest);
      setResultData(res.data.result);
      setQuestionData(res.data.questions);
      setAttempt(true);

      toast.success("Assessment loaded successfully!", { id: loadingToast });
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.status === 500) {
        toast.error("You have already attempted this assessment.", {
          id: loadingToast,
        });
      } else {
        toast.error("Failed to load assessment. Please try again.", {
          id: loadingToast,
        });
      }
    }
  };

  if (attempt) {
    return (
      <Assessment
        contest={contestData}
        resultDetails={resultData}
        questionDetails={questionData}
      />
    );
  }

  return (
    <div className="w-80 p-5 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-lg font-bold">{contest.name}</h2>

      <button
        onClick={handleAttendClick}
        className="mt-4 px-4 py-2 bg-blue-600 border shadow-lg text-black rounded-lg hover:bg-blue-700"
      >
        Attend
      </button>
    </div>
  );
};

export default ContestCard;
