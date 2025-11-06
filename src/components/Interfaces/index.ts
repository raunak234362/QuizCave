export interface UserResponse {
  name: string;
  email: string;
  phone: string;
  userId: string;
  role: "admin" | "user" | string; 
  designation: string;
  profile: string | File;
  accessToken: string;
  refreshToken: string;
}

export interface UserRequestApi {
  userId: string;
  password: string;
  role: "admin" | "user" | string;
}

export interface UserToken {
  token?: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
  college?: string;
  role: "admin" | "user" | string;
  designation: string;
  profile: string | File;
  marksheet: [];
}

export interface ContestData {
  _id: string;
  name: string;
  description: string;
  duration: string;
  startDate: string;
  declared: boolean;
  endDate: string;
  registration?: boolean;
  active?: boolean;
  participants: string[];

  set: string;
  status: "active" | "inactive" | "completed";
  createdBy: string;
  createdAt: string;
  rules: string;
  passingScore: number;
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
  token: UserToken;
  _id: string;
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
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

// Define interface for form data
// export interface RegistrationFormData {
//   profile: string | File;
//   resume: string | File;
//   marksheet: string | File;
//   name: string;
//   email: string;
//   phone: string;
//   altPhone: string;
//   password: string;
//   dob: Date;
//   studentId: string;
//   gender: string;
//   fatherName: string;
//   motherName: string;
//   currentSemester: number;
//   branch: string;
//   course: string; 
//   college: string;
//   cgpa: number;
//   passingYear: number;
//   backlog: number;
//   permAddress: Address;
//   currAddress: Address;
// }

// // Utility function to convert FormData to RegistrationFormData
// export function formDataToRegistrationFormData(formData: FormData): RegistrationFormData {
//   return {
//     profile: formData.get("profilePic") as string | File,
//     resume: formData.get("resume") as string | File,
//     marksheet: formData.get("marksheet") as string | File,
//     name: formData.get("name") as string,
//     email: formData.get("email") as string,
//     phone: formData.get("phone") as string,
//     altPhone: formData.get("altPhone") as string,
//     password: formData.get("password") as string,
//     dob: new Date(formData.get("dob") as string),
//     studentId: formData.get("studentId") as string,
//     gender: formData.get("gender") as string,
//     fatherName: formData.get("fatherName") as string,
//     motherName: formData.get("motherName") as string,
//     currentSemester: Number(formData.get("currentSemester") ?? 0),
//     branch: formData.get("branch") as string,
//     course: formData.get("course") as string,
//     college: formData.get("college") as string,
//     cgpa: Number(formData.get("cgpa")),
//     passingYear: Number(formData.get("passingYear")),
//     backlog: Number(formData.get("backlog")),
//     permAddress: JSON.parse(formData.get("permAddress") as string),
//     currAddress: JSON.parse(formData.get("currAddress") as string),
//   };
// }

// // Helper to wrap registrationFormData in an object with 'data' property
// // export function wrapRegistrationFormData(formData: FormData): { data: registrationFormData } {
// //   return { data: formDataToRegistrationFormData(formData) };
// // }



// Interfaces.ts
export interface RegistrationFormData {
  profile: File | null;
  resume: File | null;
  marksheet: File | null;
  name: string;
  email: string;
  phone: string;
  altPhone?: string;
  password: string;
  dob: string; // Changed to string to match form input
  studentId: string;
  gender: string;
  fatherName: string;
  motherName: string;
  currentSemester: string; // Changed to string to match select input
  branch: string;
  course: string;
  college: string;
  cgpa: string; // Changed to string to match form input
  passingYear: string; // Changed to string to match form input
  backlog: string; // Changed to string to match form input
  permAddress: Address; // JSON string
  currAddress: Address; // JSON string
}

// Utility function to convert FormData to RegistrationFormData
// export function formDataToRegistrationFormData(formData: FormData): RegistrationFormData {
//   return {
//     profile: formData.get("profilePic") as File | null,
//     resume: formData.get("resume") as File | null,
//     marksheet: formData.get("marksheet") as File | null,
//     name: formData.get("name") as string,
//     email: formData.get("email") as string,
//     phone: formData.get("phone") as string,
//     altPhone: formData.get("altPhone") as string | undefined,
//     password: formData.get("password") as string,
//     dob: formData.get("dob") as string,
//     studentId: formData.get("studentId") as string,
//     gender: formData.get("gender") as string,
//     fatherName: formData.get("fatherName") as string,
//     motherName: formData.get("motherName") as string,
//     currentSemester: formData.get("currentSemester") as string,
//     branch: formData.get("branch") as string,
//     course: formData.get("course") as string,
//     college: formData.get("college") as string,
//     cgpa: formData.get("cgpa") as string,
//     passingYear: formData.get("passingYear") as string,
//     backlog: formData.get("backlog") as string,
//     permAddress: JSON.parse(formData.get("permAddress") as string),
//     currAddress: JSON.parse(formData.get("currAddress") as string),
//   };
// }

export interface Address {
  streetLine1?: string;
  streetLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}



export interface QuestionData {
  _id: string;
  question: string;
  mcqOptions: string[];
  multipleQuestion: string[];
  difficult: "easy" | "medium" | "hard" | string;
  type: "mcq" | string;
}

export interface Question {
  _id?: string;
  answer?: string[];
  questionId: {
    question?: string;
    mcqOptions?: string[];
    multipleQuestion?: string[];
    questionImage?: string;
    answer?: string;
    multipleAnswer?: string[];
    difficult?: "easy" | "medium" | "hard" | string;
  };
}

export interface AnswerData {
  resultId?: string;
  question: string;
  answer: string[];
}

// interface PdfCreatorProps {
//   question?: Question[];
//   username?: string;
//   marks?: number;
// }
