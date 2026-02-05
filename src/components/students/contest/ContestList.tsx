import { useEffect, useState } from "react";
import ContestCard from "./ContestCard";
import ContestService from "../../../config/Service";
import type { ContestData } from "../../Interfaces/index";

const ContestList = () => {
  const [contests, setContests] = useState<ContestData[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await ContestService.getAllStudentContestData();
        setContests(data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="w-full p-5 mt-5 bg-gray-100 rounded-xl">
      <h1 className="text-2xl font-bold text-center">Available Contests</h1>
      <div className="flex flex-row flex-wrap justify-center mt-5 gap-5">
        {contests.map((contest) => (
          <div key={String(contest._id)}>
            <ContestCard contest={contest} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestList;
