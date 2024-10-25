interface ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export default ApiResponse;
