// ContestInputField.tsx
import React from "react";

interface ContestInputFieldProps {
  label: string;
  name: string; // keyof EditFormData
  type?: string; // e.g., "text", "number", "datetime-local", "checkbox"
  value: string | number | boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ContestInputField: React.FC<ContestInputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}) => {
  const isCheckbox = type === "checkbox";
  const inputProps: any = {
    id: name,
    name: name,
    type: type,
    onChange: onChange,
    className: isCheckbox
      ? "form-checkbox h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 order-1"
      : "mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500 transition duration-150",
  };

  if (isCheckbox) {
    inputProps.checked = value as boolean;
  } else {
    inputProps.value = value;
  }

  return (
    <div className={isCheckbox ? "flex items-center space-x-2" : "space-y-1"}>
      <label
        className={`block text-sm font-semibold text-gray-700 ${
          isCheckbox ? "order-2" : ""
        }`}
        htmlFor={name}
      >
        {label}
      </label>
      <input {...inputProps} />
    </div>
  );
};

export default ContestInputField;
