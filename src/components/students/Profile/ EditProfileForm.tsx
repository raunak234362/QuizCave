import React, { useState, type ChangeEvent, type FormEvent } from "react";
import type { RegistrationFormData, Address } from "../../Interfaces/index";
import { MdSave, MdCancel } from "react-icons/md";

interface EditProfileFormProps {
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  formData,
  setFormData,
  setIsEditing,
}) => {
  const [editedData, setEditedData] = useState<RegistrationFormData>(formData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [addressType, field] = name.split("-");
    setEditedData((prev) => ({
      ...prev,
      [addressType]: {
        ...(prev[addressType as keyof RegistrationFormData] as Address),
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!editedData.name?.trim()) errors.name = "Name is required.";
    if (!editedData.email?.trim()) errors.email = "Email is required.";
    if (!editedData.phone?.trim()) errors.phone = "Phone number is required.";
    if (editedData.phone?.trim() && !/^\d{10}$/.test(editedData.phone))
      errors.phone = "Phone number must be 10 digits.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // API integration here to save updated profile.
      // await Service.updateUserData(editedData);
      setFormData(editedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      // Handle error display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Student Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={editedData.name || ""}
              onChange={handleChange}
              className={`w-full border ${
                validationErrors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 mt-1 focus:ring-2 focus:ring-green-400`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700"
            >
              Contact Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={editedData.phone || ""}
              onChange={handleChange}
              className={`w-full border ${
                validationErrors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 mt-1 focus:ring-2 focus:ring-green-400`}
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.phone}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={editedData.email || ""}
              onChange={handleChange}
              className={`w-full border ${
                validationErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg p-3 mt-1 focus:ring-2 focus:ring-green-400`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Permanent Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="perm-streetLine1"
                className="block text-sm text-gray-600"
              >
                Street Line 1
              </label>
              <input
                id="perm-streetLine1"
                name="permAddress-streetLine1"
                type="text"
                value={editedData.permAddress?.streetLine1 || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label
                htmlFor="perm-city"
                className="block text-sm text-gray-600"
              >
                City
              </label>
              <input
                id="perm-city"
                name="permAddress-city"
                type="text"
                value={editedData.permAddress?.city || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Current Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="curr-streetLine1"
                className="block text-sm text-gray-600"
              >
                Street Line 1
              </label>
              <input
                id="curr-streetLine1"
                name="currAddress-streetLine1"
                type="text"
                value={editedData.currAddress?.streetLine1 || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label
                htmlFor="curr-city"
                className="block text-sm text-gray-600"
              >
                City
              </label>
              <input
                id="curr-city"
                name="currAddress-city"
                type="text"
                value={editedData.currAddress?.city || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Parents' Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fatherName"
                className="block text-sm font-semibold text-gray-700"
              >
                Father's Name
              </label>
              <input
                id="fatherName"
                name="fatherName"
                type="text"
                value={editedData.fatherName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label
                htmlFor="motherName"
                className="block text-sm font-semibold text-gray-700"
              >
                Mother's Name
              </label>
              <input
                id="motherName"
                name="motherName"
                type="text"
                value={editedData.motherName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-4"></div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition duration-200 flex items-center"
            disabled={isSubmitting}
          >
            <MdCancel className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 font-semibold transition duration-200 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
            <MdSave className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
