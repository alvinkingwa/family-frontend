import { create } from "zustand";
import { AuthResponse,UserProfile } from "../types";
import { storage } from "../utils";

interface AuthState {
  // state
  isLoggedIn: boolean;
  isLoading: boolean;
  userId: string | null;
  email: string | null;
  emailVerified: boolean;
  hasProfile: boolean;
  profile: UserProfile | null;

  // actions
  setAuthResponse: (response: AuthResponse) => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  setEmailVerified: (verified: boolean) => void;
  logout: () => Promise<void>;
  initializeFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  userId: null,
  email: null,
  emailVerified: false,
  hasProfile: false,
  profile: null,

  // called after signup or login
  setAuthResponse: async (response: AuthResponse) => {
    set({
      isLoggedIn: true,
      userId: response.user_id,
      email: response.email,
      emailVerified: response.email_verified,
      hasProfile: response.has_profile,
    });
  },

  setProfile: (profile: UserProfile) => {
    set({ profile, hasProfile: true });
  },

  setEmailVerified: (verified: boolean) => {
    set({ emailVerified: verified });
  },

  // logout — clear everything
  logout: async () => {
    await storage.clearAll();
    set({
      isLoggedIn: false,
      userId: null,
      email: null,
      emailVerified: false,
      hasProfile: false,
      profile: null,
    });
  },

  // called on app start — check if user is already logged in
  initializeFromStorage: async () => {
    const token = await storage.getToken();
    const preFamilyToken = await storage.getPreFamilyToken();
    const userId = await storage.getUserId();

    if ((token || preFamilyToken) && userId) {
      set({ isLoggedIn: true, userId, isLoading: false });
    } else {
      set({ isLoggedIn: false, isLoading: false });
    }
  },
}));