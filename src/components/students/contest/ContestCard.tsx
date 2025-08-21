import type { ContestData } from "../../Interfaces";

interface Props {
  contest: ContestData;
  onClick: () => void; // ✅ receives click handler from parent
}

const ContestCard = ({ contest, onClick }: Props) => {
    console.log(onClick)
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
      <button
        onClick={onClick} // ✅ calls parent function
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Attend
      </button>
    </div>
  );
};

export default ContestCard;
