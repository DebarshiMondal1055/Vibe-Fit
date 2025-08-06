import axios from "axios"

const axiosInstance=axios.create({
    baseURL:`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1`,
    withCredentials:true  //send cookie data while sending request.... 
})

export {axiosInstance};