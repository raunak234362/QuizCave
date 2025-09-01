// AssessmentPage.tsx

import React, { useState, useEffect } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
  UserToken,
} from "../../Interfaces/index";
import { Question } from "./ContestQuestion";
import { Header } from "./Header";


interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
  shuffleQuestions: any;
}

const AssessmentPage = ({
  resultDetails,
  contest,
  questionDetails,
  shuffleQuestions,
}: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleSaveAnswer = (qid: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
  };

  // This function handles moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questionDetails?.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("You have reached the end of the exam.");
      // Add logic to auto-submit the exam here
    }
  };

  // Add all your other useEffects and functions here, like the full-screen one
  useEffect(() => {
    // Request full screen
    document.documentElement.requestFullscreen?.({ navigationUI: "hide" });
  }, []);

  if (!contest || !resultDetails || !questionDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">
            Error Loading Assessment
          </h2>
          <p className="text-gray-600">
            Missing required data to display the assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full h-[85vh]">
        {/* Left side: The Question component */}
        <div className="w-3/4 p-5 overflow-y-auto">
          {questionDetails[currentQuestionIndex] && (
            <Question
              key={questionDetails[currentQuestionIndex]._id}
              Question={{
                ...questionDetails[currentQuestionIndex],
                type: questionDetails[currentQuestionIndex].type as
                  | "short"
                  | "numerical"
                  | "long"
                  | "multiple"
                  | "mcq",
                difficult: ["easy", "medium", "hard"].includes(
                  questionDetails[currentQuestionIndex].difficult
                )
                  ? (questionDetails[currentQuestionIndex].difficult as
                      | "easy"
                      | "medium"
                      | "hard")
                  : undefined,
              }}
              resultId={resultDetails?._id}
              number={currentQuestionIndex + 1}
              shuffleQuestions={shuffleQuestions}
              handleNextQuestion={handleNextQuestion}
              onSaveAnswer={handleSaveAnswer}
              token={resultDetails?.token as UserToken}
            />
          )}
        </div>

        {/* Right side: The Question Panel */}
        <div className="w-1/4 p-5 border-l border-gray-300 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Question Panel</h3>
          <div className="grid grid-cols-5 gap-3">
            {questionDetails.map((q, index) => (
              <button
                key={q._id}
                className={`p-3 rounded-lg text-sm font-bold border ${
                  answers[q._id]
                    ? "bg-green-500 text-white"
                    : index === currentQuestionIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
