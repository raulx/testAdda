/* eslint-disable @typescript-eslint/no-explicit-any */
interface UserData {
  _id: string;
  email: string;
  username: string;
  avatar_url: string;
  is_subscribed: boolean;
  test_attempted: string[];
  paused_tests: string[];
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
  _id: string | any;
}

interface QuizData<T> {
  _id: string;
  title: string;
  description: string;
  questions: T[];
  duration: number;
  access_type: "free" | "paid";
  number_of_questions: number;
  difficulty_level: string;
}

type QuizResponseType = QuizData<QuizQuestionsType>[];
type QuizesResponseType = QuizData<string>[];

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
  QuizesResponseType,
  QuizData,
  QuizQuestionsType,
};
