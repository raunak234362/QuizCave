import React from "react";
import type { registrationFormData } from "../../Interfaces/index";

interface ProfileDetailsProps {
  formData: registrationFormData;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-white p-5 rounded-2xl shadow-md">
    <h3 className="text-gray-700 font-semibold mb-2">{title}</h3>
    <div className="text-gray-900 text-lg">{children}</div>
  </div>
);

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ formData }) => {
  const formatAddress = (address = {}) => {
    const { streetLine1, streetLine2, city } = address as any;
    return [streetLine1, streetLine2?.toUpperCase?.(), city?.toUpperCase?.()]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard title="Email">{formData.email?.toLowerCase()}</InfoCard>
      <InfoCard title="Contact Number">{formData.phone}</InfoCard>
      <InfoCard title="Father Name">
        {formData.fatherName?.toUpperCase()}
      </InfoCard>
      <InfoCard title="Mother Name">
        {formData.motherName?.toUpperCase()}
      </InfoCard>
      <InfoCard title="Permanent Address">
        {formatAddress(formData.permAddress)}
      </InfoCard>
      <InfoCard title="Current Address">
        {formatAddress(formData.currAddress)}
      </InfoCard>
    </div>
  );
};

export default ProfileDetails;
