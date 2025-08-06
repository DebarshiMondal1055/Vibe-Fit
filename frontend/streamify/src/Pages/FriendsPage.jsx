import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../utils/axios';
import {Link} from "react-router-dom"

const FriendsPage = () => {
    const queryClient=useQueryClient();
    const {data:friends,isLoading,isError}=useQuery({
        queryKey:['friends'],
        queryFn:async()=>{
            try {
                const response=await axiosInstance.get("user/friends");
                return response.data.data;
            } catch (error) {
                console.error(error);
                return []
            }
        }
    })  

  return (
      <div className='p-4 sm:p-6 lg:p-8 h-[92vh] overflow-y-auto'>
        <div className='container mx-auto max-w-4xl space-y-8'>
          <h2 className='font-bold text-3xl truncate'>My Friends</h2>
          {isLoading?(
            <div className='flex justify-center items-center py-12'>
              <span className='loading loading-spinner loading-lg'/>
            </div>
            
          ):(
            <div >
              
              {
                friends.length>0 &&(
                  <section>
                      <h4 className='font-semibold flex gap-5  '>Your buddies are waiting. Catch up and share the tea.<span className='badge badge-sm badge-secondary'>{friends.length}</span></h4>
                     { friends.map((friend,index)=>(
                        <div key={index} className='card bg-base-300 shadow-md hover:shadow-lg transition-shadow mt-5'>
                          <div className='card-body p-4 flex justify-between items-center'>
                              <div className="flex flex-col w-full space-y-4">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={friend.avatar}
                                    alt={friend.fullname}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h2 className="text-lg font-semibold ">{friend.fullname}</h2>
                                        <p className="text-sm ">@{friend.username}</p>
                                      </div>
                                      <Link to={`/user-profile/${friend._id}`}
                                        className="btn btn-primary btn-sm bg-gray-300 text-gray-800 text-sm font-medium py-1 px-3 rounded-lg hover:bg-gray-300 transition duration-200"
                                      >
                                        View Profile
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 px-4">
                                  <span>Vibes : </span>
                                    {friend?.humor?.map((humor, index) => (
                                      <span
                                        key={index}
                                        className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                      >
                                        {humor}
                                      </span>
                                    ))}
                                </div>
                                <Link to={`/chats/${friend._id}`}
                                  className="btn bg-info text-zinc-700  hover:btn-primary w-full"
                                >
                                  Message
                                </Link>
                              </div>
                            
                          </div>
                        </div>
                      ))}

                  </section>
                )

              }
            </div>
          )}
        </div>

      </div>
  )
}

export default FriendsPage
