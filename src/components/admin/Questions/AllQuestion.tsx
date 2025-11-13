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
    if (!questionToUpdate || !questionToUpdate._id) return;

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
    if (!questionToDelete || !questionToDelete._id) return;

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
        return "bg-teal-200 text-teal-900";
      case "medium":
        return "bg-teal-400 text-white";
      case "hard":
        return "bg-teal-600 text-white";
      default:
        return "bg-gray-200 text-gray-700";
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
    <div className="p-8 min-h-screen bg-gradient-to-br from-teal-50 to-white">
      {/* Top Summary Cards */}
      <div className="flex gap-8 mb-10">
        {/* Set A */}
        <div
          className="relative w-1/3 bg-white/80 backdrop-blur-lg border border-teal-100 shadow-md rounded-2xl p-6 transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setShowSetA(true)}
          onMouseLeave={() => setShowSetA(false)}
        >
          <h1 className="text-xl font-semibold text-teal-700 text-center mb-2">
            Set A (Technical)
          </h1>
          <p className="text-4xl font-bold text-center text-gray-800">
            {questions.filter((item) => item.set === "A").length}
          </p>
          {showSetA && (
            <div className="absolute left-0 top-full mt-3 w-48 bg-white border border-teal-100 rounded-xl shadow-lg p-4 text-gray-700 text-sm">
              <p className="text-teal-700 font-medium">
                Easy:{" "}
                {
                  questions.filter(
                    (item) => item.set === "A" && item.difficult === "easy"
                  ).length
                }
              </p>
              <p className="text-teal-600 font-medium">
                Medium:{" "}
                {
                  questions.filter(
                    (item) => item.set === "A" && item.difficult === "medium"
                  ).length
                }
              </p>
              <p className="text-teal-800 font-medium">
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

        {/* Set B */}
        <div
          className="relative w-1/3 bg-white/80 backdrop-blur-lg border border-teal-100 shadow-md rounded-2xl p-6 transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setShowSetB(true)}
          onMouseLeave={() => setShowSetB(false)}
        >
          <h1 className="text-xl font-semibold text-teal-700 text-center mb-2">
            Set B (Non-Technical)
          </h1>
          <p className="text-4xl font-bold text-center text-gray-800">
            {questions.filter((item) => item.set === "B").length}
          </p>
          {showSetB && (
            <div className="absolute left-0 top-full mt-3 w-48 bg-white border border-teal-100 rounded-xl shadow-lg p-4 text-gray-700 text-sm">
              <p className="text-teal-700 font-medium">
                Easy:{" "}
                {
                  questions.filter(
                    (item) => item.set === "B" && item.difficult === "easy"
                  ).length
                }
              </p>
              <p className="text-teal-600 font-medium">
                Medium:{" "}
                {
                  questions.filter(
                    (item) => item.set === "B" && item.difficult === "medium"
                  ).length
                }
              </p>
              <p className="text-teal-800 font-medium">
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

        {/* Add Question */}
        <div className="w-1/3 bg-teal-600 text-white rounded-2xl p-8 shadow-md hover:shadow-lg flex flex-col items-center justify-center transition-all">
          <CgAdd className="text-4xl mb-3" />
          <h1 className="text-xl font-semibold mb-3">Add New Question</h1>
          <button
            onClick={() => setShowAddPopup(true)}
            className="bg-white text-teal-700 font-semibold px-6 py-2 rounded-lg hover:bg-teal-100 transition-all"
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

      {/* Filters */}
      <div className="flex gap-6 bg-white/80 backdrop-blur-lg p-4 rounded-xl border border-teal-100 mb-6 shadow-md">
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="p-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={setFilter}
          onChange={(e) => setSetFilter(e.target.value)}
          className="p-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">All Sets</option>
          <option value="A">Technical</option>
          <option value="B">Non-Technical</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">All Types</option>
          <option value="mcq">Multiple Choice</option>
          <option value="short">Short Answer</option>
          <option value="long">Long Answer</option>
          <option value="numerical">Numerical</option>
          <option value="multiple">Multiple Answer</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-lg border border-teal-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Question</th>
                <th className="p-4">Type</th>
                <th className="p-4">Set</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item._id ?? index}
                  className={`transition-all hover:bg-teal-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-teal-50/40"
                  }`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 text-gray-700">{item?.question}</td>
                  <td className="p-4 capitalize text-gray-700">{item.type}</td>
                  <td className="p-4 text-gray-700">{item.set}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${getDifficultyBgColor(
                        item.difficult
                      )}`}
                    >
                      {item.difficult}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleEditQuestion(index)}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg font-semibold"
                    >
                      Modify
                    </button>

                    {popupVisible && popupRowIndex === index && (
                      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-[450px] border border-teal-100">
                          <h3 className="text-2xl font-bold text-teal-700 mb-4">
                            Edit Question
                          </h3>

                          <label className="block text-gray-700 font-semibold mb-2">
                            Question
                          </label>
                          <input
                            type="text"
                            name="question"
                            value={editFormState.question}
                            onChange={handleEditFormChange}
                            className="w-full border border-teal-200 rounded-lg p-2 mb-4"
                          />

                          <label className="block text-gray-700 font-semibold mb-2">
                            Set
                          </label>
                          <select
                            name="set"
                            value={editFormState.set}
                            onChange={handleEditFormChange}
                            className="w-full border border-teal-200 rounded-lg p-2 mb-4"
                          >
                            <option value="">Select Set</option>
                            <option value="A">Technical</option>
                            <option value="B">Non-Technical</option>
                          </select>

                          <label className="block text-gray-700 font-semibold mb-2">
                            Difficulty
                          </label>
                          <select
                            name="difficulty"
                            value={editFormState.difficulty}
                            onChange={handleEditFormChange}
                            className="w-full border border-teal-200 rounded-lg p-2 mb-6"
                          >
                            <option value="">Select Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>

                          <div className="flex gap-4">
                            <button
                              onClick={handleEditFormSubmit}
                              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-bold"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => setPopupVisible(false)}
                              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-bold"
                            >
                              Cancel
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold mt-4"
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
