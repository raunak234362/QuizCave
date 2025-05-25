import type { UserToken } from "../components/Interfaces";
import api from "./api";

class Service {

    static async fetchUserData({token}:UserToken){
        try {
            const response = await api.get("/admin/user", {
                headers:{
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
}
export default Service;