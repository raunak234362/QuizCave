import { useState, type FormEvent } from "react";
import JoditEditor from "jodit-react";
import Service from "../../../config/Service";
import type { ContestDataForm } from "../../Interfaces";

interface AddContestProps {
  onClose: () => void;
  onContestCreated: () => void;
}

const AddContest = ({ onClose, onContestCreated }: AddContestProps) => {
  const [contestDetails, setContestDetails] = useState<ContestDataForm>({
    title: "",
    set: "",
    instructions: "",
    duration: "",
    startDate: "",
    endDate: "",
    active: false,
    contestId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActiveToggle = () => {
    setContestDetails((prev) => ({ ...prev, active: !prev.active }));
  };

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Service.createContest({
        name: contestDetails.title,
        set: contestDetails.set,
        rules: contestDetails.instructions,
        duration: contestDetails.duration,
        startDate: contestDetails.startDate,
        endDate: contestDetails.endDate,
        active: contestDetails.active,
        contestId: contestDetails.contestId,
      });

      onContestCreated();
      onClose();
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Failed to create contest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      {/* Outer wrapper for scrollable content */}
      <div className="bg-teal-50 w-[90%] max-w-5xl rounded-2xl shadow-2xl border border-gray-200 relative max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-center text-teal-900 mb-6">
            Create New Contest
          </h1>

          <form onSubmit={handleSubmitForm} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Contest Title
              </label>
              <input
                type="text"
                value={contestDetails.title}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter contest title"
                required
              />
            </div>

            {/* Set */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Contest Type
              </label>
              <select
                value={contestDetails.set}
                onChange={(e) =>
                  setContestDetails({ ...contestDetails, set: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select Type</option>
                <option value="A">Technical</option>
                <option value="B">Non-Technical</option>
              </select>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Instructions
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <JoditEditor
                  value={contestDetails.instructions}
                  onChange={(value) =>
                    setContestDetails({
                      ...contestDetails,
                      instructions: value,
                    })
                  }
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Duration (in minutes)
              </label>
              <input
                type="number"
                value={contestDetails.duration}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    duration: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 60"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={contestDetails.startDate}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    startDate: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                End Date
              </label>
              <input
                type="datetime-local"
                value={contestDetails.endDate}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    endDate: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-4 mt-4">
              <label className="text-gray-800 font-medium">
                Active Status:
              </label>
              <button
                type="button"
                onClick={handleActiveToggle}
                className={`px-6 py-2 text-white font-semibold rounded-full shadow-md transition-all duration-300 ${
                  contestDetails.active
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {contestDetails.active ? "Active" : "Inactive"}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-6 pt-8 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContest;
