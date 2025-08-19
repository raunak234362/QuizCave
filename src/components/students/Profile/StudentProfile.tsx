import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileDetails from "./ProfileDetails";
import CollegeDetails from "./CollegeDetails";
import InterestsSection from "./InterestsSection";
import LanguagesSection from "./LanguagesSection";
import EditProfileForm from "./ EditProfileForm";
import Service from "../../../config/Service";
import type { registrationFormData } from "../../Interfaces/";
import { Dialog, Transition } from "@headlessui/react";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        console.log("Fetching user data with token:", token);

        if (!token) {
          setError("User not authenticated. Please login.");
          setLoading(false);
          return;
        }
        const userData = await Service.fetchUserData({ token });
        setFormData({
          ...emptyFormData,
          ...userData,
          permAddress: userData.permAddress || emptyAddress,
          currAddress: userData.currAddress || emptyAddress,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch profile data.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-600 text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-tr from-green-100 via-white to-blue-100 rounded-3xl shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileHeader
          name={formData.name || "Student Name"}
          profilePic={
            formData.profilePic
              ? `${import.meta.env.VITE_IMG_URL}/${formData.profilePic}`
              : undefined
          }
          bio={formData.name || "Student Bio"} 
        />
        <div className="flex-1 flex flex-col gap-6 overflow-auto max-h-[600px] md:max-h-[auto]">
          <ProfileDetails formData={formData} />
          <CollegeDetails formData={formData} />
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-8 overflow-auto max-h-[350px]">
        <InterestsSection interests={[]} /> 
        <LanguagesSection languages={[]} />
      </div>

      <div className="mt-8 flex justify-end sticky bottom-0 bg-gradient-to-t from-blue-100 p-4 rounded-b-3xl">
      
        <button
          onClick={() => setIsEditing(true)}
          className="bg-green-600 text-white rounded-full px-10 py-3 shadow-lg hover:bg-green-700 font-semibold transition duration-300"
          aria-label="Edit Profile"
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
