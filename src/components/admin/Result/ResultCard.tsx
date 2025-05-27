import { useEffect } from "react";
import type { ResultCardProps } from "../../Interfaces";
import Service from "../../../config/Service";

const ResultCard = ({ item }: ResultCardProps) => {
  const fetchResultDetails = async (id: string) => {
    const response = await Service.declareResult({
      id,
      token: sessionStorage.getItem("token") || "",
    });
    console.log("Result Details:", response);
  };

  useEffect(() => {
    // Initial fetch, if needed
    fetchResultDetails(item._id);
  }, [item._id]);

  const handleDeclareClick = () => {
    fetchResultDetails(item._id);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {item?.name || "Loading..."}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">Set:</span> {item?.set}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">Start Date:</span>{" "}
        {new Date(item?.startDate || "").toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">End Date:</span>{" "}
        {new Date(item?.endDate || "").toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {item?.declared ? (
          <span className="text-green-600 font-semibold">Declared</span>
        ) : (
          <span className="text-yellow-600 font-semibold">Not Declared</span>
        )}
      </p>
      <div className="flex flex-row items-center justify-between gap-2">
        <button
          onClick={handleDeclareClick}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Declare
        </button>
        <button
          onClick={handleDeclareClick}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Show the results
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
