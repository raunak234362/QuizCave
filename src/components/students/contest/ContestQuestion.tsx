import { useState } from "react";
import { Watermark } from "@hirohe/react-watermark";
import Service from "../../../config/Service";

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
}

export const Question = ({
  Question,
  number,
  onSaveAnswer,
  resultId,
  handleNextQuestion,
}: QuestionProps) => {
  const [answered, setAnswered] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string[]>([]);


  const handleSaveNext = async () => {
    const submitData = { question: Question._id, answer };
    const response = await Service.AddAnswerById({
      resultId,
      submitData
    });
    console.log("Answer saved response:", response);
    if (answered) {
      handleNextQuestion();
      onSaveAnswer(Question._id, answer);
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg shadow"
            onClick={() => onSaveAnswer(Question._id, answer, "review")}
          >
            Mark for Review
          </button>

          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
            onClick={handleSaveNext}
          >
            Save & Next
          </button>
        </div>
      </div>
    </Watermark>
  );
};
