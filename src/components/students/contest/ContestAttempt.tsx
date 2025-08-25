import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ContestService from "../../../config/Service";
import type { ContestData } from "../../Interfaces";
import { Question } from "./ContestQuestion";

interface QuestionType {
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

interface ContestAttendProps {
  contest?: ContestData;
  onBack?: () => void;
}

const ContestAttend = ({
  contest: propsContest,
  onBack,
}: ContestAttendProps) => {
  const location = useLocation();
  const [contest, setContest] = useState<ContestData | null>(
    propsContest || (location.state as any)?.contest || null
  );

  const id =
    typeof contest?._id === "string"
      ? contest._id
      : (contest?._id as any)?.toString?.() ?? "";
  console.log("Contest ID:", id);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 new state for Rules Modal
  const [showRules, setShowRules] = useState(true);

  const token = sessionStorage.getItem("token") || "";

  useEffect(() => {
    if (!contest && id) {
      const fetchDetails = async () => {
        try {
          const data = await ContestService.getStudentContestDetails({
            id,
            token,
          });
          setContest(data);
        } catch (error) {
          console.error("Error fetching contest details:", error);
        }
      };
      fetchDetails();
    }
  }, [contest, id, token]);

  const handleStart = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await ContestService.studentContestAttempt({ id, token });
      setQuestions(data.questions || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error starting contest:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAnswer = (qid: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setCurrentIndex((prev) => prev + 1);
  };
  
  console.log("Current Answers:", answers);

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await ContestService.studentContestSubmit({ id, token, answers } as any);
      alert("Contest submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting contest:", error);
    }
  };

  if (!contest) return <p>Loading contest...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">{contest.name}</h1>
      <p>{contest.description}</p>

      {/* 🔹 Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-3">Contest Rules</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Once you start, the timer will begin immediately.</li>
              <li>You cannot go back to previous questions.</li>
              <li>
                Each question has limited time. If you don’t answer, it will
                auto skip.
              </li>
              <li>Do not refresh or leave the page.</li>
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRules(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                I Agree & Start
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-400 text-black rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {questions.length === 0 && !submitted && !showRules ? (
        <button
          onClick={handleStart}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Starting..." : "Start Contest"}
        </button>
      ) : submitted ? (
        <div className="mt-5 text-lg text-green-600 font-semibold">
          Your answers have been submitted!
        </div>
      ) : (
        <>
          {questions[currentIndex] && (
            <Question
              Question={questions[currentIndex]}
              number={currentIndex + 1}
              onSaveAnswer={handleSaveAnswer}
            />
          )}

          {currentIndex >= questions.length && !submitted && (
            <button
              onClick={handleSubmit}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Submit Contest
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ContestAttend;
