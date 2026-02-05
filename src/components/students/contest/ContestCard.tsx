import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces";
import { useState } from "react";
import Service from "../../../config/Service";
import { Assessment } from "./Assessment";

const ContestCard = ({ contest }: { contest: ContestData }) => {
  const [attempt, setAttempt] = useState(false);
  const [contestData, setContestData] = useState(contest);
  const [resultData, setResultData] = useState<ResultDetails | null>(null);
  const [questionData, setQuestionData] = useState<QuestionData[] | null>(null);

  const handleAttendClick = async () => {
    try {
      const res = await Service.studentContestAttempt({ id: contest._id });

      setContestData(res.data.contest);
      setResultData(res.data.result);
      setQuestionData(res.data.questions);
      setAttempt(true);
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.status === 500) {
        alert("⚠️ You have already attempted this assessment.");
      } else {
        alert("Failed to load assessment.");
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
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Attend
      </button>
    </div>
  );
};

export default ContestCard;
