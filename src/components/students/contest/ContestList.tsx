import { useEffect, useState } from "react";
import ContestCard from "./ContestCard";
import ContestService from "../../../config/Service";
import type { ContestData } from "../../Interfaces/index";

const ContestList = () => {
  const [contests, setContests] = useState<ContestData[]>([]);
  const token = sessionStorage.getItem("token") || "";

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const data = await ContestService.getAllStudentContestData({ token });
        setContests(data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } 
    };
    fetchContests();
  }, [token]);

  console.log("Fetched contests:", contests);

  return (
    <div className="w-full p-5 mt-5 bg-gray-100 rounded-xl">
      <h1 className="text-2xl font-bold text-center">Available Contests</h1>
      <div className="flex flex-row flex-wrap justify-center mt-5 gap-5">
        {contests.map((contest) => (
          <ContestCard
            key={String(contest._id)}
            contest={contest}
            onClick={() => console.log("Contest clicked:", contest._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContestList;
