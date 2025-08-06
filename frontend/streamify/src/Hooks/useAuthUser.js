import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios.js";


const useAuthUser=()=>{
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
    try {
        const response = await axiosInstance.get("/auth/me");
        return response.data.data;
    } catch (error) {
        return null;        //set the authUser to null
    }
    },
    retry: false
  });
  return {userData,isLoading,error};
}

export {useAuthUser,};

