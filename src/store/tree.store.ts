import { create } from "zustand";
import { FamilyTree,Household,GhostMember } from "../types";

interface TreeState {
  tree: FamilyTree | null;
  isLoading: boolean;
  setTree: (tree: FamilyTree) => void;
  setLoading: (loading: boolean) => void;
  clearTree: () => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  tree: null,
  isLoading: false,

  setTree: (tree: FamilyTree) => set({ tree }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  clearTree: () => set({ tree: null }),
}));