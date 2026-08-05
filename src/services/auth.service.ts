import api from "./api";
import { storage } from "../utils/storage";
import { ENDPOINTS } from "../constants";
import type {
  AuthResponse,
  SignupRequest,
  LoginRequest,
  CompleteProfileRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types";

export const authService = {
  // step 1 — create account
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(ENDPOINTS.SIGNUP, data);
    // save pre-family token
    await storage.setPreFamilyToken(res.data.token);
    await storage.setUserId(res.data.user_id);
    return res.data;
  },

  // verify email with 6-digit code
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    await api.post(ENDPOINTS.VERIFY_EMAIL, data);
  },

  // step 2 — complete profile after signup
  async completeProfile(data: CompleteProfileRequest): Promise<void> {
    // use pre-family token for this request
    const token = await storage.getPreFamilyToken();
    await api.post(ENDPOINTS.COMPLETE_PROFILE, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // login with email + password
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(ENDPOINTS.LOGIN, data);
    await storage.setPreFamilyToken(res.data.token);
    await storage.setUserId(res.data.user_id);
    return res.data;
  },

  // select a family — returns full family-scoped JWT
  async selectFamily(familyId: string): Promise<any> {
    const token = await storage.getPreFamilyToken();
    const res = await api.post(
      ENDPOINTS.SELECT_FAMILY,
      { family_id: familyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // save family-scoped token
    await storage.setToken(res.data.token);
    await storage.setFamilyId(familyId);
    await storage.setMemberId(res.data.member_id);
    return res.data;
  },

  // google sign in — mobile
  async googleMobileLogin(idToken: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(ENDPOINTS.GOOGLE_MOBILE, {
      id_token: idToken,
    });
    await storage.setPreFamilyToken(res.data.token);
    await storage.setUserId(res.data.user_id);
    return res.data;
  },

  // forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await api.post(ENDPOINTS.FORGOT_PASSWORD, data);
  },

  // reset password with code
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await api.post(ENDPOINTS.RESET_PASSWORD, data);
  },

  // logout — clear all stored data
  async logout(): Promise<void> {
    await storage.clearAll();
  },
};