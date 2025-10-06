import React, { useEffect, useState } from "react";
// JoditEditor is replaced with a standard textarea as external libraries are not supported.

// --- MOCK INTERFACES AND SERVICE FOR SELF-CONTAINED EXECUTION ---
// In a real application, these would be imported from external files.
interface ContestData {
  id: string;
  name: string;
  duration: string; // Stored as string in mock API
  set: string;
  rules: string;
  resgistration?: boolean; // Keeping the typo for robust mock handling
  registration: boolean;
  active?: boolean;
  startDate: string;
  endDate: string;
  declared: boolean;
  participants: string[];
  questions?: any[];
}

interface ContestDetailsResponse {
  active: boolean;
  contest: ContestData;
}

const mockContestData: ContestData = {
  id: "C101",
  name: "Spring Code Challenge 2025",
  duration: "120", // 120 minutes
  set: "DSA Advanced",
  rules:
    "<h2>General Rules:</h2><p>No external help. All submissions are final. Any attempt to cheat will result in disqualification.</p>",
  registration: true,
  active: true,
  startDate: new Date(Date.now() - 3600000).toISOString(), // Started 1 hour ago
  endDate: new Date(Date.now() + 7200000).toISOString(), // Ends 2 hours from now
  declared: false,
  participants: ["user_a", "user_b", "user_c"],
  questions: [
    { id: 1, title: "Q1" },
    { id: 2, title: "Q2" },
  ],
};

