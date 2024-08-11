import { create } from "zustand"

interface authSlice{
    isLogedIn:boolean,
    signOut:()=>void,
    signIn:()=>void
}

export const createauthSlice=create<authSlice>()((set)=>({
    isLogedIn:false,
    signOut:()=> set(()=>({isLogedIn:false})),
    signIn:()=> set(()=>({isLogedIn:true})),

}))