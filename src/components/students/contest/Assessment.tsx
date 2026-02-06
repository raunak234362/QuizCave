// Assessment.tsx
import { useState } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces";
import { ContestRules } from "./ContestRules";
import AssessmentPage from "./AssessmentPage";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";

// Shuffle questions for randomization
const shuffleQuestions = (questions: QuestionData[]) => {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
}

export function Assessment({ contest, resultDetails, questionDetails }: Props) {
  const [startExam, setStartExam] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  if (completed) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-3xl font-bold text-green-600">
            Assessment Completed 🎉
          </h1>

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-black rounded"
            onClick={() => navigate("/dashboard/student/profile")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[9999]">
      <Header user={resultDetails?.userId} contest={contest?.name} />

      {!startExam && (
        <>
          <ContestRules contest={contest} start={setStartExam} />
        </>
      )}

      {startExam && (
        <>
          <AssessmentPage
            contest={contest}
            resultDetails={resultDetails}
            questionDetails={questionDetails}
            shuffleQuestions={shuffleQuestions}
            setAssessmentComplete={setCompleted}
          />
        </>
      )}
    </div>
  );
}
