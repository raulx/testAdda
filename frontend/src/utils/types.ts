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

interface QuizQuestionsType {
  options: { a: string; b: string; c: string; d: string };
  question: string;
  subject: "english" | "mathematics" | "reasoning";
  _id: string;
}

interface QuizData {
  _id: string;
  title: string;
  description: string;
  questions: string | QuizQuestionsType[];
  duration: number;
  access_type: "free" | "paid";
  number_of_questions?: number;
  difficulty_level: string;
}

type QuizResponseType = QuizData[];

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
  QuizResponseType,
  QuizData,
};
