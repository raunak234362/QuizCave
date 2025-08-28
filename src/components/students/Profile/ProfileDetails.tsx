import React from "react";
import type { registrationFormData } from "../../Interfaces/index";
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdFamilyRestroom,
} from "react-icons/md";

interface ProfileDetailsProps {
  formData: registrationFormData;
}

const InfoCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
    <div className="flex items-center mb-2">
      <div className="text-green-500 mr-3 text-2xl">{icon}</div>
      <h3 className="text-gray-700 font-semibold">{title}</h3>
    </div>
    <div className="text-gray-900 text-lg font-medium">{children}</div>
  </div>
);

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ formData }) => {
  const formatAddress = (address: {
    streetLine1?: string;
    streetLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  } | undefined) => {
    if (!address) return "Address not available";
    const { streetLine1, streetLine2, city, state, country, zip } = address;
    const parts = [streetLine1, streetLine2, city, state, zip, country].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard title="Email" icon={<MdEmail />}>
        {formData.email?.toLowerCase() || "N/A"}
      </InfoCard>
      <InfoCard title="Contact Number" icon={<MdPhone />}>
        {formData.phone || "N/A"}
      </InfoCard>
      <InfoCard title="Father's Name" icon={<MdFamilyRestroom />}>
        {formData.fatherName?.toUpperCase() || "N/A"}
      </InfoCard>
      <InfoCard title="Mother's Name" icon={<MdFamilyRestroom />}>
        {formData.motherName?.toUpperCase() || "N/A"}
      </InfoCard>
      <InfoCard title="Permanent Address" icon={<MdLocationOn />}>
        {formatAddress(formData.permAddress)}
      </InfoCard>
      <InfoCard title="Current Address" icon={<MdLocationOn />}>
        {formatAddress(formData.currAddress)}
      </InfoCard>
    </div>
  );
};

export default ProfileDetails;
