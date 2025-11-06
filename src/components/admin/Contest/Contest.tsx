import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import CardContest from "./CardContest";
import type { ContestData } from "../../Interfaces";
import ContestResult from "./ContestResult";

const Contest = () => {
  const [contest, setContest] = useState<ContestData[]>([]);


  const fetchContestData = async () => {
    const response = await Service.fetchContestData();
    const normalized = response.map((item: ContestData) => ({
      ...item,
      id: item._id,
    }));

    setContest(normalized);
    console.log(response);
  };
  useEffect(() => {
    fetchContestData();
  }, []);
  return (
    <div className="p-6 min-h-screen space-y-4 w-full">
      <div>
        <div className="flex justify-center items-center w-full text-2xl font-bold mb-6">
          <div className="bg-green-100 px-5 rounded-2xl border-2 border-white shadow-2xl">
            Available Contests
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contest.map((item, index) => {
            return (
              <div key={item._id || index}>
                <CardContest id={item._id} />
              </div>
            );
          })}
        </div>
      </div>
      <hr />
      <div>
        <ContestResult />
      </div>
    </div>
  );
};

export default Contest;
