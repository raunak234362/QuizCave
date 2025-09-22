/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnswerData,
  ContestData,
  RegistrationFormData,
  UserToken,
} from "../components/Interfaces/index";
import api from "./api";
const token = sessionStorage.getItem("token") || "";
console.log("Service Token:", token);
class Service {
  static createQuestion(payload: {
    set: string;
    difficult: string;
    question: string | undefined;
    mcqOptions: string[] | undefined;
    multipleQuestion: string[] | undefined;
    multipleAnswer: string[] | undefined;
    answer: string | undefined;
    questionImage: string | undefined;
  }) {
    throw new Error("Method not implemented.");
  }
  static async fetchUserData() {
    try {
      const response = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch user data: " + error.message);
      } else {
        throw new Error("Failed to fetch user data");
      }
    }
  }
  static async fetchContestData() {
    try {
      const response = await api.get("/admin/contest/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch contest data: " + error.message);
      } else {
        throw new Error("Failed to fetch contest data");
      }
    }
  }
  static async fetchContestDetails({ id }: { id: string }) {
    try {
      const response = await api.get(`/admin/contest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch contest details: " + error.message);
      } else {
        throw new Error("Failed to fetch contest details");
      }
    }
  }

  static async fetchAllQuestions() {
    try {
      const response = await api.get(`/admin/question/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch contest details: " + error.message);
      } else {
        throw new Error("Failed to fetch contest details");
      }
    }
  }
  static async fetchResult() {
    try {
      const response = await api.get(`admin/result/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Contest Result Response:", response.data);
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch contest questions: " + error.message);
      } else {
        throw new Error("Failed to fetch contest questions");
      }
    }
  }
  static async declareResult({ id }: { id: string }) {
    try {
      const response = await api.get(`/admin/result/${id}/declare`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Result Details Response:", response.data);
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch result details: " + error.message);
      } else {
        throw new Error("Failed to fetch result details");
      }
    }
  }
  static async fetchResultDetails({ id }: { id: string }) {
    try {
      const response = await api.get(`/admin/result/results/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Result Details Response:", response.data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to fetch result details: " + error.message);
      } else {
        throw new Error("Failed to fetch result details");
      }
    }
  }

  static async UpdateQuestionById({
    questionId,
    updatedData,
  }: {
    questionId: string;
    updatedData: { question: string; set: string; difficult: string };
  }) {
    console.log("Service - UpdateQuestionById called with:", {
      questionId,
      updatedData,
    });
    try {
      const response = await api.put(
        `/admin/question/update/${questionId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to update question by id: " + error.message);
      } else {
        throw new Error("Failed to update question by id");
      }
    }
  }
  static async createQuestions(data: any) {  
    try {
      const response = await api.post("/admin/question/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to create question: " + error.message);
      } else {
        throw new Error("Failed to create question");
      }
    }
  }

  static async deleteQuestionById({ questionId }: { questionId: string }) {
    console.log("Service - deleteQuestionById called with:", {
      questionId,
    });
    try {
      const response = await api.delete(
        `/admin/question/remove/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to delete question by id: " + error.message);
      } else {
        throw new Error("Failed to delete question by id");
      }
    }
  }

  

  static async AddStudentForm(data: RegistrationFormData) {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        const value = (data as any)[key];

        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      const response = await api.post("/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Add Student Form Response:", response);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to add student form: " + error.message);
      } else {
        throw new Error("Failed to add student form");
      }
    }
  }
  static async getAllStudentContestData() {
    try {
      const response = await api.get("/contest/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Failed to fetch student contest data: " + error.message
        );
      } else {
        throw new Error("Failed to fetch student contest data");
      }
    }
  }
  static async getStudentContestDetails({ id }: { id: string }) {
    try {
      const response = await api.get(`/contest/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Failed to fetch student contest details: " + error.message
        );
      } else {
        throw new Error("Failed to fetch student contest details");
      }
    }
  }
  static async studentContestAttempt({ id }: { id: ContestData["_id"] }) {
    try {
      const response = await api.post(`/contest/attempt/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Failed to fetch student contest result: " + error.message
        );
      }
    }
  }
  static async studentContestResultAll() {
    try {
      const response = await api.get("/result/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Failed to fetch student contest results: " + error.message
        );
      } else {
        throw new Error("Failed to fetch student contest results");
      }
    }
  }
  static async studentContestResultDetails({ id }: { id: string }) {
    try {
      const response = await api.get(`/result/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          "Failed to fetch student contest result details: " + error.message
        );
      } else {
        throw new Error("Failed to fetch student contest result details");
      }
    }
  }
  static async studentContestSubmit({
    id,
    answers,
  }: {
    id: string;
    answers: any;
  }) {
    try {
      const response = await api.post(`/result/submit/${id}`, answers, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to submit student contest: " + error.message);
      } else {
        throw new Error("Failed to submit student contest");
      }
    }
  }

  static async AddAnswerById({
    resultId,
    submitData,
  }: {
    resultId: string;
    submitData: AnswerData;
  }) {
    console.log("Service - AddAnswerById called with:", {
      resultId,
      submitData,
    });
    try {
      const response = await api.post(
        `/result/add-answer/${resultId}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to add answer by id: " + error.message);
      } else {
        throw new Error("Failed to add answer by id");
      }
    }
  }

  static async finalSubmitAnswers({
    resultId,
  }: {
    resultId: string | null | undefined;
  }) {
    try {
      const response = await api.post(
        `/result/submit/${resultId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Final submit response:", response.data);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to submit final answers: " + error.message);
      } else {
        throw new Error("Failed to submit final answers");
      }
    }
  }
} 
export default Service;
