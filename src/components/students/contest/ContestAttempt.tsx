import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Service from "../../../config/Service";
import type { ContestData } from "../../Interfaces";
import { AssessmentPage } from "./AssessementPage";
import  ContestRules  from "./ContestRules";

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
interface ContestAttemptProps {
  Contest: ContestData;
  onBack: () => void;
}
const ContestAttend: React.FC<ContestAttemptProps> = () => {




  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contest, setContest] = useState<ContestData | null>(null);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(true);

  const token = sessionStorage.getItem("token") || "";

  useEffect(() => {
    if (!id) {
      setError("Contest ID is missing.");
      setLoading(false);
      return;
    }
    const fetchContestData = async () => {
      try {
        setLoading(true);
        const [contestDetails, contestQuestions] = await Promise.all([
          Service.getStudentContestDetails({ id, token }),
          Service.studentContestAttempt({ id, token, answers: {} }),
        ]);
        setContest(contestDetails);
        setQuestions(contestQuestions.questions || []);
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError("Failed to fetch contest details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchContestData();
  }, [id, token]);

  const handleStart = () => {
    setShowRules(false);
  };

  const handleCancel = () => {
    // Navigate back to the main contest list page
    navigate("/contest");
  };

  if (loading) {
    return <div className="text-center p-10">Loading contest...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600">{error}</div>;
  }

  if (!contest || questions.length === 0) {
    return (
      <div className="text-center p-10">Contest or questions not found.</div>
    );
  }

  return (
    <div className="p-5">
      {showRules ? (
        <ContestRules
          rules={contest?.rules || "No rules provided for this contest."}
          onStart={handleStart}
          onCancel={handleCancel}
        />
      ) : (
        <AssessmentPage contest={contest} questions={questions} />
      )}
    </div>
  );
};

export default ContestAttend;
