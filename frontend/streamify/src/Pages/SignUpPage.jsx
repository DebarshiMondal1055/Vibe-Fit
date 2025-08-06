import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosInstance } from '../utils/axios.js';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageLoader from '../Components/PageLoader.jsx';
const SignUpPage = () => {
  const [fullname,setFullname]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  
  const queryClient=useQueryClient(); 
  
  const signUpMutation=useMutation({
    mutationFn:async(data)=>{
        const response=await axiosInstance.post("/auth/signup",data);
        return response.data.data
    },
    onSuccess:(data)=>{
        console.log(data);
        queryClient.invalidateQueries(['authUser'])
        toast.success(`Welcome ${username}`)
        setFullname("");
        setUsername("");
        setEmail("");
        setPassword("");
        return
    },
    onError:(error)=>{
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message)
      return {}
    }
  })


  const signUpHandler=(e)=>{
    e.preventDefault();
    const data={fullname,username,email,password}
    signUpMutation.mutate(data);
  }

  if(signUpMutation.isPending ){
    return (
      <PageLoader/>
    )
  }
  
  return (
    <div className='h-screen flex flex-col md:flex-row p-4 items-center justify-center sm:p-6 md:p-8 ' data-theme="forest">
      <div className='w-full md:w-1/2 h-full flex flex-col lg:flex-row items-center justify-center overflow-hidden mx-auto '>
        <form onSubmit={(e)=>signUpHandler(e)} className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-center text-gray-500 mb-6'>Sign Up</h2>
          <div className='space-y-4'>
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username</label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder='Enter your username'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label htmlFor='fullname' className='block text-sm font-medium text-gray-700'>Full Name</label>
              <input
                id='fullname'
                type='text'
                value={fullname}
                onChange={(e)=>setFullname(e.target.value)}
                placeholder='Enter your full name'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder='Enter your email'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder='Enter your password'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
            <button 
            type='submit'
            disabled={signUpMutation.isPending}
            className="btn btn-success w-full rounded-lg">
              {signUpMutation.isPending?"Signing up":"Sign in"}
            </button>
          </div>
          <div className=' flex justify-center mt-4'
            >Already have an account?<Link className='text-blue-400' to={"/login"}>Sign In</Link> </div>
        </form>

      </div>
      <div className='w-full md:w-1/2 h-full flex items-center justify-center'>
        <img
          src={"../public/signup.png"}
          alt='Sign up illustration'
          className='w-full h-full object-cover rounded-lg md:rounded-none'
        />
      </div>
    </div>
  )
}

export default SignUpPage
