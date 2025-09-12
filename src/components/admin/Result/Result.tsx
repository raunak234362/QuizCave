import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import type { ContestResultData, UserToken } from "../../Interfaces/index";
import ResultCard from "./ResultCard";

const Result = () => {
  const [result, setResult] = useState<ContestResultData[]>([]);
  const fetchResult = async () => {
    try {
      const token = sessionStorage.getItem("token") || "";
      const response = await Service.fetchResult({ token: { token } as UserToken });
      setResult(response);
      console.log("Contest Result Response:", response);
      // Process the response as needed
    } catch (error) {
      console.error("Error fetching contest results:", error);
    }
  };
  useEffect(() => {
    fetchResult();
  }, []);

  console.log("Rendering Result component with data:", result);

  return (
    <div className="p-6 min-h-screen space-y-4 w-full">
      <div>
        <div className="flex justify-center items-center w-full text-2xl font-bold mb-6">
          <div className="bg-green-100 px-5 rounded-2xl border-2 border-white shadow-2xl">
            Contests Result
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.map((item, index) => {
            console.log("Contest Result Item:", item);
            return (
              <div key={item._id || index}>
                <ResultCard item={item} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Result;
