import { useState } from "react";
import ContestList from "./ContestList";
import ContestAttempt from "./ContestAttempt";
import type { ContestData } from "../../Interfaces";

export default function ContestMain() {
  const [selectedContest, setSelectedContest] = useState<ContestData | null>(
    null
  );

  return (
    <div className="p-6">
      {!selectedContest ? (
        <ContestList onSelectContest={setSelectedContest} />
      ) : (
        <ContestAttempt
          contest={selectedContest}
          onBack={() => setSelectedContest(null)}
        />
      )}
    </div>
  );
}