const mockService = {
  fetchContestDetails: async ({
    id,
  }: {
    id: string;
  }): Promise<ContestDetailsResponse> => {
    console.log(`[MOCK API] Fetching details for ID: ${id}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      active: mockContestData.active || false,
      contest: mockContestData,
    };
  },
  updateContestDetails: async (
    id: string,
    data: Partial<ContestData>
  ): Promise<ContestData> => {
    console.log(`[MOCK API] Updating contest ${id} with:`, data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update mock data for persistent state change
    Object.assign(mockContestData, data);
    // Ensure duration is stored as a string, matching the initial mock data structure
    mockContestData.duration = String(data.duration);

    return mockContestData; // Return the updated contest data
  },
};
// --- END MOCK SERVICE ---

interface CardContestProps {
  id: string;
}

interface EditFormData {
  name: string;
  duration: number;
  set: string;
  rules: string;
  registration: boolean;
  active: boolean;
  startDate: string; // Formatted as 'YYYY-MM-DDTHH:MM'
  endDate: string; // Formatted as 'YYYY-MM-DDTHH:MM'
}

// Utility function to format API ISO date strings for datetime-local input
const formatForDateTimeInput = (isoString: string | undefined): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const datePart = date.toISOString().split("T")[0];
  const timePart = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}T${timePart}`;
};

const CardContest: React.FC<CardContestProps> = ({ id }) => {
  const [contestDetails, setContestDetails] =
    useState<ContestDetailsResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For Show Details Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For Edit Form Modal
  const [isSaving, setIsSaving] = useState(false);

  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    duration: 0,
    set: "",
    rules: "",
    registration: false,
    active: false,
    startDate: "",
    endDate: "",
  });

  // Function to initialize edit form data from the fetched contest details
  const initializeEditFormData = (details: ContestDetailsResponse) => {
    const contest = details.contest;
    setEditFormData({
      name: contest.name || "",
      duration: Number(contest.duration) || 0,
      set: contest.set || "",
      rules: contest.rules || "",
      // Use 'registration' field if available, fallback to 'resgistration'
      registration: contest.registration || contest.resgistration || false,
      active: details.active || false,
      startDate: formatForDateTimeInput(contest.startDate),
      endDate: formatForDateTimeInput(contest.endDate),
    });
  };

  const fetchContestDetails = async () => {
    try {
      // Using mockService instead of the unresolved Service import
      const response: ContestDetailsResponse =
        await mockService.fetchContestDetails({ id });
      setContestDetails(response);
      initializeEditFormData(response);
    } catch (error) {
      console.error("Error fetching contest details:", error);
      setContestDetails(null);
    }
  };

  useEffect(() => {
    fetchContestDetails();
  }, [id]);

  // --- Modal Logic (Details) ---
  const toggleShowQues = () => setIsModalOpen(false);
  const showContest = () => setIsModalOpen(true);

  // --- Edit Modal Logic ---
  const handleOpenEditModal = () => {
    if (contestDetails) {
      initializeEditFormData(contestDetails);
    }
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const dataToUpdate = {
      ...editFormData,
      duration: String(editFormData.duration), // Convert number back to string for the mock API
      startDate: new Date(editFormData.startDate).toISOString(),
      endDate: new Date(editFormData.endDate).toISOString(),
    };

    try {
      // Using mockService instead of the unresolved Service import
      const updatedContestData: ContestData =
        await mockService.updateContestDetails(id, dataToUpdate);

      setContestDetails((prev) => {
        if (!prev) return null;

        const newDetails: ContestDetailsResponse = {
          // Updated active status is pulled from the top-level response or fallback
          active: updatedContestData.active ?? prev.active,
          contest: {
            ...prev.contest,
            ...updatedContestData,
          },
        };

        initializeEditFormData(newDetails);

        return newDetails;
      });

      handleCloseEditModal(); // Close modal on success
      // Using console.log instead of alert to prevent blocking the UI in the sandbox
      console.log("Contest updated successfully!");
    } catch (error) {
      console.error("Failed to save contest details:", error);
      // Using console.error instead of alert
      console.error("Failed to save changes: " + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for standard input fields
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setEditFormData(
      (prev) =>
        ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        } as EditFormData)
    );
  };

  // Handler for text area (replaces Jodit Editor handler)
  const handleRulesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditFormData((prev) => ({
      ...prev,
      rules: e.target.value,
    }));
  };

  // --- Render Functions ---

  const renderInputField = (
    label: string,
    name: keyof EditFormData,
    type: string = "text"
  ) => {
    const isCheckbox = type === "checkbox";

    return (
      <div
        key={name}
        className={isCheckbox ? "flex items-center space-x-2" : "space-y-1"}
      >
        <label
          className={`block text-sm font-semibold text-gray-700 ${
            isCheckbox ? "order-2" : ""
          }`}
          htmlFor={name as string}
        >
          {label}
        </label>
        <input
          id={name as string}
          name={name as string}
          type={type}
          className={
            isCheckbox
              ? "form-checkbox h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 order-1"
              : "mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150"
          }
          value={
            !isCheckbox ? (editFormData[name] as string | number) : undefined
          }
          checked={isCheckbox ? (editFormData[name] as boolean) : undefined}
          onChange={handleFormChange}
        />
      </div>
    );
  };

  const renderEditModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl relative transform transition-all duration-300">
        {/* Modal Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-2 border-b-2 mb-6">
          <h3 className="text-3xl font-extrabold text-gray-800">
            ✏️ Edit Contest: {editFormData.name}
          </h3>
          <button
            onClick={handleCloseEditModal}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>

        <div className="space-y-6">
          {/* Grid Layout for Main Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInputField("Contest Name", "name")}
            {renderInputField("Set", "set")}
            {renderInputField("Duration (min)", "duration", "number")}
            {renderInputField("Start Time", "startDate", "datetime-local")}
            {renderInputField("End Time", "endDate", "datetime-local")}
          </div>

          {/* Checkboxes Group */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-2 border-t border-gray-200">
            {renderInputField("Registration Open", "registration", "checkbox")}
            {renderInputField("Contest Active", "active", "checkbox")}
          </div>

          {/* Rules Textarea (Jodit Editor replacement) */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="rules"
            >
              Contest Rules (HTML Content):
            </label>
            <textarea
              id="rules"
              name="rules"
              rows={10}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 transition duration-150 font-mono text-sm"
              value={editFormData.rules}
              onChange={handleRulesChange}
              placeholder="Enter contest rules (supports HTML formatting)..."
            />
          </div>
        </div>

        {/* Modal Footer (Save Button) */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
            onClick={handleSaveEdit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Contest Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  // Render function for the static card body
  const renderCardBody = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {contestDetails?.contest.name || "Loading..."}
      </h2>
      <p className="text-md text-gray-600 mb-1">
        <span className="font-semibold text-gray-700">Set:</span>{" "}
        {contestDetails?.contest.set || "N/A"}
      </p>
      <p className="text-md text-gray-600 mb-1">
        <span className="font-semibold text-gray-700">Duration:</span> (
        {contestDetails?.contest.duration || 0} minutes)
      </p>
      <p className="text-sm text-gray-600 mb-4 pt-2">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {contestDetails?.contest.declared ? (
          <span className="text-green-600 font-bold ml-1">Declared</span>
        ) : (
          <span className="text-yellow-600 font-bold ml-1">Not Declared</span>
        )}
      </p>
    </>
  );

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 transition-shadow duration-300 border border-gray-100">
      {/* ALWAYS render static card body */}
      {renderCardBody()}

      {/* Action Buttons */}
      <div className="flex flex-row items-center gap-3 mt-4 border-t pt-4">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
          onClick={showContest}
        >
          Show Details
        </button>
        <button
          className="w-full bg-orange-600 text-white py-2 rounded-lg font-medium shadow-md hover:bg-orange-700 transition-colors"
          onClick={handleOpenEditModal}
        >
          Edit All Fields
        </button>
      </div>

      {/* Edit Modal (Popup) */}
      {isEditModalOpen && renderEditModal()}

      {/* Show Details Modal */}
      {isModalOpen && contestDetails?.contest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl relative transform transition-all duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-2 border-b-2 mb-6">
              <h3 className="text-3xl font-extrabold text-gray-800">
                Contest Details: {contestDetails.contest.name}
              </h3>
              <button
                onClick={toggleShowQues}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
              >
                Close
              </button>
            </div>

            {/* Displaying All Fields in the Modal - Cleaner Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
              {[
                {
                  label: "Start Date",
                  value: new Date(
                    contestDetails.contest.startDate
                  ).toLocaleString(),
                },
                {
                  label: "End Date",
                  value: new Date(
                    contestDetails.contest.endDate
                  ).toLocaleString(),
                },
                {
                  label: "Participants",
                  value: contestDetails.contest.participants?.length || 0,
                  color: "text-blue-600",
                },
                {
                  label: "Duration",
                  value: `${contestDetails.contest.duration} minutes`,
                },
                { label: "Set", value: contestDetails.contest.set },
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
                    (contestDetails.contest as any).registration ||
                    (contestDetails.contest as any).resgistration
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(contestDetails.contest as any).registration ||
                  (contestDetails.contest as any).resgistration
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
                    contestDetails.active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {contestDetails.active ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Rules Section - Visually separated */}
            <div className="mb-8 p-6 border border-gray-200 rounded-xl shadow-lg bg-gray-50">
              <h4 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                📜 Rules & Instructions
              </h4>
              <div
                className="text-gray-700 text-base leading-relaxed p-2"
                dangerouslySetInnerHTML={{
                  __html:
                    contestDetails.contest.rules ||
                    "<p class='italic text-gray-500'>No specific rules provided for this contest.</p>",
                }}
              />
            </div>

            {/* Questions Section Placeholder */}
            <h4 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              ❓ Questions ({contestDetails.contest.questions?.length || 0})
            </h4>
            <p className="text-gray-500 italic">
              Questions list implementation placeholder.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContest;
