"use client";

import React, { useState, useEffect } from "react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
} from "../../Interfaces/index";
import { Question } from "./ContestQuestion";

interface Props {
  contest: ContestData | null;
  resultDetails: ResultDetails | null;
  questionDetails: QuestionData[] | null;
}

const AssessmentPage = ({ resultDetails, contest, questionDetails }: Props) => {
  const [next, setNext] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleTabChange = () => {
    setNext(questionDetails?.length ?? 0);
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.startsWith("F") || e.key === "Escape") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("visibilitychange", handleTabChange);

    // Request full screen
    document.documentElement.requestFullscreen?.({ navigationUI: "hide" });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("visibilitychange", handleTabChange);
    };
  }, []);

  // ✅ Callback to save answers from Question component
  const handleSaveAnswer = (qid: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: value,
    }));
  };

  console.log("Rendering AssessmentPage with props:", {
    resultDetails,
    contest,
    questionDetails,
    answers,
  });

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
      <h1 className="text-2xl font-bold mb-4">{contest.name} Assessment</h1>
      <p className="text-gray-600 mb-4">
        Total Questions: {questionDetails.length}
      </p>

      {/* ✅ Pass correct props */}
      {questionDetails.map((q, index) => (
        <Question
          key={q._id}
          Question={q}
          result={resultDetails}
          number={index + 1}
          onSaveAnswer={handleSaveAnswer}
        />
      ))}
    </div>
  );
};

export default AssessmentPage;
