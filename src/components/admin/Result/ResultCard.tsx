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
                    className="flex flex-col md:flex-row justify-between p-5 border border-gray-100 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="text-lg font-bold text-gray-900 leading-tight">
                          {result.userId?.name || "Unknown User"}
                        </h5>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase">
                          {result.userId?.gender || "N/A"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                        <p>
                          <span className="text-gray-400 font-medium">
                            Student ID:
                          </span>{" "}
                          <span className="text-gray-800 font-semibold">
                            {result.userId?.studentId || "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-400 font-medium">
                            Marks:
                          </span>{" "}
                          <span className="text-green-600 font-bold text-base">
                            {result.totalMarks}
                          </span>
                        </p>
                        <p className="sm:col-span-2">
                          <span className="text-gray-400 font-medium">
                            College:
                          </span>{" "}
                          <span className="text-gray-800">
                            {result.userId?.college || "N/A"}
                          </span>
                        </p>
                        <p className="sm:col-span-2">
                          <span className="text-gray-400 font-medium">
                            Branch:
                          </span>{" "}
                          <span className="text-gray-800">
                            {result.userId?.branch || "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-400 font-medium">
                            Time Taken:
                          </span>{" "}
                          <span className="text-gray-800 font-semibold">
                            {(() => {
                              const ms = result.timeTaken;
                              if (!ms) return "0s";
                              const totalSeconds = Math.floor(ms / 1000);
                              const h = Math.floor(totalSeconds / 3600);
                              const m = Math.floor((totalSeconds % 3600) / 60);
                              const s = totalSeconds % 60;
                              return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}m ` : ""}${s}s`;
                            })()}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-400 font-medium">
                            Submitted:
                          </span>{" "}
                          <span className="text-gray-800 italic">
                            {new Date(result.sumbittedOn).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </p>
                      </div>

                      {/* Documents Section */}
                      <div className="pt-3 border-t border-gray-50 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Documents:
                          </span>
                          {result.userId?.resume ? (
                            <a
                              href={`${import.meta.env.VITE_IMG_URL}/${result.userId.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Resume
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              No Resume
                            </span>
                          )}

                          {result.userId?.marksheet &&
                          result.userId.marksheet.length > 0 ? (
                            <a
                              href={`${import.meta.env.VITE_IMG_URL}/${result.userId.marksheet[0]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md transition-colors"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Marksheet
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 italic">
                              No Marksheet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end justify-between gap-4">
                      <div className="relative group">
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}/${
                            result?.userId?.profilePic || "default-profile.png"
                          }`}
                          alt="Profile"
                          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-lg group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <button
                        onClick={() => handleDownloadClick(result._id)}
                        className="w-full md:w-auto bg-[#6bbd45] hover:bg-[#5aa839] text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          ></path>
                        </svg>
                        Download Results
                      </button>
                    </div>

                    {downloadResultId === result._id && (
                      <DataDownload
                        data={result.answers || []}
                        filename={`comprehensive_report_${result.userId?.name || "student"}`}
                        user={result.userId}
                        marks={result.totalMarks}
                        timeTaken={result.timeTaken}
                        submittedOn={result.sumbittedOn}
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
