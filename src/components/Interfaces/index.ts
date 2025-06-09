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
  college?: string;
  role: "admin" | "user" | string; // you can extend with more roles if needed
  designation: string;
  profilePic: string;
  marksheet: [];
}

export interface ContestData {
  _id: UserData;
  name: string;
  description: string;
  duration: string;
  startDate: string;
  declared: boolean;
  endDate: string;
  set: string;
  status: "active" | "inactive" | "completed";
  createdBy: string;
  createdAt: string;
}

export interface ContestResultData {
  _id: string;
  name: string;
  set: string;
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  active: boolean;
  registration: boolean;
  declared: boolean;
  createdBy: string; // user ID
  participants: string[]; // array of user IDs
  unEvaluated: number;
}

export interface ResultCardProps {
  item: {
    _id: string;
    name: string;
    set: string;
    startDate: string;
    endDate: string;
    active: boolean;
    registration: boolean;
    declared: boolean;
    createdBy: string;
    participants: string[];
    unEvaluated: number;
  };
}

export interface ResultDetails {
  _id: UserData;
  contestId: string;
  declared: boolean;
  sumbittedOn: string; // ISO Date string
  timeTaken: number; // in milliseconds
  totalMarks: number;
  answers: [];
  userId: UserData;
  __v?: number;
}

export interface Address {
  streetLine1: string;
  streetLine2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

// Define interface for form data
export interface registrationFormData {
  profilePic: string | File;
  resume: string | File;
  marksheet: string | File;
  name: string;
  email: string;
  phone: string;
  altPhone: string;
  password: string;
  dob: string;
  studentId: string;
  gender: string;
  fatherName: string;
  motherName: string;
  currentSemester: string;
  branch: string;
  course: string;
  college: string;
  cgpa: string;
  passingYear: string;
  backlog: string;
  permAddress: Address;
  currAddress: Address;
}

// interface Question {
//   _id?: string;
//   answer?: string[];
//   questionId: {
//     question?: string;
//     mcqOptions?: string[];
//     multipleQuestion?: string[];
//     questionImage?: string;
//     answer?: string;
//     multipleAnswer?: string[];
//     difficult?: "easy" | "medium" | "hard" | string;
//   };
// }

// interface PdfCreatorProps {
//   question?: Question[];
//   username?: string;
//   marks?: number;
// }
