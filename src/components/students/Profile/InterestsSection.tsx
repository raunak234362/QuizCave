import React from "react";

interface InterestsSectionProps {
  interests: string[];
}

const iconMap: Record<string, string> = {
  Travel: "✈️",
  Movie: "🎬",
  Sport: "⚽",
  Coffee: "☕",
  Music: "🎵",
  Design: "🎨",
};

const InterestsSection: React.FC<InterestsSectionProps> = ({ interests }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md">
    <h2 className="text-gray-800 font-semibold mb-4">Interests</h2>
    {interests.length > 0 ? (
      <div className="flex flex-wrap gap-3">
        {interests.map((interest) => (
          <span
            key={interest}
            className="flex items-center gap-1 bg-green-100 text-green-900 rounded-full px-4 py-2 font-medium shadow"
          >
            {iconMap[interest] || "⭐"} {interest}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No interests added.</p>
    )}
  </div>
);

export default InterestsSection;
