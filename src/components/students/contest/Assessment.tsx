import { useState } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces/index";
import { ContestRules } from "./ContestRules";
import AssessmentPage from "./AssessmentPage";
import { Header } from "./Header";

interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
}

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

export function Assessment({ contest, resultDetails, questionDetails }: Props) {
  const [assessmentPage, setAssessmentPage] = useState(false);
  const contestDetail = contest;
  console.log("Rendering Result props:", resultDetails);
  console.log("Rendering Contest props:", contestDetail);
  console.log("Rendering Question props:", questionDetails);

  // questionDetails = shuffleQuestions(questionDetails);

  return (
    <>
      <Header user={resultDetails?.userId} contest={contest?.name} />
      {!assessmentPage && (
        <div className="h-screen overflow-y-auto my-2 py-2">
          <ContestRules contest={contestDetail} start={setAssessmentPage} />
        </div>
      )}
      {assessmentPage && (
        <AssessmentPage
          resultDetails={resultDetails}
          contest={contest}
          shuffleQuestions={shuffleQuestions}
          questionDetails={questionDetails}
        />
      )}
    </>
  );
}
