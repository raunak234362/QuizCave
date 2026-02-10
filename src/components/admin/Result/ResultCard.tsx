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

  // New filter states
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [marksSortType, setMarksSortType] = useState<string>("none"); // 'none', 'top', 'bottom', 'range'
  const [topBottomCount, setTopBottomCount] = useState<number>(10);
  const [minMarks, setMinMarks] = useState<string>("");
  const [maxMarks, setMaxMarks] = useState<string>("");

  const handleDownloadClick = (resultId: string) => {
    console.log("Download clicked for result ID:", resultId);
    setDownloadResultId(resultId);
  };

  const fetchResultDetails = async (id: string) => {
    const response = await Service.declareResult({
      id,
    });
    console.log("Result Details:", response);
  };

  const handleShowResults = async () => {
    try {
      setLoading(true);
      const response = await Service.fetchResultDetails({
        id: item._id,
      });
      const data = (response?.data || []).filter(
        (r: ResultDetails | null) => r !== null,
      );
      console.log("Data:", data);
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

    // 1. Apply Date Filter
    if (fromDate || toDate) {
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      if (to) to.setHours(23, 59, 59, 999); // Include entire 'to' day

      filtered = filtered.filter((result) => {
        const submitted = new Date(result.sumbittedOn);
        return (!from || submitted >= from) && (!to || submitted <= to);
      });
    }

    // 2. Apply Gender Filter
    if (genderFilter !== "all") {
      filtered = filtered.filter(
        (result) =>
          result.userId?.gender?.toLowerCase() === genderFilter.toLowerCase(),
      );
    }

    // 3. Apply Marks Filter/Sort
    if (marksSortType === "top") {
      // Sort by marks descending and take top N
      filtered = filtered
        .sort((a, b) => b.totalMarks - a.totalMarks)
        .slice(0, topBottomCount);
    } else if (marksSortType === "bottom") {
      // Sort by marks ascending and take bottom N
      filtered = filtered
        .sort((a, b) => a.totalMarks - b.totalMarks)
        .slice(0, topBottomCount);
    } else if (marksSortType === "range") {
      // Filter by marks range
      const min = minMarks ? parseFloat(minMarks) : -Infinity;
      const max = maxMarks ? parseFloat(maxMarks) : Infinity;
      filtered = filtered.filter(
        (result) => result.totalMarks >= min && result.totalMarks <= max,
      );
    }

    setFilteredResults(filtered);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setGenderFilter("all");
    setMarksSortType("none");
    setTopBottomCount(10);
    setMinMarks("");
    setMaxMarks("");
    setFilteredResults(results);
  };

  console.log(
    "Filtered Results:",
    filteredResults.map((result) => ({
      result,
    })),
  );
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
              className="w-full text-black py-2 rounded-md font-medium transition-colors"
              style={{ backgroundColor: "#6bbd45" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#5aa839")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#6bbd45")
              }
            >
              Declare
            </button>
          ) : (
            <button
              type="button"
              onClick={handleShowResults}
              className="w-full text-black py-2 rounded-md font-medium transition-colors"
              style={{ backgroundColor: "#6bbd45" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#5aa839")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#6bbd45")
              }
            >
              Show the results
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {loading ? "Loading..." : "Result List"}
            </h3>

            {/* Comprehensive Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                Filter Results
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    title="From Date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    title="To Date"
                  />
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Marks Filter Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks Filter
                  </label>
                  <select
                    value={marksSortType}
                    onChange={(e) => setMarksSortType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="none">No Filter</option>
                    <option value="top">Top Scorers</option>
                    <option value="bottom">Bottom Scorers</option>
                    <option value="range">Marks Range</option>
                  </select>
                </div>

                {/* Conditional: Top/Bottom Count */}
                {(marksSortType === "top" || marksSortType === "bottom") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Count
                    </label>
                    <input
                      type="number"
                      value={topBottomCount}
                      onChange={(e) =>
                        setTopBottomCount(parseInt(e.target.value) || 10)
                      }
                      min="1"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter count"
                    />
                  </div>
                )}

                {/* Conditional: Marks Range */}
                {marksSortType === "range" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Marks
                      </label>
                      <input
                        type="number"
                        value={minMarks}
                        onChange={(e) => setMinMarks(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Min"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        value={maxMarks}
                        onChange={(e) => setMaxMarks(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={applyFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors font-medium"
                >
                  Reset
                </button>
                <div className="ml-auto self-center text-sm text-gray-600">
                  Showing {filteredResults.length} of {results.length} results
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <p className="text-gray-500">Fetching results...</p>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map((result, index) => (
                  <div
                    key={result._id || `result-${index}`}
                    className="flex flex-row justify-between p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium">
                        {result.userId?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Gender:{" "}
                        <span className="font-semibold capitalize">
                          {result.userId?.gender || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Marks:{" "}
                        <span className="font-semibold">
                          {result.totalMarks}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Time Taken: {(result.timeTaken / 60).toFixed(2)} mins
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted On:{" "}
                        {new Date(result.sumbittedOn).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}/${
                          result?.userId?.profilePic || "default-profile.png"
                        }`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-2"
                      />
                      <button
                        onClick={() => handleDownloadClick(result._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Download Results
                      </button>
                    </div>

                    {downloadResultId === result._id && (
                      <DataDownload
                        data={result.answers || []}
                        filename={`results_${item._id}_${result.userId?.name || "Unknown"}`}
                        title="WBT Contest Results"
                        username={result.userId?.name || "Unknown"}
                        marks={result.totalMarks}
                        college={result.userId?.college || "N/A"}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No results found for the selected filters.
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
