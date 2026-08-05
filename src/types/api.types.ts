export interface ApiError {
  error: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}