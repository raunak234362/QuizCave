/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { ContestData, Question } from "../../Interfaces/index";
import Service from "../../../config/Service";

interface AddQuestionProps {
  toggleQues: (open: boolean) => void;
  refreshQuestions?: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({
  toggleQues,
  refreshQuestions,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
const [contest, setContest] = useState<any[]>([]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        type: "",
        set: "",
        difficult: "",
        name: "",
        questionId: {
          question: "",
          mcqOptions: [],
          multipleQuestion: [],
          multipleAnswer: [],
          questionImage: "",
          answer: "",
        },
      } as unknown as Question,
    ]);
  };



    const fetchContestData = async () => {
      const response = await Service.fetchContestData();
      const normalized = response?.map((item: ContestData) => ({
        ...item,
        id: item._id,
      }));
      setContest(normalized);
      console.log(normalized);
    };
    useEffect(() => {
      fetchContestData();
    }, []);
  


  const handleQuestionChange = (
    index: number,
    field:
      | keyof Question["questionId"]
      | "set"
      | "difficult"
      | "type"
      | "name",
    value: string | string[] | File
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (
        field === "set" ||
        field === "difficult" ||
        field === "type" ||
        field === "name"
      ) {
        updated[index] = {
          ...updated[index],
          [field]: value as string,
        };
      } else {
        updated[index] = {
          ...updated[index],
          questionId: {
            ...updated[index].questionId,
            [field]: value,
          },
        };
      }
      return updated;
    });
  };



  const handleAddOption = (questionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const mcqOptions = updated[questionIndex].questionId.mcqOptions || [];
      updated[questionIndex] = {
        ...updated[questionIndex],
        questionId: {
          ...updated[questionIndex].questionId,
          mcqOptions: [...mcqOptions, ""],
        },
      };
      return updated;
    });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const mcqOptions = updated[questionIndex].questionId.mcqOptions || [];
      mcqOptions[optionIndex] = value;
      updated[questionIndex] = {
        ...updated[questionIndex],
        questionId: {
          ...updated[questionIndex].questionId,
          mcqOptions: mcqOptions,
        },
      };
      return updated;
    });
  };

  const handleAddSubQuestion = (questionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const multipleQuestion =
        updated[questionIndex].questionId?.multipleQuestion || [];
      const multipleAnswer =
        updated[questionIndex].questionId?.multipleAnswer || [];
      updated[questionIndex] = {
        ...updated[questionIndex],
        questionId: {
          ...updated[questionIndex].questionId,
          multipleQuestion: [...multipleQuestion, ""],
          multipleAnswer: [...multipleAnswer, ""],
        },
      };
      return updated;
    });
  };

  const handleSubQuestionChange = (
    questionIndex: number,
    subIndex: number,
    field: "question" | "answer",
    value: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (field === "question") {
        const multipleQuestion =
          updated[questionIndex].questionId.multipleQuestion || [];
        multipleQuestion[subIndex] = value;
        updated[questionIndex] = {
          ...updated[questionIndex],
          questionId: {
            ...updated[questionIndex].questionId,
            multipleQuestion: multipleQuestion,
          },
        };
      } else if (field === "answer") {
        const multipleAnswer =
          updated[questionIndex].questionId?.multipleAnswer || [];
        multipleAnswer[subIndex] = value;
        updated[questionIndex] = {
          ...updated[questionIndex],
          questionId: {
            ...updated[questionIndex].questionId,
            multipleAnswer: multipleAnswer,
          },
        };
      }
      return updated;
    });
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Store the File object directly in state
    handleQuestionChange(index, "questionImage", file);
  };

 const handleSubmitForm = async (e: FormEvent) => {
   e.preventDefault();
   try {
     for (const question of questions) {
       await Service.createQuestions({
         contestId: question.name,
         set: question.set,
         difficult: question.difficult,
         question: question.questionId.question,
         mcqOptions: question.questionId.mcqOptions,
         type: question.type,
         multipleQuestion: question.questionId.multipleQuestion,
         multipleAnswer: question.questionId.multipleAnswer,
         answer: question.questionId.answer,
         questionImage:
           question.questionId.questionImage instanceof File
             ? ""
             : question.questionId.questionImage,
       });
     }
     alert(`Successfully added ${questions.length} questions`);
     toggleQues(false);
     refreshQuestions?.();
   } catch (error) {
     console.error("Error submitting questions:", error);
     alert("Failed to add questions. Please try again.");
   }
 };

  return (
    <div className="absolute z-20 top-0 left-0 w-full h-full overflow-y-auto bg-gray-900 bg-opacity-20 flex items-center justify-center">
      <div className="bg-white w-[70%] h-screen overflow-y-auto mt-4 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Add Questions</h1>
        <form onSubmit={handleSubmitForm} className="mt-5">
          {questions.map((q, index) => (
            <div key={index} className="mb-6 bg-slate-200 p-5 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Question {index + 1}
              </h2>

              {/* Type */}
              <label className="block mb-2 font-semibold">Type:</label>
              <select
                value={q.type}
                onChange={(e) =>
                  handleQuestionChange(index, "type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              >
                <option value="">Select Type</option>
                <option value="mcq">MCQ</option>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
                <option value="numerical">Numerical</option>
                <option value="multiple">Multiple Answers</option>
              </select>

              {/* Contest Title */}
              <label className="block mb-2 font-semibold">Contest:</label>
              <select
                value={q.name}
                onChange={(e) =>
                  handleQuestionChange(index, "name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                required
              >
                <option value="">Select Contest</option>
                {contest.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>

              {/* Set */}
              <label className="block mb-2 font-semibold">Set:</label>
              <select
                value={q.set}
                onChange={(e) =>
                  handleQuestionChange(index, "set", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              >
                <option value="">Select Set</option>
                <option value="A">Technical</option>
                <option value="B">Non-Technical</option>
              </select>

              {/* Difficulty */}
              <label className="block mb-2 font-semibold">Difficulty:</label>
              <select
                value={q.difficult}
                onChange={(e) =>
                  handleQuestionChange(index, "difficult", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Moderate</option>
                <option value="hard">Hard</option>
              </select>

              {/* Question Text */}
              <label className="block mb-2 font-semibold">Question:</label>
              <input
                type="text"
                value={q.questionId.question || ""}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                required
              />

              {/* Image Upload */}
              <label className="block mb-2 font-semibold">Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {q.question?.questionImage instanceof File && (
                <img
                  src={URL.createObjectURL(q.question.questionImage)}
                  alt="Uploaded"
                  className="mt-2 max-w-full h-auto rounded"
                />
              )}

              {/* Conditional Fields based on Type */}
              {(q.type === "short" ||
                q.type === "long" ||
                q.type === "numerical") && (
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">Answer:</label>
                  <input
                    type="text"
                    value={q.questionId?.answer || ""}
                    onChange={(e) =>
                      handleQuestionChange(index, "answer", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}

              {q.type === "mcq" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">Options:</label>
                    {q.questionId.mcqOptions?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder={`Option ${optionIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(index)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Add Option
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2 font-semibold">
                      Correct Answer:
                    </label>
                    <input
                      type="text"
                      value={q.questionId.answer || ""}
                      onChange={(e) =>
                        handleQuestionChange(index, "answer", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </>
              )}

              {q.type === "multiple" && (
                <div className="mb-4">
                  <label className="block mb-2 font-semibold">
                    Sub-Questions:
                  </label>
                  {q.questionId.multipleQuestion?.map((subQ, subIndex) => (
                    <div
                      key={subIndex}
                      className="flex flex-col mb-4 p-2 border border-gray-400 rounded-md"
                    >
                      <input
                        type="text"
                        value={subQ || ""}
                        onChange={(e) =>
                          handleSubQuestionChange(
                            index,
                            subIndex,
                            "question",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={`Sub-Question ${subIndex + 1}`}
                        required
                      />
                      <input
                        type="text"
                        value={q.questionId?.multipleAnswer?.[subIndex] || ""}
                        onChange={(e) =>
                          handleSubQuestionChange(
                            index,
                            subIndex,
                            "answer",
                            e.target.value
                          )
                        }
                        className="w-full px-3 mt-4 py-2 border border-gray-300 rounded-md"
                        placeholder={`Answer for Sub-Question ${subIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSubQuestion(index)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Add Sub-Question
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => toggleQues(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
