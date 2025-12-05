import { useState } from "react";
import ContestList from "./ContestList";
import type { ContestData } from "../../Interfaces";

export default function ContestMain() {
  const [ setSelectedContest] = useState<ContestData | null>(
    null
  );

  const ContestListAny = ContestList as any;

  return (
    <div className="p-6">
        <ContestListAny onSelectContest={setSelectedContest} />
     
    </div>
  );
}
