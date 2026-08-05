import { create } from "zustand";
import { FamilyWithMember,ExtendedFamily } from "../types";
import { storage } from "../utils";

interface FamilyState {
  // state
  currentFamily: FamilyWithMember | null;
  families: FamilyWithMember[];
  isAdmin: boolean;
  memberType: "adult" | "child" | null;

  // actions
  setCurrentFamily: (family: FamilyWithMember) => Promise<void>;
  setFamilies: (families: FamilyWithMember[]) => void;
  clearFamily: () => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  currentFamily: null,
  families: [],
  isAdmin: false,
  memberType: null,

  // called after select-family
  setCurrentFamily: async (family: FamilyWithMember) => {
    await storage.setFamilyId(family.family_id);
    await storage.setMemberId(family.member_id);
    set({
      currentFamily: family,
      isAdmin: family.is_admin,
      memberType: family.member_type,
    });
  },

  setFamilies: (families: FamilyWithMember[]) => {
    set({ families });
  },

  clearFamily: () => {
    set({
      currentFamily: null,
      families: [],
      isAdmin: false,
      memberType: null,
    });
  },
}));