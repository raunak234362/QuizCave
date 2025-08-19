import React from "react";

interface ProfileHeaderProps {
  name?: string;
  profilePic?: string;
  bio?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  profilePic,
  bio,
}) => (
  <div className="flex flex-col items-center md:w-1/3 p-6 rounded-3xl bg-white/80 shadow-lg text-center">
    {profilePic ? (
      <img
        src={profilePic}
        alt="Profile"
        className="w-40 h-40 rounded-2xl border-4 border-white shadow-md object-cover mb-4"
      />
    ) : (
      <div className="w-40 h-40 rounded-2xl border-4 border-white shadow-md bg-gray-300 flex items-center justify-center text-gray-600 mb-4">
        No Image
      </div>
    )}
    <h1 className="text-3xl font-bold text-gray-800 uppercase mb-2">{name}</h1>
    <p className="text-gray-600 text-sm">{bio || "No designation available"}</p>
  </div>
);

export default ProfileHeader;
