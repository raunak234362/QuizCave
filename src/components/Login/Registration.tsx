import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Service from "../../config/Service";
import type { RegistrationFormData } from "../Interfaces/index";
import Logo from "../../assets/logo.png";

const Registration: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {},
  } = useForm<RegistrationFormData>();
  const navigate = useNavigate();
  // const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [isSameAddress, setIsSameAddress] = useState<boolean>(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);

  const courseSemesterMap: Record<string, string[]> = {
    "BE/BTECH": ["Semester-7", "Semester-8", "passout"],
    BCA: ["Semester-5", "Semester-6", "passout"],
    BBA: ["Semester-5", "Semester-6", "passout"],
    BCOM: ["Semester-5", "Semester-6", "passout"],
    MBA: ["Semester-3", "Semester-4", "passout"],
    MTECH: ["Semester-3", "Semester-4", "passout"],
    DIPLOMA: ["Semester-3", "Semester-4", "passout"],
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = e.target.value;
    setValue("course", selectedCourse);
    setValue("currentSemester", "");
  };

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSemester = e.target.value;
    setValue("currentSemester", selectedSemester);
  };

  const getSemesters = (): string[] => {
    const selectedCourse = watch("course");
    return courseSemesterMap[selectedCourse] || [];
  };

  const handleCheckboxChange = () => {
    setIsSameAddress((prev) => !prev);

    if (!isSameAddress) {
      const permAddress = watch("permAddress");
      setValue("currAddress", permAddress);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: keyof Pick<
      RegistrationFormData,
      "profile" | "marksheet" | "resume"
    >,
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (fileType === "profile") {
        setProfilePreview(URL.createObjectURL(file));
      } else if (fileType === "resume") {
        setResumeName(file.name);
      }
      setValue(fileType, file);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    console.log("Form Data Submitted:", data);
    try {
      const response = await Service.AddStudentForm(data);
      console.log("Registration Response:", response);

      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again.");
    }
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
            <img src={Logo} alt="" />

            {profilePreview && (
              <div className="right-0 flex justify-end">
                <img
                  src={profilePreview}
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
              <label htmlFor="Name" className="text-sm">
                Student Name
              </label>
              <div className="flex flex-row w-full gap-3 mt-2 2xl:text-md md:text-sm">
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Name"
                  id="name"
                  {...register("name", { required: true })}
                />
              </div>
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
                {...register("email", { required: true })}
              />
            </div>
            <div className="mt-3 text-sm">
              <label htmlFor="CollegeID">Student College ID</label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Student ID"
                id="studentId"
                {...register("studentId", { required: true })}
              />
            </div>
            {/* Contacts */}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="contact" className="text-sm">
                  Student Contact Number
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Contact Number"
                  id="phone"
                  {...register("phone", { required: true })}
                />
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="contact" className="text-sm">
                  Alternate Contact Number
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Alternative Contact Number"
                  id="altPhone"
                  {...register("altPhone")}
                />
              </div>
            </div>
            {/*gender, dob*/}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="contact" className="text-sm">
                  Gender
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="gender"
                  {...register("gender", { required: true })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="contact" className="text-sm">
                  Date of Birth
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="date"
                  placeholder="dd-mm-yyyy"
                  id="dob"
                  {...register("dob", { required: true })}
                />
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
                {...register("password", { required: true, minLength: 6 })}
              />
            </div>
          </div>
          {/*personal information*/}
          <div className="flex flex-col p-5 m-4 rounded-lg bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              Personal Information
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="contact" className="text-sm">
                  Father Name
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Father Name"
                  id="fatherName"
                  {...register("fatherName", { required: true })}
                />
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="contact" className="text-sm">
                  Mother Name
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Mother Name"
                  id="motherName"
                  {...register("motherName", { required: true })}
                />
              </div>
            </div>
          </div>
          {/*college details*/}
          <div className="flex-row p-5 m-4 rounded-lg p- bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              College Details
            </p>
            <div className="mt-3">
              <label htmlFor="email" className="text-sm">
                College Name
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="College Name"
                id="college"
                {...register("college", { required: true })}
              />
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
                  {...register("course", { required: true })}
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
                  {...register("branch", { required: true })}
                />
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="currentSemester" className="text-sm">
                  Select Semester
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="currentSemester"
                  {...register("currentSemester", { required: true })}
                  onChange={handleSemesterChange}
                >
                  <option value="">Current Semester</option>
                  {getSemesters().map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
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
                  {...register("cgpa", { required: true })}
                />
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
                  {...register("backlog", { required: true })}
                />
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="passingYear" className="text-sm">
                  Month & Year of Passing
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="month"
                  min="2000-01"
                  max="2030-12"
                  placeholder="MM/YYYY"
                  id="passingYear"
                  {...register("passingYear", { required: true })}
                />
              </div>
            </div>

            {/*files*/}
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="marksheet" className="text-sm">
                  Upload Marksheet{" "}
                  <span className="text-gray-500">(Optional)</span>
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
                  Upload Profile Image{" "}
                  <span className="text-gray-500">(Optional)</span>
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
                  Upload Resume{" "}
                  <span className="text-gray-500">(Optional)</span>
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
                {...register("permAddress.streetLine1", { required: true })}
              />
              <input
                className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Street Line 2"
                id="permanentStreetLine2"
                {...register("permAddress.streetLine2", { required: false })}
              />
              {/*address[4 fields]*/}
              <div className="flex gap-2">
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="City"
                  id="permanentCity"
                  {...register("permAddress.city", { required: true })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="State"
                  id="permanentState"
                  {...register("permAddress.state", { required: true })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Country"
                  id="permanentCountry"
                  {...register("permAddress.country", { required: true })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Zip Code"
                  id="permanentZip"
                  {...register("permAddress.zip", { required: true })}
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
                  {...register("currAddress.streetLine1", { required: true })}
                />
                <input
                  className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Street Line 2"
                  id="currentStreetLine2"
                  {...register("currAddress.streetLine2", { required: false })}
                />
                <div className="flex gap-2">
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="City"
                    id="currentCity"
                    {...register("currAddress.city", { required: true })}
                  />
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="State"
                    id="currentState"
                    {...register("currAddress.state", { required: true })}
                  />
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="Country"
                    id="currentCountry"
                    {...register("currAddress.country", { required: true })}
                  />
                  <input
                    className="w-full px-4 py-3 mt-2 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                    type="text"
                    placeholder="Zip Code"
                    id="currentZip"
                    {...register("currAddress.zip", { required: true })}
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

export default Registration;
