import { create } from "zustand";

export interface UserState {
  userName: string;
  role: string;
  setUserName: (name: string) => void;
  setRole: (role: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userName: "",
  role: "",
  setUserName: (name: string) => set({ userName: name }),
  setRole: (role: string) => set({ role: role }),
}));
