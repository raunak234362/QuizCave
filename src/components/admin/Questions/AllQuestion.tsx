import { useEffect, useState, type ChangeEvent } from "react";
import { CgAdd } from "react-icons/cg";
import Service from "../../../config/Service";
import type { QuestionData } from "../../Interfaces/index";
import AddQuestion from "./AddQuestion";

const AllQuestion: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupRowIndex, setPopupRowIndex] = useState<number | null>(null);
  const [showSetA, setShowSetA] = useState(false);
  const [showSetB, setShowSetB] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [setFilter, setSetFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editFormState, setEditFormState] = useState({
    question: "",
    set: "",
    difficulty: "",
  });

  const fetchAllQuestions = async () => {
    try {
      const response = await Service.fetchAllQuestions();
      setQuestions(response);
      console.log("Fetched questions:", response);
    } catch (error) {
      console.error("Error fetching all questions:", error);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const toggleEditQuestion = (index: number) => {
    if (popupRowIndex === index && popupVisible) {
      setPopupVisible(false);
      setPopupRowIndex(null);
    } else {
      const question = questions[index];
      const questionText =
        typeof question === "string" ? question : question?.question || "";
      setEditFormState({
        question: questionText,
        set: question.set,
        difficulty: question.difficult,
      });
      setPopupRowIndex(index);
      setPopupVisible(true);
    }
  };

  const handleEditFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEditFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFormSubmit = async () => {
    if (popupRowIndex === null) return;
    const questionToUpdate = questions[popupRowIndex];
    if (!questionToUpdate || !questionToUpdate._id) {
      console.error("Question or question ID not found for update.");
      return;
    }

    try {
      await Service.UpdateQuestionById({
        questionId: questionToUpdate._id,
        updatedData: {
          question: editFormState.question,
          set: editFormState.set,
          difficult: editFormState.difficulty,
        },
      });
      await fetchAllQuestions();
      setPopupVisible(false);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    const questionToDelete = questions[index];
    if (!questionToDelete || !questionToDelete._id) {
      console.error("Question or question ID not found for delete.");
      return;
    }

    try {
      await Service.deleteQuestionById({ questionId: questionToDelete._id });
      await fetchAllQuestions();
      setPopupVisible(false);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-400";
      case "hard":
        return "bg-red-400";
      default:
        return "bg-gray-300";
    }
  };

  const filteredData = questions.filter((item) => {
    return (
      (difficultyFilter === "" || item.difficult === difficultyFilter) &&
      (setFilter === "" || item.set === setFilter) &&
      (typeFilter === "" || item.type === typeFilter)
    );
  });

  return (
    <div>
      <div className="flex flex-row w-full gap-10 p-5">
        <div
          className="flex flex-col w-1/4 gap-3 p-5 py-20 bg-white shadow-lg rounded-xl relative"
          onMouseEnter={() => setShowSetA(true)}
          onMouseLeave={() => setShowSetA(false)}
        >
          <h1 className="text-2xl font-bold text-center text-gray-600">
            No. Of Questions in Set-A
          </h1>
          <p className="mx-auto text-3xl font-bold text-gray-800">
            {questions.filter((item) => item.set === "A").length}
          </p>
          {showSetA && (
            <div className="absolute left-0 top-full mt-2 w-40 text-lg bg-white p-5 rounded-xl shadow-lg">
              <p className="text-green-600">
                Easy:{" "}
                {
                  questions.filter(
                    (item) => item.set === "A" && item.difficult === "easy"
                  ).length
                }
              </p>
              <p className="text-yellow-600">
                Medium:{" "}
                {
                  questions.filter(
                    (item) => item.set === "A" && item.difficult === "medium"
                  ).length
                }
              </p>
              <p className="text-red-600">
                Hard:{" "}
                {
                  questions.filter(
                    (item) => item.set === "A" && item.difficult === "hard"
                  ).length
                }
              </p>
            </div>
          )}
        </div>

        <div
          className="flex flex-col w-1/4 gap-3 p-5 py-20 bg-white shadow-lg rounded-xl relative"
          onMouseEnter={() => setShowSetB(true)}
          onMouseLeave={() => setShowSetB(false)}
        >
          <h1 className="text-2xl font-bold text-center text-gray-600">
            No. Of Questions in Set-B
          </h1>
          <p className="mx-auto text-3xl font-bold text-gray-800">
            {questions.filter((item) => item.set === "B").length}
          </p>
          {showSetB && (
            <div className="absolute left-0 top-full mt-2 w-40 text-lg bg-white p-5 rounded-xl shadow-lg">
              <p className="text-green-600">
                Easy:{" "}
                {
                  questions.filter(
                    (item) => item.set === "B" && item.difficult === "easy"
                  ).length
                }
              </p>
              <p className="text-yellow-600">
                Medium:{" "}
                {
                  questions.filter(
                    (item) => item.set === "B" && item.difficult === "medium"
                  ).length
                }
              </p>
              <p className="text-red-600">
                Hard:{" "}
                {
                  questions.filter(
                    (item) => item.set === "B" && item.difficult === "hard"
                  ).length
                }
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center w-1/4 gap-5 p-5 py-20 bg-white shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-center text-gray-600">
            Add New Question
          </h1>
          <CgAdd className="mx-auto text-2xl text-green-500" />
          <button
            onClick={() => setShowAddPopup(true)}
            className="w-1/2 h-10 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700"
          >
            Add
          </button>
          {showAddPopup && (
            <AddQuestion
              toggleQues={() => setShowAddPopup(false)}
              refreshQuestions={fetchAllQuestions}
            />
          )}
        </div>
      </div>

      <div className="p-5 h-[50vh] m-5 bg-white shadow-xl rounded-xl">
        
        <div className="flex gap-5 p-5">
          
          <select
            
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select
            value={setFilter}
            onChange={(e) => setSetFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Sets</option>
            <option value="A">Technical</option>
            <option value="B">Non-Technical</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="mcq">Multiple Choice</option>
            <option value="short">Short Answer</option>
            <option value="long">Long Answer</option>
            <option value="numerical">Numerical</option>
            <option value="multiple">Multiple Answer</option>
          </select>
        </div>

        <div className="h-[35vh] overflow-y-auto w-full p-5 rounded-lg">
          <table className="w-full text-center border-collapse table-auto rounded-xl">
            <thead>
              <tr className="bg-gray-200">
                <th>S.No</th>
                <th>Question</th>
                <th>Type</th>
                <th>Set</th>
                <th>Difficulty</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item._id ?? index}
                  className="text-xl bg-gray-100 hover:bg-gray-200"
                >
                  <td className="border">{index + 1}</td>
                  <td className="text-left border w-[40%]">
                    {item?.question}
                    {(typeof item?.question === "string" || item.question) &&
                      (typeof item.question === "string"
                        ? item.question
                        : item.question
                      ).split(" ").length > 30 &&
                      "..."}
                  </td>
                  <td className="border">{item.type}</td>
                  <td className="border">{item.set}</td>
                  <td>
                    <div
                      className={`mx-auto flex justify-center items-center rounded-lg w-24 h-8 ${getDifficultyBgColor(
                        item.difficult
                      )}`}
                    >
                      {item.difficult}
                    </div>
                  </td>
                  <td className="border">
                    <button
                      onClick={() => toggleEditQuestion(index)}
                      className="px-2 py-3 text-white bg-blue-600 rounded hover:bg-green-500"
                    >
                      Modify
                    </button>
                    {popupVisible && popupRowIndex === index && (
                      <div className="absolute right-0 bottom-5 z-50 w-[500px] bg-white rounded-lg shadow-lg p-2">
                        <div className="flex flex-col w-full p-2">
                          <label className="mb-2 font-bold text-gray-700">
                            Question
                          </label>
                          <input
                            type="text"
                            name="question"
                            value={editFormState.question}
                            onChange={handleEditFormChange}
                            className="w-full py-2 border border-gray-300 rounded-md"
                          />
                          <label className="mt-2 mb-2 f ont-bold text-gray-700">
                            Set
                          </label>
                          <select
                            name="set"
                            value={editFormState.set}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Set</option>
                            <option value="A">Technical</option>
                            <option value="B">Non-Technical</option>
                          </select>
                          <label className="mt-2 mb-2 font-bold text-gray-700">
                            Difficulty
                          </label>
                          <select
                            name="difficulty"
                            value={editFormState.difficulty}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                          <div className="flex flex-row w-full gap-5 mt-4">
                            <button
                              onClick={handleEditFormSubmit}
                              className="w-2/3 px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => setPopupVisible(false)}
                              className="w-1/3 px-4 py-2 font-bold text-white bg-red-300 rounded hover:bg-red-500"
                            >
                              Cancel
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="w-full px-4 py-2 mt-5 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllQuestion;
