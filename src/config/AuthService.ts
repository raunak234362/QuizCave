import api from "./api";

import type { UserResponse, UserRequestApi } from "../components/Interfaces";

class AuthService {
  static async login({
    userId,
    password,
  }: UserRequestApi): Promise<UserResponse> {
    try {
      console.log("Logging in with:", { userId, password });
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", password);

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      console.log("Config:", api);
      const endpoint = "/user/login"; 

      const response = await api.post(endpoint, formData.toString(), config);

      if (response.status === 200) {
        const { token } = response.data;
        sessionStorage.setItem("token", token);
        return response.data.data;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error("Login failed: " + error.message);
      } else {
        throw new Error("Login failed");
      }
    }
  }

  static logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  }
}

export default AuthService;
