import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { axiosInstance } from '../utils/axios';
import PageLoader from '../Components/PageLoader';
import { useMutation } from '@tanstack/react-query';
import {Users2Icon,BellRingIcon,ClockIcon, MessageSquarePlusIcon} from "lucide-react"
import {toast} from "react-hot-toast"
import { useShowSideBarStore } from '../Hooks/useShowSideBar';
const NotificationsPage = () => {

  const queryClient=useQueryClient();

  const {data:friendRqs=[],isLoading,error}=useQuery({
    queryKey:['friendsRqs'],
    queryFn:async()=>{
      try {
        const response =await axiosInstance.get("request/friend-request/new");
        return response.data.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    } 
  })

  const acceptReqMutation=useMutation({
    mutationFn:async(reqID)=>{
      const response=await axiosInstance.put(`request/friend-request/${reqID}/accept`)
      return response.data.data;
    },
    onSuccess:(data)=>{
      console.log(data)
      toast.success("The user is now your friend")
      queryClient.invalidateQueries(['friends']);
      queryClient.invalidateQueries(['friendsRqs']);
    },
    onError:(error)=>{
      console.log(error)
    }
  })

  const acceptReqHandler=(reqID)=>{
    acceptReqMutation.mutate(reqID)
  }

  const {data:acceptedReqs=[],isLoading:acceptedRqsLoading,error:acceptedReqsError}=useQuery({
    queryKey:['acceptedReqs'],
    queryFn:async()=>{
      try {
          const response=await axiosInstance.get("request/friend-request/accepted");
          return response.data.data;
      } catch (error) {
          console.error(error);
          return [];
      }
    }
  })
  
  if(isLoading){
    return <PageLoader/>
  }
  return (
      <div className='p-4 sm:p-6 lg:p-8 h-[92vh] overflow-y-auto'>
        <div className='container mx-auto max-w-4xl space-y-8'>
          <h2 className='font-bold text-3xl truncate'>Notifications</h2>
          {isLoading?(
            <div className='flex justify-center items-center py-12'>
              <span className='loading loading-spinner loading-lg'/>
            </div>
            
          ):(
            <div >
              
              {
                friendRqs?.length>0 &&(
                  <section>
                      <h4 className='font-semibold flex gap-5  '><Users2Icon/> Friend Requests<span className='badge badge-sm badge-secondary'>{friendRqs.length}</span></h4>
                     { friendRqs.map((friend,index)=>(
                        <div key={index} className='card bg-base-300 shadow-md hover:shadow-lg transition-shadow mt-5'>
                          <div className='card-body p-4 flex justify-between items-center'>
                              <div className="flex flex-col w-full space-y-4">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={friend.from.avatar}
                                    alt={friend.from.fullname}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h2 className="text-lg font-semibold ">{friend.from.fullname}</h2>
                                        <p className="text-sm ">@{friend.from.username}</p>
                                      </div>
                                      <button
                                        className="bg-gray-200 text-gray-800 text-sm font-medium py-1 px-3 rounded-lg hover:bg-gray-300 transition duration-200"
                                        onClick={() => alert('View profile clicked!')}
                                      >
                                        View Profile
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 px-4">
                                  <span>Vibes : </span>
                                    {friend.from?.humor?.map((humor, index) => (
                                      <span
                                        key={index}
                                        className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                      >
                                        {humor}
                                      </span>
                                    ))}
                                </div>
                                <button
                                  className="btn bg-info text-zinc-700  hover:btn-primary w-full"
                                  onClick={() => acceptReqHandler(friend._id)}
                                >
                                  Accept Friend Request
                                </button>
                              </div>
                            
                          </div>
                        </div>
                      ))}

                  </section>
                )

              }
              {/* Accepted Request notifications */}

              {acceptedReqs.length>0 && (
                <section className='space-y-4 mt-4'>
                  <h4 className='text-xl font-semibold flex gap-4'>
                    <BellRingIcon/>
                    <span>New Connections</span>
                  </h4>
                    {
                      acceptedReqs.map((connection,index)=>(
                        <div className='card bg-base-300 shadow-sm' key={index}>
                          <div className='card-body p-4'>
                            <div className='flex items-start gap-3'>
                                <div className="avatar size-14">
                                  <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                                    <img src={connection.newFriend.avatar} />
                                  </div>
                                </div>
                                <div className='flex-1'>
                                   <h3 className='font-semibold'>@{connection.newFriend.username}</h3>
                                   <p className='text-sm mt-3'>Bumblebee accepted your friend request</p> 
                                    <p className='mt-1 text-sm flex gap-2  items-center'>
                                      <ClockIcon className='h-4 w-4 '/> <span>Recently</span>
                                    </p>
                                </div>
                                <div className='badge badge-success'>
                                  <MessageSquarePlusIcon className='h-4 w-4 mr-2'/>
                                    New Friend
                                </div>
                            </div>
                          </div>
                        </div>
                      ))    
                    }
                </section>
              )}
              {
                friendRqs.length==0 && acceptedReqs.length==0 && (
                  <div className='container'>
                      No new Notifications
                  </div>
                )
              }
            </div>
          )}
        </div>

      </div>
  )
}

export default NotificationsPage;