import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthUser } from '../Hooks/useAuthUser';
import { StreamChat } from 'stream-chat';
import { CallingState, StreamCall, StreamVideo, StreamVideoClient, useCall, useCallStateHooks} from '@stream-io/video-react-sdk';
import toast from 'react-hot-toast';
import PageLoader from '../Components/PageLoader';
import CallContent from '../Components/CallContent';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios.js';

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;
const CallPage = () => {
  const {id:callId}=useParams();
  const [client,setClient]=useState(null);
  const [call,setCall]=useState(null);
  const [isConnecting,setIsConnecting]=useState(true)
  
  const {userData}=useAuthUser()

  const {data:token}=useQuery({
    queryKey:['streamToken'],
    queryFn:async()=>{
      try {
        const response =await axiosInstance.get("chats/token");
        return response.data.data;
      } catch (error) {
        console.error(error);
        return {}
      }
    },
    enabled:!!userData    //!!->converts to Boolean
  })
  

  useEffect(()=>{
    ;(async()=>{
      if(!token || !userData) return;
      try {
        const user={
          id:userData._id,
          name:userData.fullname,
          image:userData.avatar
        }

        const videoClient=new StreamVideoClient({apiKey:STREAM_API_KEY,
          user,
          token:token.token
        })

        const callInstance=videoClient.call("default",callId);
        await callInstance.join({create:true})
        console.log("Joined call successfully")
        setClient(videoClient);
        setCall(callInstance)
      } catch (error) {
          console.error(error);
          toast.error("Failed to join call")
      }
      finally{
        setIsConnecting(false);
      }
    })()
  },[callId,userData,token])

  if(isConnecting || !token || !userData){
    return <PageLoader/>
  }

  return (
    <div className='h-screen w-full  '>
      <div className='relative'>
        {
          client && call?(
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent/>
              </StreamCall>
            </StreamVideo>

          ):(
          <div className='h-full flex justify-center items-center'>
            <p className='font-mono text-lg '>Unable to connect to the call. Please refresh or try again</p>
          </div>)
        }
      </div>
    </div>
  )
}

export default CallPage
