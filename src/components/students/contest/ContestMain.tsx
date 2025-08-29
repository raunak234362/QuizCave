import { useState } from "react";
import ContestList from "./ContestList";
import type { ContestData } from "../../Interfaces";

export default function ContestMain() {
  const [selectedContest, setSelectedContest] = useState<ContestData | null>(
    null
  );

  return (
    <div className="p-6">
        <ContestList onSelectContest={setSelectedContest} />
     
    </div>
  );
}
