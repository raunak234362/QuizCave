/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AnswerData,
  ContestData,
  registrationFormData,
  UserToken,
} from "../components/Interfaces/index";
import api from "./api";

class Service {
  static async fetchUserData({ token }: UserToken) {
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
  static async fetchContestData({ token }: UserToken) {
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
  static async fetchContestDetails({
    id,
    token,
  }: {
    id: string;
    token: UserToken;
  }) {
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
  static async fetchResult({ token }: { token: UserToken }) {
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
  static async declareResult({ id, token }: { id: string; token: UserToken }) {
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
  static async fetchResultDetails({
    id,
    token,
  }: {
    id: string;
    token: UserToken;
  }) {
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
  static async AddStudentForm({
    data,
    token,
  }: {
    data: registrationFormData;
    token: UserToken;
  }) {
    try {
      const response = await api.post("/user/register", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Add Student Form Response:", response.data);
      return response.data;
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Failed to add student form: " + error.message);
      } else {
        throw new Error("Failed to add student form");
      }
    }
  }
  static async getAllStudentContestData({ token }: UserToken) {
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
  static async getStudentContestDetails({
    id,
    token,
  }: {
    id: string;
    token: UserToken;
  }) {
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
  static async studentContestAttempt({
    id,
    token,
  }: {
    id: ContestData["_id"];
    token: UserToken;
  }) {
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
  static async studentContestResultAll({ token }: UserToken) {
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
  static async studentContestResultDetails({
    id,
    token,
  }: {
    id: string;
    token: UserToken;
  }) {
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
    token,
    answers,
  }: {
    id: string;
    token: UserToken;
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
    token,
  }: {
    resultId: string;
    submitData: AnswerData;
    token: UserToken;
  }) {
    console.log("Service - AddAnswerById called with:", {
      resultId,
      token,
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
    token,
  }: {
    resultId: string | null | undefined;
    token: UserToken;
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
  // stattic async getAllResults({ token }: UserToken) {
  //   try {
  //     const response = await api.get("/result/all", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new Error("Failed to fetch all results: " + error.message);
  //     } else {
  //       throw new Error("Failed to fetch all results");
  //     }

  //   }
  // }
  // sta
}
export default Service;
