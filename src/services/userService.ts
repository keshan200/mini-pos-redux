import type { User } from "../types/User"
import { BASE_URL ,apiClient } from "./apiClient";


const USER_API_URL = `${BASE_URL}/signup`

export interface loginRes {
   name:string,
   email:string,
   password:string

}



export const signup = async (userData: User) => {
    const res = await apiClient.post<User>(USER_API_URL, userData, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    return res.data;
}


export const login = async (user: Omit<User ,"name">) =>{
     const response = await apiClient.post("auth/login",user)
    return response.data;     
}