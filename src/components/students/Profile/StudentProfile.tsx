  import React, { useEffect, useState, Fragment } from "react";
  import ProfileHeader from "./ProfileHeader";
  import ProfileDetails from "./ProfileDetails";
  import CollegeDetails from "./CollegeDetails";
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
    const [formData, setFormData] =
      useState<registrationFormData>(emptyFormData);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function fetchUserData() {
        setLoading(true);
        setError(null);
        try {
        
          const userData = await Service.fetchUserData();

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
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium ml-4">
            Loading profile...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-[400px] p-6 text-center">
          <p className="text-red-600 text-xl font-semibold bg-red-100 p-6 rounded-lg shadow-md">
            Error: {error}
          </p>
        </div>
      );
    }

    return (
      <div className="w-full h-[95vh] overflow-y-auto  mx-auto p-8 bg-gradient-to-tr from-green-100 via-white to-blue-100 rounded-xl shadow-2xl ">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileHeader
            name={formData.name || "Student Name"}
            profilePic={  
              formData.profilePic
                ? `${import.meta.env.VITE_IMG_URL}/${formData.profilePic}`
                : undefined
            }
            bio={
              formData.name ? `Student at ${formData.college}` : "Student Bio"
            }
          />
          <div className="flex-1 flex flex-col gap-6">
            <ProfileDetails formData={formData} />
            <CollegeDetails formData={formData} />
          </div>
        </div>

        {/* This container ensures the button is always visible at the bottom of the profile */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-600 text-white rounded-full px-10 py-3 shadow-lg hover:bg-green-700 font-semibold transition duration-300 transform hover:scale-105"
            aria-label="Edit Profile"
          >
            Edit Profile
          </button>
        </div>

        <Transition appear show={isEditing} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsEditing(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <EditProfileForm
                      formData={formData}
                      setFormData={setFormData}
                      setIsEditing={setIsEditing}
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    );
  };

  export default StudentProfile;