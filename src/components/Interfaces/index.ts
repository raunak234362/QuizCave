/* eslint-disable @typescript-eslint/no-explicit-any */
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
  profilePic: string | File;
  marksheet: string[];
  gender?: string;
  studentId?: string;
  branch?: string;
  course?: string;
  passingYear?: string;
  cgpa?: string | number;
  resume?: string;
  dob?: string;
  altPhone?: string;
  fatherName?: string;
  motherName?: string;
  currentSemester?: string;
  backlog?: string | number;
  currAddress?: any;
  permAddress?: any;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ContestData {
  questions: any;
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
  resgistration?: boolean;
  attempted?: boolean;
}
export interface ContestDataForm {
  title: string;
  set: string;
  instructions: string;
  duration: string;
  startDate: string;
  endDate: string;
  contestId: string;
  active?: boolean;
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

export interface RegistrationFormData {
  profile: File | string | null;
  resume: File | string | null;
  marksheet: File | string | string[] | null;
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
  cgpa: string | number; // Changed to string to match form input
  passingYear: string; // Changed to string to match form input
  backlog: string | number; // Changed to string to match form input
  permAddress: Address; // JSON string
  currAddress: Address; // JSON string
}

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
  set: string;
}

export interface Question {
  question: any;
  type: "mcq" | "descriptive" | "multiple" | string;
  set: string;
  difficult: string;
  name?: string;
  _id?: string;
  answer?: string[];
  questionId: {
    split(arg0: string): unknown;
    question?: string | any;
    mcqOptions?: string[];
    multipleQuestion?: string[];
    questionImage?: string | File;
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
