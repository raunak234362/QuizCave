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
  <div className="flex flex-col items-center md:w-1/3 p-6 rounded-3xl bg-white/90 shadow-2xl text-center backdrop-blur-sm">
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-green-200 rounded-2xl animate-pulse blur-md opacity-75"></div>
      {profilePic ? (
        <img
          src={profilePic}
          alt="Profile"
          className="relative w-40 h-40 rounded-2xl border-4 border-white shadow-lg object-cover"
        />
      ) : (
        <div className="relative w-40 h-40 rounded-2xl border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg">
          No Image
        </div>
      )}
    </div>
    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-1">
      {name || "Student Name"}
    </h1>
    <p className="text-gray-600 text-sm italic">{bio || "Student Bio"}</p>
  </div>
);

export default ProfileHeader;
