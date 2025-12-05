import {
  Calendar,
  Clock,
  Users,
  ClipboardList,
  Info,
  ArrowLeft,
} from "lucide-react";
import type { ContestData } from "../../Interfaces";

interface ShowContestProps {
  contestDetails: ContestData;
  setView: (view: "card" | "show" | "edit") => void;
}

/** Helper to render labeled info with an icon */
interface DetailItemProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  children: React.ReactNode;
}

const DetailItem = ({ icon, label, children }: DetailItemProps) => (
  <div className="flex items-start text-sm">
    <span className="text-teal-500 mr-2 flex-shrink-0">{icon}</span>
    <span className="font-medium text-gray-700 mr-2">{label}:</span>
    <span className="text-gray-900 break-words">{children}</span>
  </div>
);

const ShowContest = ({ contestDetails, setView }: ShowContestProps) => {
  const formatDateTime = (isoString: string) =>
    new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      {/* Modal Container */}
      <div className="relative bg-white/95 border border-teal-200 rounded-2xl shadow-2xl w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 backdrop-blur-sm py-4 px-6 border-b border-teal-100 z-10">
          <button
            onClick={() => setView("card")}
            className="flex items-center text-sm text-teal-600 hover:text-teal-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {contestDetails?.name}
          </h1>
          <span className="text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Set: {contestDetails?.set}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-8">
          {/* Left Section */}
          <div className="space-y-6">
            {/* Status Section */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 mb-3 border-b border-teal-100 pb-2">
                Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    contestDetails.active
                      ? "bg-teal-100 text-teal-800 border-teal-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {contestDetails.active ? "Active" : "Inactive"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    contestDetails.registration
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  Registration {contestDetails.registration ? "Open" : "Closed"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    contestDetails.declared
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }`}
                >
                  {contestDetails.declared ? "Declared" : "Not Declared"}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 mb-3 border-b border-teal-100 pb-2">
                Details
              </h3>
              <div className="space-y-3">
                <DetailItem
                  icon={<Clock className="w-4 h-4" />}
                  label="Duration"
                >
                  {contestDetails.duration} minutes
                </DetailItem>
                <DetailItem
                  icon={<Users className="w-4 h-4" />}
                  label="Participants"
                >
                  {contestDetails.participants?.length || 0} registered
                </DetailItem>
                <DetailItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Start Time"
                >
                  {formatDateTime(contestDetails.startDate)}
                </DetailItem>
                <DetailItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="End Time"
                >
                  {formatDateTime(contestDetails.endDate)}
                </DetailItem>
              </div>
            </div>

            {/* Metadata Section */}
            <div>
              <h3 className="text-lg font-semibold text-teal-700 mb-3 border-b border-teal-100 pb-2">
                Metadata
              </h3>
              <div className="space-y-3">
                <DetailItem
                  icon={<Info className="w-4 h-4" />}
                  label="Contest ID"
                >
                  <span className="font-mono text-xs">
                    {contestDetails._id}
                  </span>
                </DetailItem>
                <DetailItem
                  icon={<Info className="w-4 h-4" />}
                  label="Created At"
                >
                  {formatDateTime(contestDetails.createdAt)}
                </DetailItem>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-teal-700 mb-3 border-b border-teal-100 pb-2 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-teal-600" />
              Rules & Regulations
            </h3>
            <div
              className="prose prose-sm max-w-none p-4 border border-teal-100 rounded-lg bg-teal-50 text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contestDetails.rules }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowContest;
