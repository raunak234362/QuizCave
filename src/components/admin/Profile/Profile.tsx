import React, { useEffect, useState } from "react";
import Service from "../../../config/Service";
import type { UserData } from "../../Interfaces";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserData>();
  
  const fetchUserData = async () => {
    const response = await Service.fetchUserData();
    setUser(response);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-fit p-4">
      <div className="shadow-md rounded-2xl p-6 w-full ">
        <div className="flex flex-row items-center text-center gap-5">
          <div>
            <img
              src={`${import.meta.env.VITE_IMG_URL}/${user?.profilePic}`}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.role}</p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="text-gray-700">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="text-gray-700">
            <strong>Phone:</strong> {user?.phone}
          </div>
          <div className="text-gray-700">
            <strong>Designation:</strong> {user?.designation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
