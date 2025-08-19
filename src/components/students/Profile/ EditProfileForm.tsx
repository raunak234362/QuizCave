import React, { useState, type ChangeEvent, type FormEvent } from "react";
import type {
  registrationFormData,
  Address,
} from "../../Interfaces/index";

interface EditProfileFormProps {
  formData: registrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<registrationFormData>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  setFormData,
  setIsEditing,
}) => {
  const [editedData, setEditedData] = useState<registrationFormData>(formData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      currAddress: {
        ...(prev.currAddress || ({} as Address)),
        streetLine1: value,
      },
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add API integration here to save updated profile.

    setFormData(editedData);
    setIsEditing(false);
  };

  return (
    <div className="mt-10 bg-white p-8 rounded-3xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            Student Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={editedData.name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1 font-semibold">
            Contact Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={editedData.phone || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label htmlFor="currentAddress" className="block mb-1 font-semibold">
            Current Address
          </label>
          <input
            id="currentAddress"
            type="text"
            value={editedData.currAddress?.streetLine1 || ""}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
