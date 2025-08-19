import React from "react";
import  type { registrationFormData } from "../../Interfaces/index";

interface CollegeDetailsProps {
  formData: registrationFormData;
}

const CollegeDetails: React.FC<CollegeDetailsProps> = ({ formData }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-gray-800 text-xl font-semibold mb-4">
        College Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-gray-700 font-medium">College ID</h3>
          <p className="text-lg text-gray-900">{formData.studentId}</p>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium">Current Semester</h3>
          <p className="text-lg text-gray-900">{formData.currentSemester}</p>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium">Passing Year</h3>
          <p className="text-lg text-gray-900">{formData.passingYear}</p>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium">Marks/CGPA</h3>
          <p className="text-lg text-gray-900">{formData.cgpa}</p>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium">Backlogs</h3>
          <p className="text-lg text-gray-900">{formData.backlog}</p>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
