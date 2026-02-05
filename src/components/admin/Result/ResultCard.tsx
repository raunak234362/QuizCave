import { useState } from "react";
import type { ResultCardProps, ResultDetails } from "../../Interfaces/index";
import Service from "../../../config/Service";
import DataDownload from "./DataDownload";

const ResultCard = ({ item }: ResultCardProps) => {
  const [results, setResults] = useState<ResultDetails[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultDetails[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [downloadResultId, setDownloadResultId] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [typeSearch, setTypeSearch] = useState<string>("");
  const [minScore, setMinScore] = useState<string>("");
  const [maxScore, setMaxScore] = useState<string>("");

  const handleDownloadClick = (resultId: string) => {
    console.log("Download clicked for result ID:", resultId);
    setDownloadResultId(resultId);
  };

  const fetchResultDetails = async (id: string) => {
    const response = await Service.declareResult({
      id
    });
    console.log("Result Details:", response);
  };

  const handleShowResults = async () => {
    try {
      setLoading(true);
      const response = await Service.fetchResultDetails({
        id: item._id
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

  const applyFilters = () => {
    let filtered = [...results];

    // Date Filter
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      filtered = filtered.filter((result) => {
        const submitted = new Date(result.sumbittedOn);
        return (!from || submitted >= from) && (!to || submitted <= to);
      });
    }

    // Gender Filter
    if (selectedGender) {
      filtered = filtered.filter(
        (result) => result.userId?.gender?.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // Type Filter (searching in designation or college)
    if (typeSearch) {
      const search = typeSearch.toLowerCase();
      filtered = filtered.filter(
        (result) =>
          result.userId?.designation?.toLowerCase().includes(search) ||
          result.userId?.college?.toLowerCase().includes(search)
      );
    }

    // Score Filter
    if (minScore !== "" || maxScore !== "") {
      const min = minScore !== "" ? parseFloat(minScore) : -Infinity;
      const max = maxScore !== "" ? parseFloat(maxScore) : Infinity;
      filtered = filtered.filter(
        (result) => result.totalMarks >= min && result.totalMarks <= max
      );
    }

    setFilteredResults(filtered);
  };

  console.log("Filtered Results:", filteredResults.map((result) => ({
    result
  })));
  return (
    <>
      <div className="bg-white/50 backdrop-blur-3xl shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-white">
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
              className="w-full bg-teal-600 text-white py-2 rounded-md font-medium hover:bg-teal-700 transition-colors"
            >
              Declare
            </button>
          ) : (
            <button
              type="button"
              onClick={handleShowResults}
              className="w-full bg-teal-600 text-white py-2 rounded-md font-medium hover:bg-teal-700 transition-colors"
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

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Type (Designation/College)
                </label>
                <input
                  type="text"
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  placeholder="Search type..."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Min Score
                </label>
                <input
                  type="number"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  placeholder="Min"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Max Score
                </label>
                <input
                  type="number"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="Max"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                    setSelectedGender("");
                    setTypeSearch("");
                    setMinScore("");
                    setMaxScore("");
                    setFilteredResults(results);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <p className="text-gray-500">Fetching results...</p>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((result) => (
                  <div
                    className="flex flex-row justify-between p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                  >
                    <div>
                      <p className="text-sm text-gray-700 font-medium">
                        {result.userId?.name}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-600">Gender:</span> {result.userId?.gender || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-600">Type:</span> {result.userId?.designation || result.userId?.college || "N/A"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Marks:{" "}
                        <span className="font-semibold text-blue-600">
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
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}/${result?.userId?.profile || "default-profile.png"
                          }`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                      />
                      <button
                        onClick={() => handleDownloadClick(result.userId.name)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        Download
                      </button>
                    </div>

                    {downloadResultId === result.userId.name && (

                      <DataDownload
                        data={result.answers || []}
                        filename={`results_${item._id}_${result.userId.name}`} // unique filename
                        title="WBT Contest Results"
                        username={result.userId.name}
                        marks={result.totalMarks}
                        college={result.userId.college || "N/A"}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 bg-gray-50 p-8 rounded-lg text-center border border-dashed border-gray-300">
                No results found matching the selected filters.
              </p>
            )}
          </div>
        </div>
      )}
      {/* Hidden PDF container for rendering PDF content */}
      <div id="pdf" style={{ display: "none" }}></div>
    </>
  );
};

export default ResultCard;
