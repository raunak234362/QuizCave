// Assessment.tsx

import { useState } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces/index";
import { ContestRules } from "./ContestRules";
import AssessmentPage from "./AssessmentPage";
import { Header } from "./Header";
// Import the component that displays the "Completed" message


// Your shuffleQuestions function here
const shuffleQuestions = (questions: QuestionData[]) => {
  const shuffledQuestions = [...questions];
  let currentIndex = shuffledQuestions.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    const temporaryValue = shuffledQuestions[currentIndex];
    shuffledQuestions[currentIndex] = shuffledQuestions[randomIndex];
    shuffledQuestions[randomIndex] = temporaryValue;
  }
  return shuffledQuestions;
};

interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
}

export function Assessment({ contest, resultDetails, questionDetails }: Props) {
  // This state controls the transition from the rules to the assessment questions
  const [showAssessmentPage, setShowAssessmentPage] = useState(false);
  // This state controls the transition to the final "completed" screen
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);

  const contestDetail = contest;

  // If the assessment is completed, immediately render the final page
  if (isAssessmentCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="p-10 bg-white rounded-lg shadow-xl text-center">
          <h1 className="text-4xl font-extrabold text-green-600 mb-4">
            Assessment Completed! 🎉
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for attending the test.
          </p>
          <p className="text-sm text-gray-500">
            You may now close this window or navigate away.
          </p>
        </div>
      </div>
    );
  }


  return (
    <>
      <Header user={resultDetails?.userId} contest={contest?.name} />

      {/* Conditionally render the ContestRules page if the assessment hasn't started */}
      {!showAssessmentPage && (
        <div className="h-screen overflow-y-auto my-2 py-2">
          <ContestRules contest={contestDetail} start={setShowAssessmentPage} />
        </div>
      )}

      {/* Conditionally render the AssessmentPage if the assessment has started but is not yet completed */}
      {showAssessmentPage && (
        <AssessmentPage
          resultDetails={resultDetails}
          contest={contest}
          shuffleQuestions={shuffleQuestions}
          questionDetails={questionDetails}
          setAssessmentComplete={setIsAssessmentCompleted}
        />
      )}
    </>
  );
}
