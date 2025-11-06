import {
  Calendar,
  Clock,
  Users,
  ClipboardList,
  Info,
  Edit,
  ArrowLeft,
} from "lucide-react";
import type { ContestData } from "../../Interfaces";

interface ShowContestProps {
  // Assuming ContestData in /Interfaces/index is updated
  // to match the API data you provided.
  contestDetails: ContestData;
  setView: (view: "card" | "show" | "edit") => void;
}

/**
/**
 * A helper component to render key-value details with an icon.
 */
interface DetailItemProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  children: React.ReactNode;
}

const DetailItem = ({ icon, label, children }: DetailItemProps) => (
  <div className="flex items-start text-sm">
    <span className="text-gray-500 mr-2 flex-shrink-0">{icon}</span>
    <span className="font-medium text-gray-700 mr-2">{label}:</span>
    <span className="text-gray-900 break-words">{children}</span>
  </div>
);

const ShowContest = ({ contestDetails, setView }: ShowContestProps) => {
  // Helper to format dates and times
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-[70%] overflow-x-auto p-2 rounded-lg shadow-lg w-full md:w-[70vw] ">
        {/* Back Button (Top Left) */}

        {/* Header */}
        <div className="text-center mb-8 pt-10">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setView("card")}
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            {/* Edit Button (Top Right) */}
            <button
              onClick={() => setView("edit")}
              className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {contestDetails.name}
          </h1>
          <p className="text-lg text-gray-500">
            Contest Set: {contestDetails.set}
          </p>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Key Details */}
          <div className="md:col-span-1 space-y-6">
            {/* Status Badges */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    contestDetails.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {contestDetails.active ? "Active" : "Inactive"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    contestDetails.registration
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Registration {contestDetails.registration ? "Open" : "Closed"}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    contestDetails.declared
                      ? "bg-purple-100 text-purple-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {contestDetails.declared ? "Declared" : "Not Declared"}
                </span>
              </div>
            </div>

            {/* Key Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
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
                  {contestDetails.participants.length} registered
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

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
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
                <DetailItem
                  icon={<Info className="w-4 h-4" />}
                  label="Last Updated"
                >
                  {/* {formatDateTime(contestDetails.updatedAt)} */}
                </DetailItem>
              </div>
            </div>
          </div>

          {/* Right Column: Rules */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Rules & Regulations
            </h3>
            {/* This renders the raw HTML from the 'rules' field.
            We use 'prose' from @tailwindcss/typography to automatically style it.
            If you don't have that plugin, it will just render unstyled HTML.
          */}
            <div
              className="prose prose-sm max-w-none p-4 border rounded-md bg-gray-50 h-auto overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: contestDetails.rules }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowContest;
