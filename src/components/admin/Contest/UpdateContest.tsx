import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import type { ContestData } from "../../Interfaces/index";
import "react-quill/dist/quill.snow.css"; // Import Quill's snow theme CSS

// --- Helper Functions ---

/**
 * Formats an ISO 8601 date string (or Date object) into the format
 * required by <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
 * It converts the date to the user's local timezone.
 */
const formatIsoToDateTimeLocal = (isoDate: string | Date): string => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return ""; // Handle invalid dates

  // Manually get local date parts
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

/**
 * A reusable FormItem component for consistent layout
 */
const FormItem = ({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="w-full">
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- Component Props ---

interface UpdateContestProps {
  contestDetails: ContestData;
  setView: (view: "card" | "show" | "edit") => void;
  // You would pass an update function from your API layer
  // onUpdate: (id: string, data: Partial<ContestData>) => Promise<void>;
}

// --- Main Component ---

const UpdateContest = ({ contestDetails, setView }: UpdateContestProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContestData>({
    // defaultValues are set via useEffect to handle async data
  });

  // Pre-populate the form with existing contest details
  useEffect(() => {
    if (contestDetails) {
      reset({
        ...contestDetails,
        // Format dates for the datetime-local input
        startDate: formatIsoToDateTimeLocal(contestDetails.startDate),
        endDate: formatIsoToDateTimeLocal(contestDetails.endDate),
      });
    }
  }, [contestDetails, reset]);

  /**
   * Handle the form submission
   */
  const onSubmit: SubmitHandler<ContestData> = async (data) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      // 1. Re-format dates back to ISO strings for the API
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        // Ensure 'duration' is a number if the input returns a string
        duration: Number(data.duration),
      };

      console.log("Submitting payload:", payload);

      // 2. --- API Call ---
      // Replace with your actual API service call
      // await onUpdate(contestDetails._id, payload);
      // Example delay:
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 3. On Success
      // toast.success("Contest updated successfully!");
      setView("show"); // Go back to the 'show' view after update
    } catch (err: any) {
      console.error("Failed to update contest:", err);
      setApiError(err.message || "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Update Contest</h1>
        <button
          onClick={() => setView("show")} // Go to "show" view, not "card"
          type="button"
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* API Error Display */}
        {apiError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
            {apiError}
          </div>
        )}

        {/* --- Main Details --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormItem
            label="Contest Name"
            htmlFor="name"
            error={errors.name?.message}
          >
            <input
              id="name"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm"
              {...register("name", { required: "Name is required" })}
            />
          </FormItem>

          <div className="flex gap-4">
            <FormItem label="Set" htmlFor="set" error={errors.set?.message}>
              <input
                id="set"
                type="text"
                className="w-24 border-gray-300 rounded-md shadow-sm"
                {...register("set", { required: "Set is required" })}
              />
            </FormItem>
            <FormItem
              label="Duration (minutes)"
              htmlFor="duration"
              error={errors.duration?.message}
            >
              <input
                id="duration"
                type="number"
                className="w-40 border-gray-300 rounded-md shadow-sm"
                {...register("duration", {
                  required: "Duration is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1 minute" },
                })}
              />
            </FormItem>
          </div>

          <FormItem
            label="Start Date & Time"
            htmlFor="startDate"
            error={errors.startDate?.message}
          >
            <input
              id="startDate"
              type="datetime-local"
              className="w-full border-gray-300 rounded-md shadow-sm"
              {...register("startDate", { required: "Start date is required" })}
            />
          </FormItem>

          <FormItem
            label="End Date & Time"
            htmlFor="endDate"
            error={errors.endDate?.message}
          >
            <input
              id="endDate"
              type="datetime-local"
              className="w-full border-gray-300 rounded-md shadow-sm"
              {...register("endDate", { required: "End date is required" })}
            />
          </FormItem>
        </div>

        {/* --- Boolean Toggles --- */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium text-gray-700">Settings</h3>
          <div className="flex flex-wrap gap-6 mt-2">
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                {...register("active")}
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-gray-700"
              >
                Contest Active
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="registration"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                {...register("registration")}
              />
              <label
                htmlFor="registration"
                className="text-sm font-medium text-gray-700"
              >
                Registration Open
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="declared"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                {...register("declared")}
              />
              <label
                htmlFor="declared"
                className="text-sm font-medium text-gray-700"
              >
                Results Declared
              </label>
            </div>
          </div>
        </div>

        {/* --- Rules Rich Text Editor --- */}
        <div className="pt-4 border-t">
          <FormItem
            label="Rules & Regulations"
            htmlFor="rules"
            error={errors.rules?.message}
          >
            {/* Controller is used to integrate 3rd-party components with react-hook-form */}
            <Controller
              name="rules"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-white"
                />
              )}
            />
          </FormItem>
        </div>

        {/* --- Form Actions --- */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            onClick={() => setView("show")}
            type="button"
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateContest;
