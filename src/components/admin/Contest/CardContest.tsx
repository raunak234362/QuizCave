import { useEffect, useState } from "react";
import ContestEditModal from "./ContestEditModal";
import Service from "../../../config/Service";
import ShowContest from "./ShowContest";
import type { ContestData } from "../../Interfaces";

interface EditFormData {
  name: string;
  duration: number;
  set: string;
  rules: string;
  registration: boolean;
  declared: boolean;
  active: boolean;
  startDate: string;
  endDate: string;
}

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

const CardContest = ({ id }: any) => {
  const [contestDetails, setContestDetails] = useState<ContestData | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetched, setIsFetched] = useState(false); // ✅ prevents refetch flicker

  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: "",
    duration: 0,
    set: "",
    rules: "",
    registration: false,
    declared: false,
    active: false,
    startDate: "",
    endDate: "",
  });

  const initializeEditFormData = (contest: ContestData) => {
    setEditFormData({
      name: contest.name || "",
      duration: Number(contest.duration) || 0,
      set: contest.set || "",
      rules: contest.rules || "",
      registration: contest.registration || contest.resgistration || false,
      declared: contest.declared || false,
      active: contest.active || false,
      startDate: formatForDateTimeInput(contest.startDate),
      endDate: formatForDateTimeInput(contest.endDate),
    });
  };

  const fetchContestDetails = async () => {
    if (isFetched) return; // ✅ already fetched, skip to prevent flicker
    try {
      const response = await Service.fetchContestDetails(id);
      if (response?.contest) {
        setContestDetails(response.contest);
        initializeEditFormData(response.contest);
        setIsFetched(true); // ✅ mark as fetched
      }
    } catch (error) {
      console.error("Error fetching contest details:", error);
      setContestDetails(null);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string" && id.trim() !== "") {
      fetchContestDetails();
    } else {
      console.warn("CardContest mounted without valid ID");
    }
  }, [id]); // ✅ only runs once per id

  const handleOpenEditModal = () => {
    if (contestDetails) initializeEditFormData(contestDetails);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);

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
      const updatedContestData: ContestData =
        await Service.updateContestDetails(id, dataToUpdate);

      setContestDetails((prev) => {
        if (!prev) return null;
        const newDetails: ContestData = {
          ...prev,
          ...updatedContestData,
          active: updatedContestData.active ?? prev.active,
        };
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
        {contestDetails?.name || "Loading..."}
      </h2>
      <p className="text-md text-gray-600 mb-1">
        <span className="font-semibold text-gray-700">Set:</span>{" "}
        {contestDetails?.set || "N/A"}
      </p>
      <p className="text-md text-gray-600 mb-1">
        <span className="font-semibold text-gray-700">Duration:</span> (
        {contestDetails?.duration || 0} minutes)
      </p>
      <p className="text-sm text-gray-600 mb-4 pt-2">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {contestDetails?.declared ? (
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
          className="w-full text-white py-2 rounded-lg font-medium shadow-md transition-colors"
          style={{ backgroundColor: "#6bbd45" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#5aa839")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#6bbd45")
          }
          onClick={() => setIsModalOpen(true)}
        >
          Show Details
        </button>
        <button
          className="w-full text-white py-2 rounded-lg font-medium shadow-md transition-colors"
          style={{ backgroundColor: "#6bbd45" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#5aa839")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#6bbd45")
          }
          onClick={handleOpenEditModal}
        >
          Edit All Fields
        </button>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <ContestEditModal
          initialFormData={editFormData}
          isSaving={isSaving}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}

      {/* SHOW MODAL */}
      {isModalOpen && contestDetails && (
        <ShowContest
          contestDetails={contestDetails}
          setView={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CardContest;
