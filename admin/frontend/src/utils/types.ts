interface ApiResponseType<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export default ApiResponseType;
