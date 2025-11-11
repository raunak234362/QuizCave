/* eslint-disable @typescript-eslint/no-explicit-any */
// CardContest.tsx (The main parent component)
import React, { useEffect, useState } from "react";
import ContestEditModal from "./ContestEditModal"; // New Edit Modal
import Service from "../../../config/Service"; // Assuming this is your actual service
import ShowContest from "./ShowContest";
// NOTE: JoditEditor is no longer needed here, as it's in ContestEditModal

// --- Interfaces (Kept here for main component context) ---
interface ContestData {
  id?: string;
  name?: string;
  duration?: string;
  set?: string;
  rules?: string;
  resgistration?: boolean;
  registration?: boolean;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  declared?: boolean;
  participants?: string[];
  questions?: any[];
}

interface ContestDetailsResponse {
  active: boolean;
  contest: ContestData;
}

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
  startDate: string;
  endDate: string;
}

// --- Utility Function (Kept here as it's used locally for date formatting) ---
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
// ----------------------------------------------------------------------------

const CardContest: React.FC<CardContestProps> = ({ id }) => {
  const [contestDetails, setContestDetails] =
    useState<ContestDetailsResponse | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // Show Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit Modal state
  const [isSaving, setIsSaving] = useState(false);

  // No need for joditContent state here anymore

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

  const initializeEditFormData = (details: ContestDetailsResponse) => {
    const contest = details.contest;
    setEditFormData({
      name: contest.name || "",
      duration: Number(contest.duration) || 0,
      set: contest.set || "",
      rules: contest.rules || "",
      registration: contest.registration || contest.resgistration || false,
      active: details.active || false,
      startDate: formatForDateTimeInput(contest.startDate),
      endDate: formatForDateTimeInput(contest.endDate),
    });
  };

  const fetchContestDetails = async () => {
    try {
      // 🎯 Uses your real service (or its placeholder)
      const response: ContestDetailsResponse =
        await Service.fetchContestDetails({ id });
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

  const toggleShowQues = () => setIsModalOpen(false); // Close Show Modal
  const showContest = () => setIsModalOpen(true); // Open Show Modal

  const handleOpenEditModal = () => {
    if (contestDetails) {
      initializeEditFormData(contestDetails); // Re-initialize state before opening
    }
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // 🎯 This function is now the only save handler, taking data from the child component
  const handleSaveEdit = async (formData: EditFormData) => {
    if (isSaving) return;
    setIsSaving(true);

    const dataToUpdate = {
      ...formData,
      duration: String(formData.duration),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      // 🎯 Calling your real update service
      const updatedContestData: ContestData =
        await Service.updateContestDetails(id, dataToUpdate);

      setContestDetails((prev) => {
        if (!prev) return null;

        const newDetails: ContestDetailsResponse = {
          active: updatedContestData.active ?? prev.active,
          contest: {
            ...prev.contest,
            ...updatedContestData,
          },
        };

        // Re-initialize local form state with saved data (optional, but good practice)
        initializeEditFormData(newDetails);

        return newDetails;
      });

      handleCloseEditModal();
      console.log("Contest updated successfully!");
    } catch (error) {
      console.error("Failed to save contest details:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
      {renderCardBody()}

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

      {/* RENDER EDIT MODAL */}
      {isEditModalOpen && (
        <ContestEditModal
          initialFormData={editFormData}
          isSaving={isSaving}
          onSave={handleSaveEdit} // Pass the save handler
          onClose={handleCloseEditModal}
        />
      )}

      {/* RENDER SHOW MODAL */}
      {isModalOpen && contestDetails && (
        <ShowContest contestDetails={contestDetails} onClose={toggleShowQues} />
      )}
    </div>
  );
};

export default CardContest;
