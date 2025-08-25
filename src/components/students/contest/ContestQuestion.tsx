import { useState, useEffect } from "react";
import { Watermark } from "@hirohe/react-watermark";

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
  onSaveAnswer: (qid: string, value: any) => void;
}

export const Question = ({ Question, number, onSaveAnswer }: QuestionProps) => {
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30); // 🔹 30 sec per question

  // 🔹 Timer effect
  useEffect(() => {
    setTimeLeft(30); // reset timer for new question
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSaveAnswer(Question._id, answer); // auto save
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [Question._id]);

  const handleSaveNext = () => {
    if (answered) {
      onSaveAnswer(Question._id, answer);
    } else {
      alert("Please attempt the question before proceeding.");
    }
  };

  return (
    <Watermark text="Whiteboard Technologies" opacity={0.3} gutter={10}>
      {/* 🔹 Timer UI */}
      <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
        <span className="font-semibold">Q{number}</span>
        <span className="text-red-600 font-bold">⏳ {timeLeft}s</span>
      </div>

      <div className="h-[78vh] w-full">
        {/* 🔹 This block renders the question text, regardless of type */}
        {(Question?.question || Question?.text) && (
          <div className="text-black font-semibold text-xl flex justify-between">
            <span>{`${number}) ${Question?.question || Question?.text}`}</span>
            {Question?.difficult && (
              <span className="text-red-500 font-mono text-lg">
                {Question.difficult === "easy"
                  ? "1"
                  : Question.difficult === "medium"
                  ? "3"
                  : "5"}{" "}
                marks
              </span>
            )}
          </div>
        )}

        {/* 🔹 This block renders the MCQ options, only if type is "mcq" */}
        {Question.type === "mcq" && Question.mcqOptions && (
          <div className="flex flex-col mt-4">
            {Question.mcqOptions.map((option, index) => (
              <label key={index} className="inline-flex items-center mt-3">
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
                <span className="ml-2 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/*
          Add other input fields here for different question types:
          - short/numerical: <input type="text" ... />
          - long: <textarea ... />
        */}

        <div>
          <button
            type="button"
            className="bg-blue-500 text-white font-bold p-2 rounded-lg m-5 w-32"
            onClick={handleSaveNext}
          >
            Save & Next
          </button>
        </div>
      </div>
    </Watermark>
  );
};
