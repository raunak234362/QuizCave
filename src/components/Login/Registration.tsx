/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";

// Define interfaces for type safety
interface Address {
  streetLine1: string;
  streetLine2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface FormData {
  profilePic: File | string;
  resume: File | string;
  name: string;
  email: string;
  phone: string;
  altPhone: string;
  password: string;
  dob: string;
  studentId: string;
  gender: string;
  fatherName: string;
  motherName: string;
  currentSemester: string;
  marksheet: File | string;
  branch: string;
  course: string;
  college: string;
  cgpa: string;
  passingYear: string;
  backlog: string;
  permAddress: Address;
  currAddress: Address;
}

type CourseType =
  | "BE/BTECH"
  | "BCA"
  | "BBA"
  | "BCOM"
  | "MBA"
  | "MTECH"
  | "DIPLOMA";

const RegisterStudent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
    formState: { errors },
  } = useForm<FormData>();

  const [isSameAddress, setIsSameAddress] = useState<boolean>(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string>("");

  const courseSemesterMap: Record<CourseType, string[]> = {
    "BE/BTECH": ["Semester-7", "Semester-8", "Passout"],
    BCA: ["Semester-5", "Semester-6", "Passout"],
    BBA: ["Semester-5", "Semester-6", "Passout"],
    BCOM: ["Semester-5", "Semester-6", "Passout"],
    MBA: ["Semester-3", "Semester-4", "Passout"],
    MTECH: ["Semester-3", "Semester-4", "Passout"],
    DIPLOMA: ["Semester-3", "Semester-4", "Passout"],
  };

  const handleCourseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedCourse = e.target.value as CourseType;
    setFormData({ ...formData, course: selectedCourse, currentSemester: "" });
  };

  const handleSemesterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFormData({ ...formData, currentSemester: e.target.value });
  };

  const getSemesters = (): string[] => {
    const selectedCourse = formData.course as CourseType;
    return courseSemesterMap[selectedCourse] || [];
  };

  const handleCheckboxChange = (): void => {
    setIsSameAddress(!isSameAddress);
    if (!isSameAddress) {
      setFormData((prevState) => ({
        ...prevState,
        currAddress: { ...prevState.permAddress },
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "profile" | "marksheet" | "resume"
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileType === "profile") {
      setProfilePreview(URL.createObjectURL(file));
      setFormData((prevState) => ({
        ...prevState,
        profilePic: file,
      }));
    } else if (fileType === "marksheet") {
      setFormData((prevState) => ({
        ...prevState,
        marksheet: file,
      }));
    } else if (fileType === "resume") {
      setResumeName(file.name);
      setFormData((prevState) => ({
        ...prevState,
        resume: file,
      }));
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form data:", data);
    // Add your submission logic here
  };

  const date = new Date();

  return (
    <div>
      <div className="flex flex-col border 2xl:mx-[20%] lg:mx-[10%] my-3 rounded-lg p-4 bg-white shadow-lg shadow-green-500/50 md:mx-[10%]">
        <div className="flex flex-col">
          <div
            className={`flex flex-row ${
              profilePreview !== null ? "justify-between" : "justify-center"
            } flex-wrap items-center mx-10 my-5`}
          >
            <img
              src="/placeholder.svg?height=120&width=200"
              className="w-[20%] items-center ml-2 mb-5 lg:w-[30%] xl:w-[30%] md:w-[30%] sm:w-[30%]"
              alt="Logo"
            />

            {profilePreview && (
              <div className="right-0 flex justify-end">
                <img
                  src={profilePreview || "/placeholder.svg"}
                  alt="Profile Preview"
                  className="my-auto rounded-full w-28 h-28"
                />
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-end mx-5">
            <h1 className="w-full font-bold text-center text-gray-800 2xl:items-center 2xl:text-2xl pl-28 lg:text-2xl lg:pl-14 md:text-xl md:pl-14 sm:text-xl">
              New Student Registration Form
            </h1>
            <h1 className="items-center px-1 py-1 font-bold text-center text-gray-800 rounded-md 2xl:text-md xl:text-md lg:text-sm md:text-md sm:text-xs bg-green-50 w-fit">
              {date.toLocaleDateString()}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            id="studentDetails"
            className="flex-row p-5 m-4 rounded-lg bg-green-50"
          >
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              Student Details
            </p>
            <div>
              <label htmlFor="name" className="text-sm">
                Student Name
              </label>
              <div className="flex flex-row w-full gap-3 mt-2 2xl:text-md md:text-sm">
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Name"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="mt-3">
              <label htmlFor="email" className="text-sm">
                Personal Email
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="email"
                placeholder="Email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mt-3 text-sm">
              <label htmlFor="studentId">Student College ID</label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Student ID"
                id="studentId"
                {...register("studentId", {
                  required: "Student ID is required",
                })}
              />
              {errors.studentId && (
                <span className="text-red-500 text-sm">
                  {errors.studentId.message}
                </span>
              )}
            </div>
            {/* Contacts */}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="phone" className="text-sm">
                  Student Contact Number
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="tel"
                  placeholder="Contact Number"
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="altPhone" className="text-sm">
                  Alternate Contact Number
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="tel"
                  placeholder="Alternative Contact Number"
                  id="altPhone"
                  {...register("altPhone")}
                />
              </div>
            </div>
            {/*gender, dob*/}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="gender" className="text-sm">
                  Gender
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="gender"
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <span className="text-red-500 text-sm">
                    {errors.gender.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="dob" className="text-sm">
                  Date of Birth
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="date"
                  id="dob"
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                />
                {errors.dob && (
                  <span className="text-red-500 text-sm">
                    {errors.dob.message}
                  </span>
                )}
              </div>
            </div>

            <div className="relative mt-3 group">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                type="password"
                placeholder="Password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          {/*personal information*/}
          <div className="flex flex-col p-5 m-4 rounded-lg bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              Personal Information
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="fatherName" className="text-sm">
                  Father Name
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Father Name"
                  id="fatherName"
                  {...register("fatherName", {
                    required: "Father's name is required",
                  })}
                />
                {errors.fatherName && (
                  <span className="text-red-500 text-sm">
                    {errors.fatherName.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="motherName" className="text-sm">
                  Mother Name
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Mother Name"
                  id="motherName"
                  {...register("motherName", {
                    required: "Mother's name is required",
                  })}
                />
                {errors.motherName && (
                  <span className="text-red-500 text-sm">
                    {errors.motherName.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/*college details*/}
          <div className="flex-row p-5 m-4 rounded-lg bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              College Details
            </p>
            <div className="mt-3">
              <label htmlFor="college" className="text-sm">
                College Name
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="College Name"
                id="college"
                {...register("college", {
                  required: "College name is required",
                })}
              />
              {errors.college && (
                <span className="text-red-500 text-sm">
                  {errors.college.message}
                </span>
              )}
            </div>

            {/*cgpa,backlogs, year of passing*/}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="course" className="text-sm">
                  Course
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="course"
                  {...register("course", { required: "Course is required" })}
                  onChange={handleCourseChange}
                >
                  <option value="">Select Your Course</option>
                  <optgroup label="Technical">
                    <option value="DIPLOMA">Diploma</option>
                    <option value="BE/BTECH">B.E/B.Tech</option>
                    <option value="MTECH">M.Tech</option>
                    <option value="BCA">
                      {"Bachelor's of Computer Applications"}
                    </option>
                  </optgroup>
                  <optgroup label="Non-Technical">
                    <option value="MBA">
                      {"Master's of Business Administrations"}
                    </option>
                    <option value="BBA">
                      {"Bachelor's of Business Administrations"}
                    </option>
                    <option value="BCOM">{"Bachelor's of Commerce"}</option>
                  </optgroup>
                </select>
                {errors.course && (
                  <span className="text-red-500 text-sm">
                    {errors.course.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="branch" className="text-sm">
                  Branch
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Branch"
                  id="branch"
                  {...register("branch", { required: "Branch is required" })}
                />
                {errors.branch && (
                  <span className="text-red-500 text-sm">
                    {errors.branch.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="currentSemester" className="text-sm">
                  Select Semester
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="currentSemester"
                  {...register("currentSemester", {
                    required: "Current semester is required",
                  })}
                  onChange={handleSemesterChange}
                >
                  <option value="">Current Semester</option>
                  {getSemesters()?.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                {errors.currentSemester && (
                  <span className="text-red-500 text-sm">
                    {errors.currentSemester.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="cgpa" className="text-sm">
                  CGPA
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="CGPA"
                  id="cgpa"
                  {...register("cgpa", { required: "CGPA is required" })}
                />
                {errors.cgpa && (
                  <span className="text-red-500 text-sm">
                    {errors.cgpa.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="backlog" className="text-sm">
                  No. of Backlog
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="number"
                  min="0"
                  placeholder="No. of Backlog"
                  id="backlog"
                  {...register("backlog", {
                    required: "Number of backlogs is required",
                  })}
                />
                {errors.backlog && (
                  <span className="text-red-500 text-sm">
                    {errors.backlog.message}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="passingYear" className="text-sm">
                  Year of Passing
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="number"
                  min="2000"
                  max="2030"
                  placeholder="Passing Year"
                  id="passingYear"
                  {...register("passingYear", {
                    required: "Passing year is required",
                  })}
                />
                {errors.passingYear && (
                  <span className="text-red-500 text-sm">
                    {errors.passingYear.message}
                  </span>
                )}
              </div>
            </div>

            {/*files*/}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="marksheet" className="text-sm">
                  Upload Marksheet
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="marksheet"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "marksheet")}
                />
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="profile" className="text-sm">
                  Upload Profile Image
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="profile"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profile")}
                />
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="resume" className="text-sm">
                  Upload Resume
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "resume")}
                />
                {resumeName && (
                  <div className="mt-2">
                    <p>Resume: {resumeName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*address*/}
          <div className="flex-row p-5 m-4 rounded-lg bg-green-50">
            <div className="mt-3">
              <p className="text-2xl font-bold text-green-800"></p>
              <label htmlFor="permanentAddress" className="font-bold">
                Permanent Address
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Street Line 1"
                id="permanentStreetLine1"
                {...register("permAddress.streetLine1", {
                  required: "Street address is required",
                })}
              />
              {errors.permAddress?.streetLine1 && (
                <span className="text-red-500 text-sm">
                  {errors.permAddress.streetLine1.message}
                </span>
              )}
              <input
                className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Street Line 2"
                id="permanentStreetLine2"
                {...register("permAddress.streetLine2")}
              />
              {/*address[4 fields]*/}
              <div className="flex gap-2">
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="City"
                  id="permanentCity"
                  {...register("permAddress.city", {
                    required: "City is required",
                  })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="State"
                  id="permanentState"
                  {...register("permAddress.state", {
                    required: "State is required",
                  })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Country"
                  id="permanentCountry"
                  {...register("permAddress.country", {
                    required: "Country is required",
                  })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Zip Code"
                  id="permanentZip"
                  {...register("permAddress.zip", {
                    required: "Zip code is required",
                  })}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isSameAddress}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Same as Permanent Address</span>
              </label>
            </div>
            {!isSameAddress && (
              <div className="mt-3">
                <label htmlFor="currentAddress" className="font-bold">
                  Current Address
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Street Line 1"
                  id="currentStreetLine1"
                  {...register("currAddress.streetLine1", {
                    required: !isSameAddress,
                  })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Street Line 2"
                  id="currentStreetLine2"
                  {...register("currAddress.streetLine2")}
                />
                <div className="flex gap-2">
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="City"
                    id="currentCity"
                    {...register("currAddress.city", {
                      required: !isSameAddress,
                    })}
                  />
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="State"
                    id="currentState"
                    {...register("currAddress.state", {
                      required: !isSameAddress,
                    })}
                  />
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="Country"
                    id="currentCountry"
                    {...register("currAddress.country", {
                      required: !isSameAddress,
                    })}
                  />
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="Zip Code"
                    id="currentZip"
                    {...register("currAddress.zip", {
                      required: !isSameAddress,
                    })}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="px-4 py-3 text-xl font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudent;
