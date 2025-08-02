import React, { useState } from 'react'
import { useAuthUser } from '../Hooks/useAuthUser.js'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios.js';
import toast from 'react-hot-toast';
const humorTypes=[
  "Absurd",
  "Dark",
  "Irony",
  "Deprecating",
  "Nostalgic",
  "Social",
  "Fast-Paced", 
  "Ephemeral",
  "Punny",
  "Deadpan",
  "Twisted",
  "Cynical",
  "Cringe",
  "Chaotic",
  "Culture",
  "Gentle"
]
const OnBoardingPage = () => {
  const queryClient=useQueryClient();

  const {userData,isLoading}=useAuthUser();
  const [bio,setBio]=useState("");
  const [location,setLocation]=useState("");
  const [avatar,setAvatar]=useState("");
  const [avatarPreview,setAvatarPreview]=useState(userData.avatar || "")
  const [vibes,setVibes]=useState([]);

  const onBoardMutation=useMutation({
    mutationFn:async(data)=>{
      const response=await axiosInstance.post("/auth/onboard",data);
      return response.data.data;
    },
    onSuccess:(data)=>{
        console.log(data);
        toast.success(`On Boarding Complete `)
        setBio("");
        setLocation("")
        setVibes([])
        queryClient.invalidateQueries(['authUser'])     
        return
    },
    onError:(error)=>{
      console.log(error.response?.data?.message ,);
      toast.error(`${error.response.data.errors}  missing`)
      return {}
    }
  })

  const onboardHandler=(e)=>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("bio",bio);
    formData.append("location",location);
    formData.append("humor", vibes.join(","));

    if(avatar)
      formData.append("avatar",avatar);
    onBoardMutation.mutate(formData)
  }

  return (
    <div className="flex justify-center items-center min-h-screen " data-theme="forest">
      <div className="card max-w-3xl w-full  shadow-xl m-4 sm:m-6">
        <div className="card-body p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">
            Complete Your Profile
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Tell us about your humor vibes to connect with meme lords worldwide!
          </p>
          <form onSubmit={(e)=>onboardHandler(e)}  
          className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full flex  object-cover border-2 border-green-500 bg-white"
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-1 cursor-pointer hover:bg-purple-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e)=>{    const file = e.target.files[0];
                                      if (file) {
                                        setAvatar(file);
                                        const url = URL.createObjectURL(file);
                                        setAvatarPreview(url);
                                      }
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Edit your avatar</p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                Bio
              </label>
              <textarea
                value={bio}
                id="bio"
                className="mt-1 w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                rows="4"
                placeholder="Tell us about yourself..."
                onChange={(e)=>setBio(e.target.value)}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                Location
              </label>
              <input
                value={location}
                onChange={(e)=>setLocation(e.target.value)}
                id="location"
                type="text"
                className="mt-1 w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., Tokyo, Japan"
                required
              />
            </div>

            {/* Humor Types */}
            <div>
              <h4>Vibes :</h4>
              <div className='mt-5 flex gap-5'>
                <select
                  onChange={(e)=>{
                    const selected=e.target.value;
                    setVibes((prev)=>[...prev,selected])
                  }}
                  className="select select-accent w-full sm:w-1/2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                <option disabled={true}>Select Your Vibe</option>
                {humorTypes.map((type,index) => (
                  <option disabled={vibes.length==3}
                   key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className='h-full w-1/2 px-4 py-2 '>
<div className="flex flex-wrap gap-2 items-center">
  {vibes.map((vibe, index) => (
    <div
      key={index}
      className="badge  badge-accent relative badge-lg ">
    
      {vibe}
      <button
        type="button"
        className="absolute -top-1 -right-1 bg-white text-purple-600 border border-purple-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold hover:bg-red-500 hover:text-white transition duration-200"
        onClick={() =>
          setVibes((prev) => prev.filter((_, i) => i !== index))
        }
      >
        ×
      </button>
    </div>
  ))}
</div>

              </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button 
                disabled={onBoardMutation.isPending}
                type="submit"
                className="btn btn-soft btn-success w-full sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl"
                >
                 {onBoardMutation.isPending?"Joining the Meme Squad" :"Join the Meme Squad"}
                
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage
