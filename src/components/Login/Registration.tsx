import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Service from "../../config/Service";
import type { Address } from "../Interfaces/";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: FileList;
  permAddress: Address;
  currAddress: Address;
};

const RegisterStudent: React.FC = () => {
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit = async ({data}:any) => {
    const response = await Service.AddStudentForm(data);
    console.log(response)
  };

  // ✅ Handle profile preview & cleanup
  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  return (
    <div>

    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Register Student</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block font-medium">First Name</label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
            className="border p-2 w-full rounded"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-medium">Last Name</label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            className="border p-2 w-full rounded"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="border p-2 w-full rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="tel"
            {...register("phone", { required: "Phone number is required" })}
            className="border p-2 w-full rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            {...register("profilePicture", { required: true })}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProfilePreview(URL.createObjectURL(file));
              }
            }}
            className="border p-2 w-full rounded"
          />
          {profilePreview && (
            <img
              src={profilePreview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>

        {/* Permanent Address */}
        <div>
          <h2 className="font-semibold mt-4">Permanent Address</h2>
          <input
            placeholder="Street Line 1"
            {...register("permAddress.streetLine1", { required: true })}
            className="border p-2 w-full rounded mt-1"
          />
          <input
            placeholder="Street Line 2"
            {...register("permAddress.streetLine2")}
            className="border p-2 w-full rounded mt-1"
          />
          <input
            placeholder="City"
            {...register("permAddress.city", { required: true })}
            className="border p-2 w-full rounded mt-1"
          />
          <input
            placeholder="State"
            {...register("permAddress.state", { required: true })}
            className="border p-2 w-full rounded mt-1"
          />
          <input
            placeholder="Pincode"
            {...register("permAddress.zip", { required: true })}
            className="border p-2 w-full rounded mt-1"
          />
          <input
            placeholder="Country"
            {...register("permAddress.country", { required: true })}
            className="border p-2 w-full rounded mt-1"
          />
        </div>

        {/* Current Address */}
        <div>
          <label className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              checked={isSameAddress}
              onChange={() => setIsSameAddress(!isSameAddress)}
              className="mr-2"
            />
            Same as Permanent Address
          </label>

          {!isSameAddress && (
            <>
              <h2 className="font-semibold mt-4">Current Address</h2>
              <input
                placeholder="Street Line 1"
                {...register("currAddress.streetLine1")}
                className="border p-2 w-full rounded mt-1"
              />
              <input
                placeholder="Street Line 2"
                {...register("currAddress.streetLine2")}
                className="border p-2 w-full rounded mt-1"
              />
              <input
                placeholder="City"
                {...register("currAddress.city")}
                className="border p-2 w-full rounded mt-1"
              />
              <input
                placeholder="State"
                {...register("currAddress.state")}
                className="border p-2 w-full rounded mt-1"
              />
              <input
                placeholder="Pincode"
                {...register("currAddress.zip")}
                className="border p-2 w-full rounded mt-1"
              />
              <input
                placeholder="Country"
                {...register("currAddress.country")}
                className="border p-2 w-full rounded mt-1"
              />
            </>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
    </div>
  );
};

export default RegisterStudent;
