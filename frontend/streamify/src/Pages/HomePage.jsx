import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {UserIcon} from "lucide-react"
import RecommendedUser from '../Components/RecommendedUser.jsx';

const HomePage = () => {
  const queryClient=useQueryClient();
  const [ongoingRequest,setOnGoingRequest]=useState(new Set())
  
  const {data:friends,isLoading:friendsLoading,error:friendsError}=useQuery({
    queryKey:['friends'],
    queryFn:async()=>{
      try {
        const response=await axiosInstance.get("user/friends");
        return response.data.data;
      } catch (error) {
        toast.error("Failed to fetch your friends");
        return [];
      }
    }
  })

  const {data:recommendedUsers=[],isLoading,error}=useQuery({
      queryKey:['recommendedUsers'],
      queryFn:async()=>{
        try {
          const response =await axiosInstance.get("user/")
          return response.data.data;
        } catch (error) {
          return [];
        }
      }
  })

  const {data:outgoingRqs=[],isLoading:outgoingrqsLoading}=useQuery({
    queryKey:['outgoingReq'],
    queryFn:async()=>{
      try {
        const response=await axiosInstance.get("request/friend-request/ongoing");
        return response.data.data;
      } catch (error) {
        return [];
      }
    }
  })

  const sendRequestMutation=useMutation({
    mutationFn:async(userID)=>{
      const response =await axiosInstance.post(`request/send-request/${userID}`);
      return response.data.data;
    },
    onSuccess:(data)=>{
      toast.success("Request sent successfully");
      queryClient.invalidateQueries(['outgoingReq']);
      console.log(data);
    },
    onError:(error)=>{
      toast.error(error.response?.data?.message);
      return null;
    }
  })





  const sendRequestHandler=(userID)=>{
      sendRequestMutation.mutate(userID);
  }

    useEffect(() => {
      const newSentReqsIDS = new Set();
      outgoingRqs.forEach((req) => {
        newSentReqsIDS.add(req.to._id);
      });

      // Only update if the set contents are different
      const setsAreEqual =
        newSentReqsIDS.size === ongoingRequest.size &&
        [...newSentReqsIDS].every(id => ongoingRequest.has(id));

      if (!setsAreEqual) {
        setOnGoingRequest(newSentReqsIDS);
      }
    }, [outgoingRqs]);


  return (
    <div className='sm:p-6 lg:p-8 p-4 overflow-y-auto h-[92vh]'>
        <div className='container mx-auto space-y-4'>
          <div className='flex justify-between gap-4 items-start sm:items-center'>
            <h2 className='tracking-tight font-bold text-2xl sm:text-3xl '>Fit Your Vibe</h2>
            <Link to={"/notifications"} className='btn btn-outline btn-sm '>
              <UserIcon className='size-4 mr-2'/>
              New Requests
            </Link>
          </div>
          <p>Discover people with the same sense of humor as you. No judgements applied.</p>
        </div>
        {
          isLoading?(
            // <div className='flex justify-center items-center py-12'>
            //   <span className='loading loading-spinner loading-lg'/>
            // </div>
            ""
          ):(
            recommendedUsers.length===0?"No recommended Users":
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6 '>
              {recommendedUsers.map((user,)=>(
                <RecommendedUser key={user._id} user={user} requestBeenSent={ongoingRequest.has(user._id)} sendRequestHandler={sendRequestHandler}/>
               ))}
            </div>
          )
        }
    </div>
  )
}

export default HomePage
