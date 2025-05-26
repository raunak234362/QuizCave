// CardContest.tsx
import React, { useEffect, useState } from "react";
import Service from "../../../config/Service";
import type { ContestData } from "../../Interfaces";

interface CardContestProps {
  id: string;
}

const CardContest = ({ id }: CardContestProps) => {
  console.log("Received Contest ID in CardContest:", id);
  const [contestDetails, setContestDetails] = useState<ContestData>();
  useEffect(() => {
    const fetchContestDetails = async () => {
      const response = await Service.fetchContestDetails({
        id,
        token: sessionStorage.getItem("token") || "",
      });
      setContestDetails(response);
      console.log("Contest Details:", response);
    };

    fetchContestDetails();
  }, [id]);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {contestDetails?.name || "Loading..."}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">Set:</span>{" "}
        {contestDetails?.set}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">Start Date:</span>{" "}
        {new Date(contestDetails?.startDate || "").toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">End Date:</span>{" "}
        {new Date(contestDetails?.endDate || "").toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {contestDetails?.declared ? (
          <span className="text-green-600 font-semibold">Declared</span>
        ) : (
          <span className="text-yellow-600 font-semibold">Not Declared</span>
        )}
      </p>
      <div className="flex flex-row items-center justify-between gap-2">
        <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
          Show
        </button>
        <button className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
};

export default CardContest;
