import { useState } from "react";
import { Watermark } from "@hirohe/react-watermark";
import Service from "../../../config/Service";
import toast from "react-hot-toast";

export interface QuestionType {
  _id: string;
  question?: string;
  text?: string;
  type: "short" | "numerical" | "long" | "multiple" | "mcq";
  difficult?: "easy" | "medium" | "hard";
  questionImage?: string;
  multipleQuestion?: string[];
  mcqOptions?: string[];
  options?: Array<{ label: string; value: string }>;
}

interface QuestionProps {
  Question: QuestionType;
  number: number;
  resultId: string;
  handleNextQuestion: any;
  shuffleQuestions: any;
  answer?: string[];
  onSaveAnswer: (qid: string, value: any, status?: string) => void;
  isLastQuestion?: boolean;
  onFinalSubmit?: () => void;
}

export const Question = ({
  Question,
  number,
  onSaveAnswer,
  resultId,
  handleNextQuestion,
  isLastQuestion,
  onFinalSubmit,
}: QuestionProps) => {
  const [answered, setAnswered] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSaveNext = async () => {
    // Validation: Check if user has answered
    if (!answered || answer.length === 0 || !answer[0]) {
      toast.error("Please provide an answer before proceeding.");
      return;
    }

    // Prevent duplicate submissions
    if (saving) {
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading(
      isLastQuestion ? "Saving final answer..." : "Saving answer...",
    );

    try {
      const submitData = { question: Question._id, answer };
      const response = await Service.AddAnswerById({
        resultId,
        submitData,
      });
      console.log("Answer saved response:", response);

      // Update local state
      onSaveAnswer(Question._id, answer, "attempted");

      if (isLastQuestion) {
        toast.success("All questions answered!", { id: loadingToast });
        if (onFinalSubmit) {
          onFinalSubmit();
        }
      } else {
        toast.success("Answer saved!", { id: loadingToast });
        // Move to next question
        handleNextQuestion();
      }
    } catch (error: any) {
      console.error("Error saving answer:", error);

      // Check if it's a duplicate answer error
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already answered")
      ) {
        toast.error(
          "This question was already answered. Moving to next question.",
          {
            id: loadingToast,
          },
        );
        // Still update local state and move to next
        onSaveAnswer(Question._id, answer, "attempted");

        if (isLastQuestion) {
          if (onFinalSubmit) {
            onFinalSubmit();
          }
        } else {
          handleNextQuestion();
        }
      } else {
        toast.error("Failed to save answer. Please try again.", {
          id: loadingToast,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Watermark text="Whiteboard Technologies" opacity={0.2} gutter={12}>
      <div className="h-[78vh] w-full bg-white shadow-md rounded-xl p-6 overflow-y-auto">
        {/* Question text */}
        {Question?.question && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {`${number}) ${Question?.question}`}
            </h2>
            <span className="px-3 py-1 rounded-full text-sm font-semibold text-red-600 bg-red-100">
              {Question.difficult === "easy"
                ? "1 mark"
                : Question.difficult === "medium"
                  ? "3 marks"
                  : "5 marks"}
            </span>
          </div>
        )}

        {/* Question image */}
        {Question?.questionImage && (
          <div className="flex justify-center my-6">
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${Question?.questionImage}`}
              alt="Question"
              className="max-h-80 rounded-lg shadow"
            />
          </div>
        )}

        {/* MCQ */}
        {Question.type === "mcq" && Question.mcqOptions && (
          <div className="flex flex-col space-y-3">
            {Question.mcqOptions.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name={`question-${Question._id}`}
                  value={option}
                  onChange={() => {
                    setAnswered(true);
                    setAnswer([option]);
                  }}
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple sub-questions */}
        {Question?.type === "multiple" && (
          <div className="space-y-4 mt-4">
            {Question?.multipleQuestion?.map((option, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  {`${index + 1}) ${option}`}
                </label>
                <input
                  type="text"
                  placeholder={`Answer for ${option}`}
                  onChange={(e) => {
                    setAnswered(true);
                    setAnswer((prev) => {
                      const newAnswers = [...prev];
                      newAnswers[index] = e.target.value;
                      return newAnswers;
                    });
                  }}
                  className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {/* Short answer */}
        {Question?.type === "short" && (
          <input
            type="text"
            placeholder="Type your answer..."
            onChange={(e) => {
              setAnswered(true);
              setAnswer([e.target.value]);
            }}
            className="border rounded-lg p-3 w-full mt-4 focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Numerical answer */}
        {Question?.type === "numerical" && (
          <input
            type="number"
            placeholder="Enter your answer..."
            onChange={(e) => {
              setAnswered(true);
              setAnswer([e.target.value]);
            }}
            className="border rounded-lg p-3 w-1/2 mt-4 focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Long answer */}
        {Question?.type === "long" && (
          <textarea
            placeholder="Write your detailed answer here..."
            onChange={(e) => {
              setAnswered(true);
              setAnswer([e.target.value]);
            }}
            className="border rounded-lg p-3 w-full h-40 mt-4 focus:ring-2 focus:ring-blue-500"
          />
        )}

        {/* Action buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg shadow"
            onClick={() => onSaveAnswer(Question._id, answer, "review")}
          >
            Mark for Review
          </button>

          <button
            type="button"
            disabled={saving}
            className={`${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-black font-semibold px-5 py-2 rounded-lg shadow transition-colors`}
            onClick={handleSaveNext}
          >
            {saving
              ? isLastQuestion
                ? "Submitting..."
                : "Saving..."
              : isLastQuestion
                ? "Save & Submit"
                : "Save & Next"}
          </button>
        </div>
      </div>
    </Watermark>
  );
};
