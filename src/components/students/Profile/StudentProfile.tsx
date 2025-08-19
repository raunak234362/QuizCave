import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import CollegeDetails from "./CollegeDetails";
import InterestsSection from "./InterestsSection";
import LanguagesSection from "./LanguagesSection";
import EditProfileForm from "./ EditProfileForm";
import type { registrationFormData } from "../../Interfaces/";

const emptyAddress = {
  streetLine1: "",
  streetLine2: "",
  city: "",
  state: "",
  country: "",
  zip: "",
};

const emptyFormData: registrationFormData = {
  profilePic: "",
  resume: "",
  marksheet: "",
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
  permAddress: emptyAddress,
  currAddress: emptyAddress,
};

const StudentProfile: React.FC = () => {
  const [formData, setFormData] = useState<registrationFormData>(emptyFormData);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const headers = new Headers();
        headers.append(
          "Authorization",
          `Bearer ${sessionStorage.getItem("token")}`
        );
        headers.append("Content-Type", "application/json");

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/`, {
          method: "GET",
          headers,
        });
        const data = await response.json();
        setFormData(data?.data || emptyFormData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchStudent();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-tr from-green-100 via-white to-blue-100 rounded-3xl shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileHeader
          name={formData.name}
          profilePic={
            formData.profilePic
              ? `${import.meta.env.VITE_IMG_URL}/${formData.profilePic}`
              : undefined
          }
          bio={formData.name} // Using name as bio since designation doesn't exist
        />
        <div className="flex-1 flex flex-col gap-6">
          <ProfileDetails formData={formData} />
          <CollegeDetails formData={formData} />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        <InterestsSection interests={[]} />{" "}
        {/* Add interests field if available */}
        <LanguagesSection languages={[]} /> {/* Add languages if available */}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-green-600 text-white rounded-full px-8 py-2 shadow-md hover:bg-green-700 font-semibold"
        >
          Edit Profile
        </button>
      </div>

      {isEditing && (
        <EditProfileForm
          formData={formData}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default StudentProfile;
