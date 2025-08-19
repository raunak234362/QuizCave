import React from "react";

interface Language {
  name: string;
  proficiency: string; // e.g. "75%"
}

interface LanguagesSectionProps {
  languages: Language[];
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ languages }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-gray-800 font-semibold mb-4">Languages</h2>
      {languages.length > 0 ? (
        languages.map(({ name, proficiency }) => (
          <div key={name} className="mb-4">
            <div className="flex justify-between mb-1 font-medium text-gray-700">
              <span>{name}</span>
              <span>{proficiency}</span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full">
              <div
                className="h-3 bg-green-600 rounded-full"
                style={{ width: proficiency }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No languages added.</p>
      )}
    </div>
  );
};

export default LanguagesSection;
    