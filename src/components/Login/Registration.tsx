"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import LOGO from "../../assets/logo.png";
import type { registrationFormData } from "../Interfaces";
import Service from "../../config/Service";
// Define interfaces for address structure

// Course semester mapping type
type CourseSemesterMap = {
  [key: string]: string[];
};

const RegisterStudent = () => {
  const [formData, setFormData] = useState<registrationFormData>({
    profilePic: "",
    resume: "",
    name: "",
    email: "",
    phone: "",
    altPhone: "",
    password: "",
    dob: "",
    studentId: "",
    gender: "",
    fatherName: "",
    motherName: "",
    currentSemester: "",
    marksheet: "",
    branch: "",
    course: "",
    college: "",
    cgpa: "",
    passingYear: "",
    backlog: "",
    permAddress: {
      streetLine1: "",
      streetLine2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    currAddress: {
      streetLine1: "",
      streetLine2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<registrationFormData>({
    defaultValues: formData,
  });

  const [isSameAddress, setIsSameAddress] = useState<boolean>(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string>("");

  const courseSemesterMap: CourseSemesterMap = {
    "BE/BTECH": ["Semester-7", "Semester-8", "Passout"],
    BCA: ["Semester-5", "Semester-6", "Passout"],
    BBA: ["Semester-5", "Semester-6", "Passout"],
    BCOM: ["Semester-5", "Semester-6", "Passout"],
    MBA: ["Semester-3", "Semester-4", "Passout"],
    MTECH: ["Semester-3", "Semester-4", "Passout"],
    DIPLOMA: ["Semester-3", "Semester-4", "Passout"],
  };

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const selectedCourse = e.target.value;
    setFormData({ ...formData, course: selectedCourse, currentSemester: "" });
    setValue("course", selectedCourse);
    setValue("currentSemester", "");
  };

  const handleSemesterChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setFormData({ ...formData, currentSemester: e.target.value });
    setValue("currentSemester", e.target.value);
  };

  const getSemesters = (): string[] => {
    const selectedCourse = watch("course") || formData.course;
    return courseSemesterMap[selectedCourse] || [];
  };

  const handleCheckboxChange = (): void => {
    const newSameAddress = !isSameAddress;
    setIsSameAddress(newSameAddress);

    if (newSameAddress) {
      const permAddress = watch("permAddress") || formData.permAddress;
      setValue("currAddress.streetLine1", permAddress.streetLine1);
      setValue("currAddress.streetLine2", permAddress.streetLine2);
      setValue("currAddress.city", permAddress.city);
      setValue("currAddress.state", permAddress.state);
      setValue("currAddress.country", permAddress.country);
      setValue("currAddress.zip", permAddress.zip);

      setFormData((prevState) => ({
        ...prevState,
        currAddress: { ...prevState.permAddress },
      }));
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileType: "profile" | "resume" | "marksheet"
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prevState) => ({
      ...prevState,
      [fileType]: file,
    }));

    if (fileType === "profile") {
      setProfilePreview(URL.createObjectURL(file));
    } else if (fileType === "resume") {
      setResumeName(file.name);
    }
  };

  const onSubmit = async (data: registrationFormData) => {
    const formDataToSend = new FormData();

    // Append files safely
    ["resume", "profilePic", "marksheet"].forEach((key) => {
      const file = data[key as keyof registrationFormData];
      if (file instanceof File) {
        formDataToSend.append(key, file);
      } else if (typeof file === "string") {
        formDataToSend.append(key, file);
      }
    });

    // Append other fields (excluding files)
    for (const [key, value] of Object.entries(data)) {
      if (!["resume", "profilePic", "marksheet"].includes(key)) {
        if (typeof value === "object" && value !== null) {
          // Handle nested address objects
          for (const [subKey, subValue] of Object.entries(value)) {
            formDataToSend.append(`${key}.${subKey}`, subValue as string);
          }
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    }

    try {
      const response = await Service.AddStudentForm({
        data,
      });
      console.log("Registration successful:", response);
      sessionStorage.setItem("role", response.role);
      sessionStorage.setItem("token", response.accessToken);
    } catch (error) {
      console.error("Registration failed:", error);
      // Add toast/notification here
    }
  };

  const date = new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          {/* Header Section */}
          <div className="flex flex-col">
            <div
              className={`flex flex-row ${
                profilePreview !== null ? "justify-between" : "justify-center"
              } flex-wrap items-center mx-4 my-5`}
            >
              <div className="flex items-center">
                <div className="w-48 h-auto flex items-center justify-center text-white font-bold text-xl">
                  <img src={LOGO} alt="Logo" />
                </div>
              </div>

              {profilePreview && (
                <div className="flex justify-end">
                  <img
                    src={profilePreview || "/placeholder.svg"}
                    alt="Profile Preview"
                    className="rounded-full w-28 h-28 object-cover border-4 border-green-500"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-between mx-5 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
                New Student Registration Form
              </h1>
              <div className="bg-green-50 px-3 py-2 rounded-md">
                <span className="text-sm font-semibold text-green-800">
                  {date.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Student Details Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Student Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Student Name *
                  </label>
                  <input
                    placeholder="Student Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="text"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Personal Email *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="email"
                    placeholder="Enter email address"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Student College ID *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="text"
                    placeholder="Enter student ID"
                    {...register("studentId", {
                      required: "Student ID is required",
                    })}
                  />
                  {errors.studentId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.studentId.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact Number *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="tel"
                      placeholder="Enter contact number"
                      {...register("phone", {
                        required: "Contact number is required",
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="altPhone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Alternate Contact Number
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="tel"
                      placeholder="Enter alternate number"
                      {...register("altPhone")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Gender *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="date"
                      {...register("dob", {
                        required: "Date of birth is required",
                      })}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="password"
                    placeholder="Enter password (minimum 6 characters)"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Father's Name *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="text"
                    placeholder="Enter father's name"
                    {...register("fatherName", {
                      required: "Father's name is required",
                    })}
                  />
                  {errors.fatherName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fatherName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="motherName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mother's Name *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="text"
                    placeholder="Enter mother's name"
                    {...register("motherName", {
                      required: "Mother's name is required",
                    })}
                  />
                  {errors.motherName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.motherName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* College Details Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                College Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="college"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    College Name *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    type="text"
                    placeholder="Enter college name"
                    {...register("college", {
                      required: "College name is required",
                    })}
                  />
                  {errors.college && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.college.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Course *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      {...register("course", {
                        required: "Course is required",
                      })}
                      onChange={handleCourseChange}
                    >
                      <option value="">Select Your Course</option>
                      <optgroup label="Technical">
                        <option value="DIPLOMA">Diploma</option>
                        <option value="BE/BTECH">B.E/B.Tech</option>
                        <option value="MTECH">M.Tech</option>
                        <option value="BCA">
                          Bachelor's of Computer Applications
                        </option>
                      </optgroup>
                      <optgroup label="Non-Technical">
                        <option value="MBA">
                          Master's of Business Administrations
                        </option>
                        <option value="BBA">
                          Bachelor's of Business Administrations
                        </option>
                        <option value="BCOM">Bachelor's of Commerce</option>
                      </optgroup>
                    </select>
                    {errors.course && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.course.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="branch"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Branch *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="text"
                      placeholder="Enter branch"
                      {...register("branch", {
                        required: "Branch is required",
                      })}
                    />
                    {errors.branch && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.branch.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="currentSemester"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Semester *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      {...register("currentSemester", {
                        required: "Current semester is required",
                      })}
                      onChange={handleSemesterChange}
                    >
                      <option value="">Select Semester</option>
                      {getSemesters().map((semester) => (
                        <option key={semester} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </select>
                    {errors.currentSemester && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currentSemester.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="cgpa"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      CGPA *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="Enter CGPA"
                      {...register("cgpa", { required: "CGPA is required" })}
                    />
                    {errors.cgpa && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cgpa.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="backlog"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Number of Backlogs *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="number"
                      min="0"
                      placeholder="Enter number of backlogs"
                      {...register("backlog", {
                        required: "Number of backlogs is required",
                      })}
                    />
                    {errors.backlog && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.backlog.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="passingYear"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Year of Passing *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="number"
                      min="2000"
                      max="2030"
                      placeholder="Enter passing year"
                      {...register("passingYear", {
                        required: "Passing year is required",
                      })}
                    />
                    {errors.passingYear && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.passingYear.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="marksheet"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Marksheet *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      type="file"
                      placeholder="Upload marksheet"
                      {...register("marksheet", {
                        required: "Marksheet is required",
                      })}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "marksheet")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Profile Image *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      type="file"
                      placeholder="Upload profile image"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "profile")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Resume *
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      placeholder="Upload resume"
                      {...register("resume", {
                        required: "Resume is required",
                      })}
                      onChange={(e) => handleFileChange(e, "resume")}
                    />
                    {resumeName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {resumeName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Address Information
              </h2>

              <div className="space-y-6">
                {/* Permanent Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Permanent Address
                  </h3>
                  <div className="space-y-3">
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="text"
                      placeholder="Street Line 1 *"
                      {...register("permAddress.streetLine1", {
                        required: "Street Line 1 is required",
                      })}
                    />
                    {errors.permAddress?.streetLine1 && (
                      <p className="text-red-500 text-sm">
                        {errors.permAddress.streetLine1.message}
                      </p>
                    )}

                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      type="text"
                      placeholder="Street Line 2"
                      {...register("permAddress.streetLine2")}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        type="text"
                        placeholder="City *"
                        {...register("permAddress.city", {
                          required: "City is required",
                        })}
                      />
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        type="text"
                        placeholder="State *"
                        {...register("permAddress.state", {
                          required: "State is required",
                        })}
                      />
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        type="text"
                        placeholder="Country *"
                        {...register("permAddress.country", {
                          required: "Country is required",
                        })}
                      />
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        type="text"
                        placeholder="ZIP Code *"
                        {...register("permAddress.zip", {
                          required: "ZIP code is required",
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Same Address Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    checked={isSameAddress}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="sameAddress"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Current address is same as permanent address
                  </label>
                </div>

                {/* Current Address */}
                {!isSameAddress && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Current Address
                    </h3>
                    <div className="space-y-3">
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        type="text"
                        placeholder="Street Line 1 *"
                        {...register("currAddress.streetLine1", {
                          required:
                            !isSameAddress && "Street Line 1 is required",
                        })}
                      />

                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        type="text"
                        placeholder="Street Line 2"
                        {...register("currAddress.streetLine2")}
                      />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          type="text"
                          placeholder="City *"
                          {...register("currAddress.city", {
                            required: !isSameAddress && "City is required",
                          })}
                        />
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          type="text"
                          placeholder="State *"
                          {...register("currAddress.state", {
                            required: !isSameAddress && "State is required",
                          })}
                        />
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          type="text"
                          placeholder="Country *"
                          {...register("currAddress.country", {
                            required: !isSameAddress && "Country is required",
                          })}
                        />
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          type="text"
                          placeholder="ZIP Code *"
                          {...register("currAddress.zip", {
                            required: !isSameAddress && "ZIP code is required",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;
