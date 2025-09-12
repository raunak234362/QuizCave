// AssessmentPage.tsx

import { useState, useEffect } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces/index";
import { Question } from "./ContestQuestion";
import { Counterdown } from "./Counterdown";
import Service from "../../../config/Service";


interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
  shuffleQuestions: any;
  setAssessmentComplete: (completed: boolean) => void; 
}

const AssessmentPage = ({
  resultDetails,
  contest,
  questionDetails,
  shuffleQuestions,
  setAssessmentComplete,
}: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionStatuses, setQuestionStatuses] = useState<{
    [key: string]: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const maxTabSwitches = 2; 
  

  const handleSaveAnswer = (
    qid: string,
    value: any,
    status: string = "attempted"
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
    setQuestionStatuses((prev) => ({
      ...prev,
      [qid]: status,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (questionDetails?.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("You have reached the end of the exam.");
    }
  };

  const autoSubmit = async () => {
    if (submitting) return; // Prevent multiple submissions
    setSubmitting(true);
    try {
      const response = await Service.finalSubmitAnswers({

        resultId: resultDetails?._id
      });
      console.log("Auto-submit response:", response.data);
      alert("Assessment auto-submitted due to a policy violation.");
      if (response.data.success) {
        setAssessmentComplete(true);
      }
    } catch (error) {
      console.error("Auto-submit failed:", error);
      alert("Auto-submission failed. Please contact support.");
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!resultDetails?._id) {
      alert("Missing result ID. Cannot submit.");
      return;
    }

    const confirmSubmit = window.confirm(
      " Are you sure you want to submit your final answers? You won’t be able to change them afterward."
    );
    if (!confirmSubmit) return;

    setSubmitting(true);
    try {
      await Service.finalSubmitAnswers({
        resultId: resultDetails._id
      });
      alert("Final answers submitted successfully!");
      setAssessmentComplete(true); // 💡 Set completion state
    } catch (error) {
      console.error("Final submit failed:", error);
      alert("Failed to submit final answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = async () => {
    alert("⏰ Time is up! Submitting your answers...");
    await autoSubmit();
  };

  useEffect(() => {
    document.documentElement.requestFullscreen?.({ navigationUI: "hide" });
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (tabSwitchCount < maxTabSwitches) {
          alert(
            `⚠️ Warning! You have ${
              maxTabSwitches - tabSwitchCount
            } warnings remaining. Switching tabs is not allowed.`
          );
          setTabSwitchCount(tabSwitchCount + 1);
        } else {
          alert("⚠️ Maximum tab switches exceeded. Submitting your assessment automatically.");
          autoSubmit();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitchCount]);

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

  // The rest of the component's JSX remains the same
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 🔹 Header with Timer */}
      <div className="flex justify-between items-center bg-white shadow p-4">
        <h1 className="text-xl font-bold text-gray-800">
          {contest?.name || "Assessment"}
        </h1>
        <Counterdown
          duration={Number(contest?.duration) || 30}
          onCountdownEnd={handleTimeUp}
        />
      </div>

      {/* 🔹 Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Question */}
        <div className="w-3/4 p-6 overflow-y-auto">
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
              answer={answers[questionDetails[currentQuestionIndex]._id]}
            />
          )}
        </div>

        {/* Right side: Question Panel */}
        <div className="w-1/4 p-5 border-l bg-white shadow-inner overflow-y-auto flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Question Panel
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {questionDetails.map((q, index) => {
              const status = questionStatuses[q._id];
              let buttonClass =
                "bg-gray-200 text-black hover:scale-105 transition-transform duration-200";

              if (status === "attempted") {
                buttonClass =
                  "bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform duration-200";
              } else if (status === "review") {
                buttonClass =
                  "bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 transition-transform duration-200";
              }

              if (index === currentQuestionIndex) {
                buttonClass =
                  "bg-blue-500 text-white ring-2 ring-blue-300 hover:bg-blue-600 hover:scale-110 transition-transform duration-200";
              }

              return (
                <button
                  key={q._id}
                  className={`p-3 rounded-xl text-sm font-bold border shadow-sm ${buttonClass}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                  title={
                    status === "attempted"
                      ? "Attempted"
                      : status === "review"
                      ? "Marked for Review"
                      : "Unattempted"
                  }
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span>
              <span>Attempted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-400"></span>
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-300"></span>
              <span>Unattempted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-500"></span>
              <span>Current Question</span>
            </div>
          </div>

          {/* Final Submit Button */}
          <div className="mt-8">
            <button
              onClick={handleFinalSubmit}
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {submitting ? "Submitting..." : "Final Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;