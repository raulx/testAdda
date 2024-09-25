interface UserData {
  _id: string;
  email: string;
  username: string;
  avatar_url: string;
  is_subscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserLoginResponseType {
  _id: string;
  email: string;
  username: string;
  avatar_url: string;
}

type QuizesResponseType = {
  _id: string;
  title: string;
  description: string;
  questions: string[];
  duration: number;
  access_type: "free" | "paid";
  number_of_questions: number;
  difficulty_level: string;
}[];

interface ApiResponseType<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export type {
  ApiResponseType,
  UserData,
  UserLoginResponseType,
  QuizesResponseType,
};
