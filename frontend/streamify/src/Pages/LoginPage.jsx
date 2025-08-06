import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { axiosInstance } from '../utils/axios.js';
import toast from 'react-hot-toast';
import PageLoader from '../Components/PageLoader.jsx';
const LoginPage = () => {
  const queryClient=useQueryClient();
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("")

  const loginMutation=useMutation({
    mutationFn:async(data)=>{
      const response=await axiosInstance.post("auth/login",data);
      return response.data.data;
    },
    onSuccess:(data)=>{
      console.log(data);
      queryClient.invalidateQueries(['authUser']);
      setEmail("");
      setPassword("");
      setUsername("");
      toast.success("Logged in successfully") 
      return;
    },
    onError:(error)=>{
      console.error(error.response.data.message);
      toast.error(error.response.data.message)
      return;
    }
  })

  const loginHandler=(e)=>{
    e.preventDefault();
    const data={username,email,password};
    loginMutation.mutate(data);
  }

  if(loginMutation.isPending){
    return(
      <PageLoader/>
    )
  }
  return (
    <div className='h-screen flex flex-col md:flex-row p-4 items-center justify-center sm:p-6 md:p-8 bg-zinc-800' data-theme="cyberpunk">
      <div className='w-full md:w-1/2 h-full flex flex-col lg:flex-row items-center justify-center overflow-hidden mx-auto '>
        <form onSubmit={(e)=>loginHandler(e)}
         className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-center text-gray-500 mb-6'>Log In</h2>
          <p className='flex justify-center text-zinc-500 mb-4 font-semibold'>Welcome Back, Lets Laugh Out Loud</p>
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
                autoComplete="username"
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
                autoComplete='email'
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
                autoComplete="password" 
              />
            </div>
            <button 
            type='submit'
            className="btn btn-success w-full rounded-lg">
                    Log in
            </button>
          </div>
          <div className=' flex justify-center mt-4'
            >Don't have an account?<Link className='text-blue-400' to={"/signup"}>Sign up</Link> </div>
        </form>

      </div>
      <div className='w-full md:w-1/2 h-full flex items-center justify-center'>
        <img
           src="/signup.png"
          alt='Sign up illustration'
          className='w-full h-full object-cover rounded-lg md:rounded-none'
        />
      </div>
    </div>
  )
}

export default LoginPage
