// ContestEditModal.tsx
import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import ContestInputField from "./ContestInputField"; // Assuming path is correct

interface EditFormData {
  name: string;
  duration: number;
  set: string;
  rules: string; // Jodit/HTML content
  registration: boolean;
  active: boolean;
  startDate: string;
  endDate: string;
}

interface ContestEditModalProps {
  initialFormData: EditFormData;
  isSaving: boolean;
  onSave: (data: EditFormData) => Promise<void>;
  onClose: () => void;
}

const joditConfig = {
  minHeight: 300,
  placeholder: "Enter contest rules (supports rich text)...",
  // ... other jodit configs from your original component
};

const ContestEditModal: React.FC<ContestEditModalProps> = ({
  initialFormData,
  isSaving,
  onSave,
  onClose,
}) => {
  const [editFormData, setEditFormData] =
    useState<EditFormData>(initialFormData);

  // Update local state if initialFormData changes (e.g., when modal reopens)
  useEffect(() => {
    setEditFormData(initialFormData);
  }, [initialFormData]);

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

  // Handler for Jodit Editor
  const handleRulesChange = (newHtmlValue: string) => {
    setEditFormData((prev) => ({
      ...prev,
      rules: newHtmlValue,
    }));
  };

  const handleInternalSave = () => {
    onSave(editFormData);
  };

  // Custom render function moved to reusable component, simplifying the modal body
  const renderInputField = (
    label: string,
    name: keyof EditFormData,
    type: string = "text"
  ) => (
    <ContestInputField
      label={label}
      name={name as string}
      type={type}
      value={editFormData[name] as string | number | boolean}
      onChange={handleFormChange}
    />
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 rounded-xl shadow-2xl relative transform transition-all duration-300">
        {/* Modal Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-2 border-b-2 mb-6">
          <h3 className="text-3xl font-extrabold text-gray-800">
            ✏️ Edit Contest: {editFormData.name}
          </h3>
          <button
            onClick={onClose}
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

          {/* Rules Jodit Editor */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="rules"
            >
              Contest Rules (HTML Content):
            </label>
            <JoditEditor
              value={editFormData.rules}
              onBlur={handleRulesChange}
              onChange={handleRulesChange}
              config={joditConfig}
            />
          </div>
        </div>

        {/* Modal Footer (Save Button) */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors disabled:opacity-50"
            onClick={handleInternalSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Contest Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestEditModal;
