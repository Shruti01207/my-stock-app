import { create } from "zustand"
import { persist } from "zustand/middleware"


interface AuthStore {
    user: User | null
    setUser: (user: User | null) => void // function signature
    clearUser: () => void



}




export const useAuthStore = create<AuthStore>()(persist((set) => ({

    user: null,
    setUser: ((user) => set({ user })),
    clearUser: (() => set({ user: null }))

}), { name: 'auth-storage' }))



