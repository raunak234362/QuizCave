import { useEffect, useState } from "react";
import Service from "../../../config/Service"; // adjust path to your Service.ts
import type { ResultDetails, UserToken } from "../../Interfaces"; // adjust import path

interface ResultPageProps {
  id: string; // contest result ID passed via props/route
  token: UserToken; // token comes from context/localstorage
}

export default function ResultPage({ id, token }: ResultPageProps) {
  const [result, setResult] = useState<ResultDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await Service.studentContestResultDetails({
          id,
        });
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, token]);

  if (loading) return <p className="text-center">Loading results...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!result) return <p className="text-center">No result found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Test Results</h1>

      {/* Contest Info */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-semibold">{result.contestId}</h2>
        <p className="text-gray-600">
          Submitted on: {new Date(result.sumbittedOn).toLocaleString()}
        </p>
        <p className="text-gray-600">
          Time Taken: {(result.timeTaken / 3600).toFixed(2)} hours
        </p>
        <p className="mt-2 text-lg font-bold">Score: {result.totalMarks}</p>
      </div>

      {/* User Info */}
      <div className="bg-white shadow-md rounded-2xl p-5 mb-6">
        <h3 className="text-lg font-semibold mb-2">Student Info</h3>
        <p>Name: {result.userId?.name || "Unknown User"}</p>
        <p>Email: {result.userId?.email || "N/A"}</p>
        <p>College: {result.userId?.college ?? "N/A"}</p>
      </div>

      {/* Answers Breakdown */}
      <div className="bg-white shadow-md rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-3">Answer Breakdown</h3>
        {Array.isArray(result.answers) && result.answers.length > 0 ? (
          <ul className="space-y-3">
            {result.answers.map((ans: any, idx: number) => (
              <li key={idx} className="border rounded-lg p-3 bg-gray-50">
                <p className="font-medium">
                  Q{idx + 1}: {ans.questionId?.question}
                </p>

                {ans.questionId?.mcqOptions && (
                  <ul className="list-disc list-inside ml-4">
                    {ans.questionId.mcqOptions.map((opt: string, i: number) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}

                <p className="mt-1">
                  <strong>Your Answer:</strong>{" "}
                  {ans.answer?.join(", ") || "Not Answered"}
                </p>

                {ans.questionId?.answer && (
                  <p>
                    <strong>Correct Answer:</strong> {ans.questionId.answer}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No answers available.</p>
        )}
      </div>
    </div>
  );
}
