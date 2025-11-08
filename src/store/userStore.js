import {create } from "zustand"

export const useUserStore = create((set) => ({
  user: null,

  setUser: (data) => set({user: data}),

  clearUser: () => set({user: null}),

  updateUserPart: (partial) => set((state) => ({
    user: {...state.user, ...partial}
  }))
}))