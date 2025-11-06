// AssessmentWrapper.tsx (Example Parent Component)

import { useState } from "react";
import AssessmentPage from "./AssessmentPage";
import type { ContestData, ResultDetails, QuestionData, UserToken, UserData } from "../../Interfaces/index";

const mockContest: ContestData = {
    _id: "c1",
    name: "Sample Assessment",
    duration: "60",
    passingScore: 70,
    description: "",
    startDate: "",
    declared: false,
    endDate: "",
    set: "",
    status: "active",
    createdBy: "",
    createdAt: "",
    rules: ""
};

const mockResultDetails: ResultDetails = {
    _id: "r1",
    token: "sample-token" as UserToken,
    contestId: "",
    declared: false,
    sumbittedOn: "",
    timeTaken: 0,
    totalMarks: 0,
    answers: [],
    userId: {} as UserData
};

const mockQuestionDetails: QuestionData[] = [
  // ... your question data
];

const AssessmentWrapper = () => {
  const [isAssessmentComplete, setAssessmentComplete] = useState(false);
  console.log("Assessment completion state:", isAssessmentComplete);

  if (isAssessmentComplete) {
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
          <img
            src="https://example.com/thankyou.png"
            alt="Thank You"
            className="mt-8 max-w-xs mx-auto"
          />
        </div>
      </div>
    );
  }

  // The code below was commented out and has been re-enabled.
  // It is the essential part that renders the AssessmentPage component.
  return (
    <AssessmentPage
      contest={mockContest}
      resultDetails={mockResultDetails}
      questionDetails={mockQuestionDetails}
      shuffleQuestions={() => []} // A placeholder function is fine here.
      setAssessmentComplete={setAssessmentComplete} // This is the state setter that triggers the re-render to the completion page.
    />
  );
};

export default AssessmentWrapper;