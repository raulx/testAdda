/* eslint-disable @typescript-eslint/no-explicit-any */
interface UserData {
  _id: string;
  email: string;
  username: string;
  avatar_url: string;
  is_subscribed: boolean;
  test_attempted: { id: string; attempted_on: string }[];
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

interface TestQuestionsType {
  options: { a: string; b: string; c: string; d: string };
  question: string;
  subject: "english" | "mathematics" | "reasoning";
  _id: string | any;
}

interface TestData<T> {
  _id: string;
  title: string;
  description: string;
  questions: T[];
  duration: number;
  access_type: "free" | "paid";
  number_of_questions: number;
  difficulty_level: string;
}

type TestResponseType = TestData<TestQuestionsType>[];
type TestsResponseType = TestData<string>[];

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
  TestResponseType,
  TestsResponseType,
  TestData,
  TestQuestionsType,
};
