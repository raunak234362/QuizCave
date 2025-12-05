import { Button } from "@headlessui/react";
import type {
  ContestData,
  QuestionData,
  ResultDetails,
  UserToken,
} from "../../Interfaces/index";
import { useState } from "react";
import Service from "../../../config/Service";
import { Assessment } from "./Assessment";

interface Props {
  contest: ContestData;
  onClick: () => void;
}

const ContestCard = ({ contest }: Props) => {
  const [attempt, setAttempt] = useState(false);
  const [contestData, setContestData] = useState<ContestData>(contest);
  const [resultData, setResultData] = useState<ResultDetails>();
  const [questionData, setQuestionData] = useState<QuestionData[]>();
  const token = sessionStorage.getItem("token") || "";

  console.log("Rendering ContestCard for contest:", contest);
  const contestID = contest._id;

  //Button to attempt the contest
  const handleAttendClick = async () => {
    console.log("Attend button clicked for contest:", contestID);

    try {
      //Hit the api to check weather the user has already attempted the contest
      const response = await Service.studentContestAttempt({
        id: contestID,
      });
      console.log("Contest attempt response:", response);

      setResultData(response.data.result);
      setContestData(response.data.contest);
      setQuestionData(response.data.questions);
      setAttempt(true);
    } catch (error) {
      console.error("Error attempting contest:", error);
      alert("Error loading contest. Please try again.");
    }
  };

  if (attempt) {
    return (
      <div className="w-screen h-screen absolute top-0 left-0 z-50 bg-white ">
        <Assessment
          contest={contestData}
          resultDetails={resultData || null}
          questionDetails={questionData || null}
        />
      </div>
    );
  } else {
    return (
      <div className="w-80 p-5 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-lg font-bold">{contest.name}</h2>
        <p className="text-sm text-gray-600">{contest.description}</p>
        <p className="text-xs text-gray-500">
          Starts: {new Date(contest.startDate).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          Ends: {new Date(contest.endDate).toLocaleString()}
        </p>

        <Button
          onClick={handleAttendClick}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Attend
        </Button>
      </div>
    );
  }
};

export default ContestCard;
