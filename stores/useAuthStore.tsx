import { create } from "zustand"
import { persist } from "zustand/middleware"


interface AuthStore{
    user: User|null
    setUser: (user:User|null)=>void // function signature
    clearUser:()=>void



}



// create=> it creates a global container/store, store is a hook u can put anything 
export const useAuthStore= create<AuthStore>()(persist((set)=>({

    user: null,
    setUser:((user)=>set({user})),
    clearUser:(()=>set({user:null}))

}),{name:'auth-storage'}))



// (user)=>{}

// function setUser(user){
  
//}
