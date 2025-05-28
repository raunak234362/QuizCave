import { useState } from "react";
import type { ResultCardProps, ResultDetails } from "../../Interfaces";
import Service from "../../../config/Service";

const ResultCard = ({ item }: ResultCardProps) => {
  const [results, setResults] = useState<ResultDetails[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultDetails[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const fetchResultDetails = async (id: string) => {
    const response = await Service.declareResult({
      id,
      token: sessionStorage.getItem("token") || "",
    });
    console.log("Result Details:", response);
  };

  const handleShowResults = async () => {
    try {
      setLoading(true);
      const response = await Service.fetchResultDetails({
        id: item._id,
        token: sessionStorage.getItem("token") || "",
      });
      const data = response?.data || [];
      setResults(data);
      setFilteredResults(data);
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching result details:", error);
      setLoading(false);
    }
  };

  const handleDeclareClick = () => {
    fetchResultDetails(item._id);
  };

  const applyDateFilter = () => {
    if (!fromDate && !toDate) {
      setFilteredResults(results);
      return;
    }

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = results.filter((result) => {
      const submitted = new Date(result.sumbittedOn);
      return (!from || submitted >= from) && (!to || submitted <= to);
    });

    setFilteredResults(filtered);
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {item?.name || "Loading..."}
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-gray-700">Set:</span> {item?.set}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-gray-700">Start Date:</span>{" "}
          {new Date(item?.startDate || "").toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-gray-700">End Date:</span>{" "}
          {new Date(item?.endDate || "").toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-medium text-gray-700">Status:</span>{" "}
          {item?.declared ? (
            <span className="text-green-600 font-semibold">Declared</span>
          ) : (
            <span className="text-yellow-600 font-semibold">Not Declared</span>
          )}
        </p>
        <div className="flex flex-row items-center justify-between gap-2 mb-4">
          {!item?.declared ? (
            <button
              type="button"
              onClick={handleDeclareClick}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Declare
            </button>
          ) : (
            <button
              type="button"
              onClick={handleShowResults}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Show the results
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {loading ? "Loading..." : "Result List"}
            </h3>

            {/* Date Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Select from date"
                  title="From Date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Select to date"
                  title="To Date"
                />
              </div>
              <button
                onClick={applyDateFilter}
                className="self-end bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>

            {/* Results */}
            {loading ? (
              <p className="text-gray-500">Fetching results...</p>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((result) => (
                  <div
                    key={result._id}
                    className="flex flex-row justify-between p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                  >
                    <div>
                      <p className="text-sm text-gray-700 font-medium">
                        {result.userId?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Marks:{" "}
                        <span className="font-semibold">
                          {result.totalMarks}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Time Taken:{" "}
                        {(() => {
                          const ms = result.timeTaken;
                          const totalSeconds = Math.floor(ms / 1000);
                          const hours = Math.floor(totalSeconds / 3600);
                          const minutes = Math.floor(
                            (totalSeconds % 3600) / 60
                          );
                          const seconds = totalSeconds % 60;
                          return `${hours} hr ${minutes} min ${seconds} sec`;
                        })()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted On:{" "}
                        {new Date(result.sumbittedOn).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}/${
                          result?.userId?.profilePic || "default-profile.png"
                        }`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No results found for selected dates.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResultCard;
