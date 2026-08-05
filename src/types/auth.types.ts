export interface User {
  id: string;
  email: string;
  auth_provider: "email" | "google";
  is_locked: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  photo_url?: string;
  blood_group?: string;
  phone?: string;
  city?: string;
  occupation?: string;
  marital_status?: string;
  nationality?: string;
  bio?: string;
  languages?: string;
  education?: string;
  is_deceased: boolean;
  social_links?: Record<string, string>;
  updated_at: string;
}

export interface TokenPair {
  token: string;
  expires_at: number;
}

export interface AuthResponse {
  token: string;
  expires_at: number;
  user_id: string;
  email: string;
  email_verified: boolean;
  has_profile: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CompleteProfileRequest {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
}

export interface VerifyEmailRequest {
  user_id: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}