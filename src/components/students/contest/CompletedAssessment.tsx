import React from "react";
import Service from "../../../config/Service"; // Corrected import path
import type { ContestData, UserToken } from "../../Interfaces";


// Assuming a specific type for the result object
interface ResultData {
  _id?: string;
  // Other properties of the result object, e.g., answers, score, etc.
  answers?: any; // Adjust this type based on your actual data
}

interface CompletedAssessmentProps {
  result: ResultData;
  contest: ContestData;
}

export const CompletedAssessment: React.FC<CompletedAssessmentProps> = ({
  result,
  contest,
}) => {
  const handleSubmit = async () => {
    try {
      if (!result?._id) {
        alert("Submission failed: Contest ID is missing.");
        return;
      }
      const tokenString = sessionStorage.getItem("token");
      if (!tokenString) {
        alert("You are not authenticated. Please log in again.");
        return;
      }

      // Convert token string to UserToken object
      const token: UserToken = JSON.parse(tokenString);

      // Use the service to submit the final answers
      await Service.studentContestSubmit({
        id: result._id,
        token: token,
        answers: result.answers,
      });

      alert(
        "Your answers have been successfully submitted.\nYou will be notified when results are declared."
      );
      // Redirect to the home page or a specific results page
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      alert("An error occurred during submission. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center my-20 select-none bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-5xl md:text-6xl font-bold text-center text-green-500">
          Congratulations! 🎉
        </h1>
        <svg
          width="100"
          height="100"
          viewBox="0 0 50 50"
          className="text-green-500 h-40 w-40 md:h-80 md:w-80"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="circle"
          ></circle>
          <path
            d="M15 25 L22 32 L35 18"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="check"
          ></path>
        </svg>
        <div className="my-10 flex flex-col items-center">
          <h1 className="text-black text-2xl md:text-3xl font-semibold text-center">
            You have successfully completed the {contest?.name} quiz!
          </h1>
          <h1 className="text-black text-2xl md:text-3xl font-semibold text-center my-5">
            Please do the final submission.
          </h1>
          <button
            className="bg-green-500 text-lg md:text-2xl font-semibold px-12 py-4 rounded-2xl border-2 border-green-500 hover:bg-white hover:text-green-500 text-white transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Final Submit
          </button>
        </div>
      </div>
    </>
  );
};
