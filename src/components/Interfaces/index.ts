export interface UserResponse {
  name: string;
  email: string;
  phone: string;
  userId: string;
  role: "admin" | "user" | string; // you can extend with more roles if needed
  designation: string;
  profilePic: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserRequestApi {
  userId: string;
  password: string;
}

export interface UserToken {
  token: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  userId: string;
  role: "admin" | "user" | string; // you can extend with more roles if needed
  designation: string;
  profilePic: string;
  marksheet: [];
}

export interface ContestData {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  declared: boolean;
  endDate: string;
  set: string;
  status: "active" | "inactive" | "completed";
  createdBy: string;
  createdAt: string;
}
