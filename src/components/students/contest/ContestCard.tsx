import type { ContestData } from "../../Interfaces";
import { Link } from "react-router-dom";

interface Props {
  contest: ContestData;
  onClick: () => void;
}

const ContestCard = ({ contest, onClick }: Props) => {
  return (
    <div className="w-80 p-5 bg-white rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-lg font-bold">{contest.name}</h2>
      <p className="text-sm text-gray-600">{contest.description}</p>
      <p className="text-xs text-gray-500">
        Starts: {new Date(contest.startDate).toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">
        Ends: {new Date(contest.endDate).toLocaleString()}
      </p>
      <Link
        to={`/contest/rules`}
        target="_blank"
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Attend
      </Link>
    </div>
  );
};

export default ContestCard;
