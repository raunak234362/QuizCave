import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import ContestInputField from "./ContestInputField";

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

interface ContestEditModalProps {
  initialFormData: EditFormData;
  isSaving: boolean;
  onSave: (data: EditFormData) => Promise<void>;
  onClose: () => void;
}

const joditConfig = {
  minHeight: 300,
  placeholder: "Enter contest rules (supports rich text)...",
};

const ContestEditModal: React.FC<ContestEditModalProps> = ({
  initialFormData,
  isSaving,
  onSave,
  onClose,
}) => {
  const [editFormData, setEditFormData] =
    useState<EditFormData>(initialFormData);

  useEffect(() => {
    setEditFormData(initialFormData);
  }, [initialFormData]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRulesChange = (newHtmlValue: string) => {
    setEditFormData((prev) => ({
      ...prev,
      rules: newHtmlValue,
    }));
  };

  const handleInternalSave = () => {
    onSave(editFormData);
  };

  const renderInputField = (
    label: string,
    name: keyof EditFormData,
    type: string = "text",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-teal-100 p-8 relative transform transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white z-10 py-3 border-b border-teal-200 mb-6">
          <h3 className="text-3xl font-extrabold text-teal-700">
            Edit Contest: {editFormData.name}
          </h3>
          <button
            onClick={onClose}
            className="bg-teal-100 text-teal-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-200 transition-all"
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Grid Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderInputField("Contest Name", "name")}
            {renderInputField("Set", "set")}
            {renderInputField("Duration (min)", "duration", "number")}
            {renderInputField("Start Time", "startDate", "datetime-local")}
            {renderInputField("End Time", "endDate", "datetime-local")}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-teal-100">
            {renderInputField("Registration Open", "registration", "checkbox")}
            {renderInputField("Contest Active", "active", "checkbox")}
            {renderInputField("Contest Declared", "declared", "checkbox")}
          </div>

          {/* Rules Editor */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-teal-700"
              htmlFor="rules"
            >
              Contest Rules (Rich Text)
            </label>
            <div className="border border-teal-200 rounded-lg overflow-hidden">
              <JoditEditor
                value={editFormData.rules}
                onBlur={handleRulesChange}
                onChange={handleRulesChange}
                config={joditConfig}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-teal-100 flex justify-end">
          <button
            className="bg-teal-600 text-black py-2 px-6 rounded-lg font-bold shadow-md hover:bg-teal-700 transition-all disabled:opacity-50"
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
