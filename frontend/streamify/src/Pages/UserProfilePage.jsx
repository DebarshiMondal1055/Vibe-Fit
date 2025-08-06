import React from 'react'
import VibeCards from '../Components/VibeCards'
import { useMutation, useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../utils/axios'
import { useParams } from 'react-router-dom'
import { HeartIcon } from 'lucide-react'
import PageLoader from '../Components/PageLoader.jsx'
import Slider from '../Components/Slider.jsx'
const UserProfilePage = () => {

    const {id}=useParams();
    const {data:profileData,isLoading,error}=useQuery({
        queryKey:['profileData'],
        queryFn:async()=>{
            try {
                const response=await axiosInstance.get(`user/get-user-profile/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    })

    const {data:posts,isLoading:postLoading}=useQuery({
        queryKey:['posts'],
        queryFn:async()=>{
            try {
                const response=await axiosInstance.get(`posts/user-posts/${id}`);
                return response.data.data;
            } catch (error) {
                console.error(error);
                return {};
            }
        }
    })



    if(isLoading || postLoading){
      return <PageLoader/>
    }


  
    return (
    <div className='w-full h-[93vh] p-4 sm:p-6 md:p-8 overflow-y-auto'>
      <div className='flex flex-col gap-6 md:gap-10'>
        {/* User Info Section */}
        <div className='pl-4 sm:pl-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-col'>
            <h2 className='text-2xl sm:text-3xl truncate font-bold'>{profileData?.fullname}</h2>
            <p className='text-sm sm:text-base text-gray-500'>@{profileData?.username}</p>
          </div>
          <div className='mt-4 sm:mt-0 ring-primary ring-offset-base-100  rounded-full ring-2 ring-offset-2'>
            <img
              src={profileData?.avatar}
              alt="User Avatar"
              className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover'
            />
          </div>
        </div>

        {/* Carousel Section */}
        <div className='flex w-full justify-center '>
          {posts.length>0?<Slider posts={posts}/>:<p className='text-xl font-mono'>No User Posts</p>}
        </div>

        {/* More About User Section */}
        <div className='w-full px-4 sm:px-6 md:px-8'>
          <h3 className='text-xl sm:text-2xl font-semibold text-info mb-4'>More About {profileData?.username}</h3>
          <div className='card bg-base-100 shadow-xl  '>
            <p className='text-lg sm:text-base text-info text-base-content/80  mb-4'>
              {profileData?.bio}
            </p>
            <div className='flex items-center gap-2 text-sm sm:text-base text-gray-500'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{profileData?.location}</span>
            </div>
          </div>
        </div>
        {/* Vibes Section */}
        <div className='w-full flex  flex-col md:flex-row gap-6 px-4 sm:px-6 md:px-8'>
            {profileData?.humor?.map((vibe,index)=>(
              <VibeCards key={index} vibe={vibe} username={profileData?.username}/>
            ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage
