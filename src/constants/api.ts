export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const ENDPOINTS = {
  // auth
  SIGNUP:           "/auth/signup",
  LOGIN:            "/auth/login",
  VERIFY_EMAIL:     "/auth/verify-email",
  COMPLETE_PROFILE: "/auth/complete-profile",
  FORGOT_PASSWORD:  "/auth/forgot-password",
  RESET_PASSWORD:   "/auth/reset-password",
  SELECT_FAMILY:    "/auth/select-family",
  GOOGLE_MOBILE:    "/auth/google/mobile",

  // families
  CREATE_FAMILY:    "/families/create",
  LIST_FAMILIES:    "/families",
  INVITE_MEMBER:    "/families/invite",
  JOIN_FAMILY:      "/families/join",
  TRANSFER_ADMIN:   "/families/transfer-admin",
  REMOVE_MEMBER:    (id: string) => `/families/members/${id}`,
  CHANGE_TYPE:      (id: string) => `/families/members/${id}/type`,
  SET_THRESHOLD:    "/families/threshold",

  // tree
  HOUSEHOLDS:       "/tree/households",
  JOIN_REQUEST:     (id: string) => `/tree/households/${id}/join-request`,
  JOIN_REQUESTS:    "/tree/join-requests",
  REVIEW_REQUEST:   (id: string) => `/tree/join-requests/${id}`,
  GHOST_MEMBERS:    "/tree/ghost-members",
  UPDATE_GHOST:     (id: string) => `/tree/ghost-members/${id}`,

  // profile
  MY_PROFILE:       "/profile/me",
  MEMBER_PROFILE:   (id: string) => `/profile/members/${id}`,
} as const;