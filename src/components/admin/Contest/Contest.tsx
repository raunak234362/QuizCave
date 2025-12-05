import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import CardContest from "./CardContest";
import type { ContestData } from "../../Interfaces";
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
    <div className="p-8 min-h-screen space-y-6 w-full bg-teal-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-teal-200">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Available Contests
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg 
                     font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out 
                     hover:scale-105 hover:from-teal-500 hover:to-green-500"
        >
          + Add Contest
        </button>
      </div>

      {/* Contest List */}
      <div className="grid grid-cols-3 gap-6">
        {contest.map((item, index) => (
          <div key={item._id || index}>
            <CardContest id={item._id} />
          </div>
        ))}
      </div>

      {/* <hr className="border-gray-300 my-6" />

     
      <div>
        <ContestResult />
      </div> */}

      {/* Add Contest Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-[60%] max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent close on modal click
          >
            <AddContest
              onClose={() => setIsAddModalOpen(false)}
              onContestCreated={fetchContestData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Contest;
