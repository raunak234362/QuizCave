import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import CardContest from "./CardContest";
import type { ContestData } from "../../Interfaces";
import ContestResult from "./ContestResult";
import AddContest from "./AddContest";

const Contest = () => {
  const [contest, setContest] = useState<ContestData[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  const fetchContestData = async () => {
    const response = await Service.fetchContestData();
    const normalized = response?.map((item: ContestData) => ({
      ...item,
      id: item._id,
    }));

    setContest(normalized);
    
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
          <div className="bg-green-100 px-5 rounded-2xl border-2 border-white shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              AddContest
            </button>
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
        {isAddModalOpen && (
          <AddContest
            onClose={() => setIsAddModalOpen(false)}
            onContestCreated={fetchContestData}
          />
        )}
      </div>
    </div>
  );
};

export default Contest;
