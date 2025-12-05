import React from "react";
import type { RegistrationFormData } from "../../Interfaces/index";
import { MdSchool, MdCalendarToday, MdGrade, MdFileCopy } from "react-icons/md";

interface CollegeDetailsProps {
  formData: RegistrationFormData;
}

const CollegeDetails: React.FC<CollegeDetailsProps> = ({ formData }) => {
  const formatValue = (value: string | number | undefined) => {
    return value || "N/A";
  };

  interface CardProps {
    title: string;
    value: string | number | undefined;
    icon: React.ReactNode;
  }

  const Card: React.FC<CardProps> = ({ title, value, icon }) => (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200 transition-transform transform hover:scale-105">
      <div className="text-green-600 text-2xl mr-4">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-600 font-medium">{title}</h3>
        <p className="text-lg text-gray-900 font-semibold">
          {formatValue(value)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-gray-800 text-xl font-semibold mb-4">
        College Details 🎓
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card
          title="College ID"
          value={formData.studentId}
          icon={<MdSchool />}
        />
        <Card
          title="Current Semester"
          value={formData.currentSemester}
          icon={<MdCalendarToday />}
        />
        <Card
          title="Passing Year"
          value={formData.passingYear}
          icon={<MdCalendarToday />}
        />
        <Card title="Marks/CGPA" value={formData.cgpa} icon={<MdGrade />} />
        <Card title="Backlogs" value={formData.backlog} icon={<MdFileCopy />} />
      </div>
    </div>
  );
};

export default CollegeDetails;
