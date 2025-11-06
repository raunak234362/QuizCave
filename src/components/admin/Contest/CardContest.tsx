// CardContest.tsx
import { useEffect, useState } from "react";
import Service from "../../../config/Service";
import type { ContestData } from "../../Interfaces/index";

interface CardContestProps {
  id: string;
}

const CardContest = ({ id }: CardContestProps) => {
  console.log("Received Contest ID in CardContest:", id);
  const [contestDetails, setContestDetails] = useState<ContestData>();
  const [showSetQuestion, setShowSetQuestion] = useState("");
  const [showFilledQuestion, setShowFilledQuestion] = useState();
  // const [view, setView] = useState<"card" | "show" | "edit">("card"); // State to manage view

  useEffect(() => {
    const fetchContestDetails = async () => {
      const response = await Service.fetchContestDetails({
        id,
      });
      setContestDetails(response);
      console.log("Contest Details:", response);
    };
    const fetchContestQuestions = async () => {
      const response = await Service.fetchContestDetails({
        id,
      });
      setShowSetQuestion(response);
      console.log("Contest Questions:", response);
    };

    fetchContestQuestions();
    fetchContestDetails();
  }, [id]);
  console.log("Contest Details State:", showSetQuestion);
  const toggleShowQues = () => {
    setShowFilledQuestion(showFilledQuestion);
  };

  // if (view === "show" && contestDetails) {
  //   return <ShowContest contestDetails={contestDetails} setView={setView} />;
  // }

  // if (view === "edit" && contestDetails) {
  //   return <UpdateContest contestDetails={contestDetails} setView={setView} />;
  // }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {contestDetails?.name || "Loading..."}
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">Set:</span>{" "}
        {contestDetails?.set}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">Duration:</span> (
        {contestDetails?.duration || "Not specified"} minutes)
      </p>
      <p className="text-sm text-gay-600 mb-1">
        <span className="font-medium text-gray-700">Start Date:</span>{" "}
        {new Date(contestDetails?.startDate || "").toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium text-gray-700">End Date:</span>{" "}
        {new Date(contestDetails?.endDate || "").toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <span className="font-medium text-gray-700">Status:</span>{" "}
        {contestDetails?.declared ? (
          <span className="text-green-600 font-semibold">Declared</span>
        ) : (
          <span className="text-yellow-600 font-semibold">Not Declared</span>
        )}
      </p>
      <div className="flex flex-row items-center justify-between gap-2">
        <button
          // onClick={() => setView("show")}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Show
        </button>
        <button
          // onClick={() => setView("edit")}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Edit
        </button>
      </div>
      {showFilledQuestion && (
        <div className="h-full mt-10 top-0  overflow-y-auto">
          <div className="absolute z-20 top-0 left-0 w-full h-full overflow-y-auto bg-gray-900 bg-opacity-20 flex items-center justify-center">
            <div className="bg-white w-[70%] h-full overflow-y-auto mt-4 p-6 rounded-lg shadow-md">
              <div className="flex flex-row justify-between">
                <h3 className="text-lg font-semibold mb-2">Questions:</h3>
                <button
                  onClick={toggleShowQues}
                  className="bg-red-300 rounded-lg p-5"
                >
                  Close
                </button>
              </div>
              {/* {console.log(contestDetails)} */}
              {/* {contestDetails?.questions?.map((question, index) => (
                <div key={index} className="border-b border-gray-300 pb-3">
                  <h4 className="font-semibold mb-1">{question.question}</h4>
                  <p>
                    <strong>Type:</strong> {question.type}
                  </p>
                  <p>
                    <strong>Marks:</strong> {question.marks}
                  </p>

                  {question.type === "mcq" && (
                    <div>
                      <p>
                        <strong>Options:</strong>{" "}
                        {question?.mcqOptions?.join(", ")}
                      </p>
                      <p>
                        <strong>Single Answer:</strong> {question?.answer}
                      </p>
                    </div>
                  )}
                  {question.type === "image" && (
                    <img
                      src={question?.imageUrl}
                      alt="Question"
                      className="mt-2 w-32 h-auto"
                    />
                  )}
                  {question.type === "multiple" && (
                    <div>
                      <p>
                        <strong>Sub Questions:</strong>
                      </p>
                      <ul>
                        {question?.multipleQuestion.map(
                          (question, subIndex) => (
                            <li key={subIndex}>
                              {question?.multipleQuestion}
                              {question?.multipleAnswer}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {question.type === "short" && (
                    <p>
                      <strong>Answer:</strong> {question?.answer}
                    </p>
                  )}
                  {question.type === "long" && (
                    <p>
                      <strong>Answer:</strong> {question?.answer}
                    </p>
                  )}
                </div>
              ))} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContest;
