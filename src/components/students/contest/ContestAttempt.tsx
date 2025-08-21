import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ContestService from "../../../config/Service";
import type { ContestData } from "../../Interfaces";

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
    const id = typeof contest?._id === "string" ? contest._id : (contest?._id as any)?.toString?.() ?? "";
  console.log("=------------=-==-", contest, propsContest, location.state, "id -=-=-", id);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token") || "";

  // ✅ Fetch contest details if not passed from state
  useEffect(() => {
    if (!contest && id) {
      const fetchDetails = async () => {
        try {
          const data = await ContestService.getStudentContestDetails({
            id,
            token,
          });
            console.log("Fetched contest details:", data);
          setContest(data);
        } catch (error) {
          console.error("Error fetching contest details:", error);
        }
      };
      fetchDetails();
    }
  }, [contest, id, token]);

  // ✅ Start contest attempt (fetch questions)
  const handleStart = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await ContestService.studentContestAttempt({ id, token });
      setQuestions(data.questions || []); // assuming API returns questions
    } catch (error) {
      console.error("Error starting contest:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit contest
  const handleSubmit = async () => {
    if (!id) return;
    try {
      const result = await ContestService.studentContestSubmit({ id, token });
      alert("Contest submitted successfully!");
      console.log("Result:", result);
    } catch (error) {
      console.error("Error submitting contest:", error);
    }
  };

  if (!contest) return <p>Loading contest...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">{contest.name}</h1>
      <p>{contest.description}</p>

      {onBack && (
        <button
          onClick={onBack}
          className="mt-3 px-3 py-1 bg-gray-500 text-white rounded"
        >
          ⬅ Back
        </button>
      )}
      {/* Show Start Contest button */}
      {questions.length === 0 ? (
        <button
          onClick={handleStart}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Starting..." : "Start Contest"}
        </button>
      ) : (
        <div className="mt-5">
          <h2 className="text-xl font-bold">Questions</h2>
          <ul className="list-disc ml-6">
            {questions.map((q, i) => (
              <li key={i}>{q.text || JSON.stringify(q)}</li>
            ))}
          </ul>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Submit Contest
          </button>
        </div>
      )}
    </div>
  );
};

export default ContestAttend;
