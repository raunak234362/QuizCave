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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[80%] max-w-2xl p-6 relative">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create New Contest
        </h1>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title:
            </label>
            <input
              type="text"
              value={contestDetails.title}
              onChange={(e) =>
                setContestDetails({ ...contestDetails, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Set */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Set:
            </label>
            <select
              value={contestDetails.set}
              onChange={(e) =>
                setContestDetails({ ...contestDetails, set: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Set</option>
              <option value="A">Technical</option>
              <option value="B">Non-Technical</option>
            </select>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Instructions:
            </label>
            <JoditEditor
              value={contestDetails.instructions}
              onChange={(value) =>
                setContestDetails({ ...contestDetails, instructions: value })
              }
            />
          </div>

                 

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Duration (in minutes):
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          {/* startDate */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Start Date:
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              End Date:
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-semibold">Active:</label>
            <button
              type="button"
              onClick={handleActiveToggle}
              className={`px-4 py-2 rounded-md text-white ${
                contestDetails.active ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {contestDetails.active ? "True" : "False"}
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContest;
