import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Service from "../../config/Service";
import type { RegistrationFormData, Address } from "../Interfaces/index";

const RegisterStudent: React.FC = () => {
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [profileFile, setProfileFile] = useState<File[]>([]);
  const [marksheet, setMarksheet] = useState<File[]>([]);
  const [resume, setResume] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    defaultValues: {
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
      branch: "",
      course: "",
      college: "",
      cgpa: "",
      passingYear: "",
      backlog: "",
      permAddress: JSON.stringify({
        streetLine1: "",
        streetLine2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      }),
      currAddress: JSON.stringify({
        streetLine1: "",
        streetLine2: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      }),
    },
  });

  const navigate = useNavigate();
  const course = watch("course");

  const courseSemesterMap: { [key: string]: string[] } = {
    "BE/BTECH": ["Semester-7", "Semester-8", "Passout"],
    BCA: ["Semester-5", "Semester-6", "Passout"],
    BBA: ["Semester-5", "Semester-6", "Passout"],
    BCOM: ["Semester-5", "Semester-6", "Passout"],
    MBA: ["Semester-3", "Semester-4", "Passout"],
    MTECH: ["Semester-3", "Semester-4", "Passout"],
    DIPLOMA: ["Semester-3", "Semester-4", "Passout"],
  };

  const getSemesters = () => {
    return courseSemesterMap[course] || [];
  };

  const handleCheckboxChange = () => {
    setIsSameAddress(!isSameAddress);
    if (!isSameAddress) {
      const permAddress = watch("permAddress");
      setValue("currAddress", permAddress);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    console.log("File selected:", file);
    console.log("File type:", type);

    if (file) {
      if (type === "profile") {
        setProfileFile([file]);
      }
      if (type === "resume") {
        setResume([file]);
      }
      if (type === "marksheet") {
        setMarksheet([file]);
      }
    }
  };

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    // Basic validation for required files
    if (!marksheet[0] || !profileFile[0] || !resume[0]) {
      alert("Please upload a marksheet, profile image, and resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      // Append form fields directly
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      if (data.altPhone) formData.append("altPhone", data.altPhone);
      formData.append("password", data.password);
      formData.append("dob", data.dob);
      formData.append("studentId", data.studentId);
      formData.append("gender", data.gender);
      formData.append("fatherName", data.fatherName);
      formData.append("motherName", data.motherName);
      formData.append("currentSemester", data.currentSemester);
      formData.append("branch", data.branch);
      formData.append("course", data.course);
      formData.append("college", data.college);
      formData.append("cgpa", data.cgpa);
      formData.append("passingYear", data.passingYear);
      formData.append("backlog", data.backlog);
      formData.append("permAddress", data.permAddress);
      formData.append("currAddress", data.currAddress);

      // Append files
      if (marksheet[0]) {
        formData.append("marksheet", marksheet[0]);
      }
      if (profileFile[0]) {
        formData.append("profilePic", profileFile[0]);
      }
      if (resume[0]) {
        formData.append("resume", resume[0]);
      }

      // Log FormData entries for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send data to the backend
      const response = await Service.AddStudentForm({ data });
      console.log("Submission response:", response);

      // Reset form and clear files
      reset();
      setProfileFile([]);
      setMarksheet([]);
      setResume([]);
      alert("Student registration submitted successfully!");
      navigate("/success");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting the registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let objectUrl: string | undefined;
    if (profileFile && profileFile[0]) {
      objectUrl = URL.createObjectURL(profileFile[0]);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [profileFile]);

  return (
    <div>
      <div className="flex flex-col border 2xl:mx-[20%] lg:mx-[10%] my-3 rounded-lg p-4 bg-white shadow-lg shadow-green-500/50 md:mx-[10%]">
        <div className="flex flex-col">
          <div
            className={`flex flex-row ${
              profileFile.length > 0 ? "justify-between" : "justify-center"
            } flex-wrap items-center mx-10 my-5`}
          >
            {profileFile.length > 0 && (
              <div className="right-0 flex justify-end">
                <img
                  src={URL.createObjectURL(profileFile[0])}
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
              {new Date().toLocaleDateString()}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex-row p-5 m-4 rounded-lg bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              Student Details
            </p>
            <div>
              <label htmlFor="name" className="text-sm">
                Student Name *
              </label>
              <div className="flex flex-row w-full gap-3 mt-2 2xl:text-md md:text-sm">
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Name"
                  id="name"
                  disabled={isSubmitting}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name.message}</p>
                )}
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="email" className="text-sm">
                Personal Email *
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="email"
                placeholder="Email"
                id="email"
                disabled={isSubmitting}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            <div className="mt-3 text-sm">
              <label htmlFor="studentId">Student College ID *</label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Student ID"
                id="studentId"
                disabled={isSubmitting}
                {...register("studentId", {
                  required: "Student ID is required",
                })}
              />
              {errors.studentId && (
                <p className="text-red-500 text-xs">
                  {errors.studentId.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="phone" className="text-sm">
                  Student Contact Number *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Contact Number"
                  id="phone"
                  disabled={isSubmitting}
                  {...register("phone", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="altPhone" className="text-sm">
                  Alternate Contact Number
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Alternative Contact Number"
                  id="altPhone"
                  disabled={isSubmitting}
                  {...register("altPhone", {
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid alternate phone number",
                    },
                  })}
                />
                {errors.altPhone && (
                  <p className="text-red-500 text-xs">
                    {errors.altPhone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="gender" className="text-sm">
                  Gender *
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="gender"
                  disabled={isSubmitting}
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="dob" className="text-sm">
                  Date of Birth *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="date"
                  placeholder="dd-mm-yyyy"
                  id="dob"
                  disabled={isSubmitting}
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs">{errors.dob.message}</p>
                )}
              </div>
            </div>
            <div className="relative mt-3 group">
              <label htmlFor="password" className="text-sm">
                Password *
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                type="password"
                placeholder="Password"
                id="password"
                disabled={isSubmitting}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col p-5 m-4 rounded-lg bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              Personal Information
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="fatherName" className="text-sm">
                  Father Name *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Father Name"
                  id="fatherName"
                  disabled={isSubmitting}
                  {...register("fatherName", {
                    required: "Father's name is required",
                  })}
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-xs">
                    {errors.fatherName.message}
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[560px]">
                <label htmlFor="motherName" className="text-sm">
                  Mother Name *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Mother Name"
                  id="motherName"
                  disabled={isSubmitting}
                  {...register("motherName", {
                    required: "Mother's name is required",
                  })}
                />
                {errors.motherName && (
                  <p className="text-red-500 text-xs">
                    {errors.motherName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-row p-5 m-4 rounded-lg bg-green-50">
            <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
              College Details
            </p>
            <div className="mt-3">
              <label htmlFor="college" className="text-sm">
                College Name *
              </label>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="College Name"
                id="college"
                disabled={isSubmitting}
                {...register("college", {
                  required: "College name is required",
                })}
              />
              {errors.college && (
                <p className="text-red-500 text-xs">{errors.college.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="course" className="text-sm">
                  Course *
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="course"
                  disabled={isSubmitting}
                  {...register("course", { required: "Course is required" })}
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
                  <p className="text-red-500 text-xs">
                    {errors.course.message}
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="branch" className="text-sm">
                  Branch *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Branch"
                  id="branch"
                  disabled={isSubmitting}
                  {...register("branch", { required: "Branch is required" })}
                />
                {errors.branch && (
                  <p className="text-red-500 text-xs">
                    {errors.branch.message}
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="currentSemester" className="text-sm">
                  Select Semester *
                </label>
                <select
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  id="currentSemester"
                  disabled={isSubmitting}
                  {...register("currentSemester", {
                    required: "Semester is required",
                  })}
                >
                  <option value="">Current Semester</option>
                  {getSemesters().map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                {errors.currentSemester && (
                  <p className="text-red-500 text-xs">
                    {errors.currentSemester.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="cgpa" className="text-sm">
                  CGPA *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="CGPA"
                  id="cgpa"
                  disabled={isSubmitting}
                  {...register("cgpa", {
                    required: "CGPA is required",
                    min: { value: 0, message: "CGPA must be at least 0" },
                    max: { value: 10, message: "CGPA cannot exceed 10" },
                  })}
                />
                {errors.cgpa && (
                  <p className="text-red-500 text-xs">{errors.cgpa.message}</p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="backlog" className="text-sm">
                  No. of Backlogs *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="number"
                  min="0"
                  placeholder="No. of Backlog"
                  id="backlog"
                  disabled={isSubmitting}
                  {...register("backlog", {
                    required: "Number of backlogs is required",
                    min: { value: 0, message: "Backlogs cannot be negative" },
                  })}
                />
                {errors.backlog && (
                  <p className="text-red-500 text-xs">
                    {errors.backlog.message}
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="passingYear" className="text-sm">
                  Year of Passing *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="number"
                  min="2000"
                  max="2025"
                  placeholder="Passing Year"
                  id="passingYear"
                  disabled={isSubmitting}
                  {...register("passingYear", {
                    required: "Passing year is required",
                    min: { value: 2000, message: "Year must be after 2000" },
                    max: { value: 2025, message: "Year cannot be after 2025" },
                  })}
                />
                {errors.passingYear && (
                  <p className="text-red-500 text-xs">
                    {errors.passingYear.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:gap-5">
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="marksheet" className="text-sm">
                  Upload Marksheet *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="marksheet"
                  accept=".pdf,.doc,.docx"
                  disabled={isSubmitting}
                  onChange={(e) => handleFileChange(e, "marksheet")}
                />
                {marksheet.length === 0 && (
                  <p className="mt-1 text-sm text-red-500">
                    Marksheet is required.
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="profile" className="text-sm">
                  Upload Profile Image *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="profile"
                  accept="image/*"
                  disabled={isSubmitting}
                  onChange={(e) => handleFileChange(e, "profile")}
                />
                {profileFile.length === 0 && (
                  <p className="mt-1 text-sm text-red-500">
                    Profile image is required.
                  </p>
                )}
              </div>
              <div className="mt-3 w-full sm:w-[375px]">
                <label htmlFor="resume" className="text-sm">
                  Upload Resume *
                </label>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  disabled={isSubmitting}
                  onChange={(e) => handleFileChange(e, "resume")}
                />
                {resume.length > 0 && (
                  <div className="mt-2">
                    <p>Resume: {resume[0].name}</p>
                  </div>
                )}
                {resume.length === 0 && (
                  <p className="mt-1 text-sm text-red-500">
                    Resume is required.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex-row p-5 m-4 rounded-lg bg-green-50">
            <div className="mt-3">
              <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
                Permanent Address *
              </p>
              <input
                className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                type="text"
                placeholder="Street Line 1"
                id="permanentStreetLine1"
                disabled={isSubmitting}
                {...register("permAddress", {
                  required: "Permanent address is required",
                  validate: {
                    validJson: (value) => {
                      try {
                        const parsed = JSON.parse(value);
                        return (
                          (parsed.streetLine1 &&
                            parsed.city &&
                            parsed.state &&
                            parsed.country &&
                            parsed.zip) ||
                          "All required address fields must be filled"
                        );
                      } catch {
                        return "Invalid address format";
                      }
                    },
                  },
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  try {
                    const parsed = JSON.parse(value);
                    setValue("permAddress", JSON.stringify(parsed));
                  } catch {
                    setValue("permAddress", value);
                  }
                }}
              />
              {errors.permAddress && (
                <p className="text-red-500 text-xs">
                  {errors.permAddress.message}
                </p>
              )}
            </div>
            <div className="mt-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isSameAddress}
                  onChange={handleCheckboxChange}
                  className="form-checkbox"
                  disabled={isSubmitting}
                />
                <span className="ml-2">Same as Permanent Address</span>
              </label>
            </div>
            {!isSameAddress && (
              <div className="mt-3">
                <p className="font-bold text-green-800 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-lg">
                  Current Address *
                </p>
                <input
                  className="w-full px-4 py-3 leading-tight text-gray-700 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 peer"
                  type="text"
                  placeholder="Current Address (JSON format)"
                  id="currentAddress"
                  disabled={isSubmitting}
                  {...register("currAddress", {
                    required: "Current address is required",
                    validate: {
                      validJson: (value) => {
                        try {
                          const parsed = JSON.parse(value);
                          return (
                            (parsed.streetLine1 &&
                              parsed.city &&
                              parsed.state &&
                              parsed.country &&
                              parsed.zip) ||
                            "All required address fields must be filled"
                          );
                        } catch {
                          return "Invalid address format";
                        }
                      },
                    },
                  })}
                  onChange={(e) => {
                    const value = e.target.value;
                    try {
                      const parsed = JSON.parse(value);
                      setValue("currAddress", JSON.stringify(parsed));
                    } catch {
                      setValue("currAddress", value);
                    }
                  }}
                />
                {errors.currAddress && (
                  <p className="text-red-500 text-xs">
                    {errors.currAddress.message}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center pt-6 space-x-4">
            <button
              className="px-4 py-3 text-xl font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setProfileFile([]);
                setMarksheet([]);
                setResume([]);
              }}
              disabled={isSubmitting}
              className="px-4 py-3 text-xl font-bold text-white bg-red-500 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudent;
