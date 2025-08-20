import type { registrationFormData, UserToken } from "../components/Interfaces";
import api from "./api";

class Service {

    static async fetchUserData({ token }: UserToken) {
        try {
            const response = await api.get("/admin/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
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
                }
            })
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
    static async fetchContestDetails({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.get(`/admin/contest/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
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
    static async fetchResult({ token }: { token: string }) {
        try {
            const response = await api.get(`admin/result/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
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
    static async declareResult({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.get(`/admin/result/${id}/declare`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
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
    static async fetchResultDetails({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.get(`/admin/result/results/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
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
    static async AddStudentForm({ formDataToSend }: { formDataToSend: registrationFormData }) {
        try {
            const response = await api.post("/user/register", formDataToSend, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to add student form: " + error.message);
            } else {
                throw new Error("Failed to add student form");
            }
        }

    }
    static async studentContestData({ token }: UserToken) {
        try {
            const response = await api.get("api/v1/contest/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to fetch student contest data: " + error.message);
            } else {
                throw new Error("Failed to fetch student contest data");
            }
        }
    }
    static async studentContestDetails({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.get(`api/v1/contest/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to fetch student contest details: " + error.message);
            } else {
                throw new Error("Failed to fetch student contest details");
            }
        }
    }
    static async studentContestAttempt({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.post(`api/v1/contest/attempt/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to fetch student contest result: " + error.message);
            }
        }
    }
    static async studentContestResultAll({ token }: UserToken) {
        try {
            const response = await api.get("api/v1/result/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to fetch student contest results: " + error.message);
            } else {
                throw new Error("Failed to fetch student contest results");
            }
        }
    }
    static async studentContestResultDetails({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.get(`api/v1/result/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });
            return response.data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to fetch student contest result details: " + error.message);
            } else {
                throw new Error("Failed to fetch student contest result details");
            }
        }
    }
    static async studentContestSubmit({ id, token }: { id: string, token: string }) {
        try {
            const response = await api.post(`api/v1/contest/submit/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
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
    
}
export default Service;