import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "family_app_token",
  PRE_FAMILY_TOKEN: "family_app_pre_token",
  USER_ID: "family_app_user_id",
  FAMILY_ID: "family_app_family_id",
  MEMBER_ID: "family_app_member_id",
} as const;

// SecureStore only accepts strings. Throw with the key name so the
// failing field is obvious instead of the generic SecureStore error.
async function setString(key: string, value: unknown): Promise<void> {
  if (typeof value !== "string" || value === "") {
    throw new Error(`SecureStore: invalid value for "${key}": ${String(value)}`);
  }
  await SecureStore.setItemAsync(key, value);
}

export const storage = {
  // token: family-scoped JWT (full access)
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.TOKEN);
  },
  async setToken(token: string): Promise<void> {
    await setString(KEYS.TOKEN, token);
  },

  // pre-family token: issued after login, before family selection
  async getPreFamilyToken(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.PRE_FAMILY_TOKEN);
  },
  async setPreFamilyToken(token: string): Promise<void> {
    await setString(KEYS.PRE_FAMILY_TOKEN, token);
  },

  // user id
  async getUserId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.USER_ID);
  },
  async setUserId(id: string): Promise<void> {
    await setString(KEYS.USER_ID, id);
  },

  // family id
  async getFamilyId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.FAMILY_ID);
  },
  async setFamilyId(id: string): Promise<void> {
    await setString(KEYS.FAMILY_ID, id);
  },

  // member id
  async getMemberId(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.MEMBER_ID);
  },
  async setMemberId(id: string): Promise<void> {
    await setString(KEYS.MEMBER_ID, id);
  },

  // clear everything on logout
  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      SecureStore.deleteItemAsync(KEYS.PRE_FAMILY_TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER_ID),
      SecureStore.deleteItemAsync(KEYS.FAMILY_ID),
      SecureStore.deleteItemAsync(KEYS.MEMBER_ID),
    ]);
  },
};