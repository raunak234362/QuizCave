// ContestShowModal.tsx
import React from "react";

interface ContestData {
  id: string;
  name: string;
  duration: string;
  set: string;
  rules: string;
  resgistration?: boolean;
  registration: boolean;
  active?: boolean;
  startDate: string;
  endDate: string;
  participants: string[];
}

interface ContestDetailsResponse {
  active: boolean;
  contest: ContestData;
}

interface ContestShowModalProps {
  details: ContestDetailsResponse;
  onClose: () => void;
}

const ContestShowModal: React.FC<ContestShowModalProps> = ({
  details,
  onClose,
}) => {
  const contest = details.contest;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl relative transform transition-all duration-300">
        {/* Modal Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-2 border-b-2 mb-6">
          <h3 className="text-3xl font-extrabold text-gray-800">
            Contest Details: {contest.name}
          </h3>
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-black font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            Close
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
          {[
            {
              label: "Start Date",
              value: new Date(contest.startDate).toLocaleString(),
            },
            {
              label: "End Date",
              value: new Date(contest.endDate).toLocaleString(),
            },
            {
              label: "Participants",
              value: contest.participants?.length || 0,
              color: "text-blue-600",
            },
            {
              label: "Duration",
              value: `${contest.duration} minutes`,
            },
            { label: "Set", value: contest.set },
          ].map((item) => (
            <div key={item.label} className="text-sm">
              <p className="font-bold text-gray-700 uppercase tracking-wider">
                {item.label}
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  item.color || "text-gray-900"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}

          <div className="text-sm">
            <p className="font-bold text-gray-700 uppercase tracking-wider">
              Registration
            </p>
            <p
              className={`mt-1 text-lg font-semibold ${
                contest.registration || contest.resgistration
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {contest.registration || contest.resgistration
                ? "Open"
                : "Closed"}
            </p>
          </div>
          <div className="text-sm">
            <p className="font-bold text-gray-700 uppercase tracking-wider">
              Active
            </p>
            <p
              className={`mt-1 text-lg font-semibold ${
                details.active ? "text-green-600" : "text-red-600"
              }`}
            >
              {details.active ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Rules Section */}
        <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-lg bg-gray-50">
          <h4 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            📜 Rules & Instructions
          </h4>
          <div
            className="text-gray-700 text-base leading-relaxed p-2"
            dangerouslySetInnerHTML={{
              __html:
                contest.rules ||
                "<p class='italic text-gray-500'>No specific rules provided for this contest.</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestShowModal;
