import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../utils/axios'
import { useParams } from 'react-router-dom'
import { useAuthUser } from '../Hooks/useAuthUser'
import {Channel,ChannelHeader,Chat,handleActionWarning,MessageInput,MessageList,Thread,Window} from "stream-chat-react"
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from '../Components/ChatLoader.jsx'
import {VideoIcon} from "lucide-react"
import CallButton from '../Components/CallButton.jsx'


const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const {id:friendID}=useParams()
  const [chatClient,setChatClient]=useState(null)
  const [channel,setChannel]=useState(null);
  const [loading,setLoading]=useState(true);
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
      if(!token.token || !userData) return
      
      try {
        console.log("Inistialising chat client yooo");
        console.log(token)
        const client = StreamChat.getInstance(STREAM_API_KEY)
        await client.connectUser({
          id:userData._id,
          name:userData.fullname,
          image:userData.avatar
        },token.token)

        //Creating a channel
        const channelId=[userData._id,friendID].sort().join("-");
                                          //Channel-Type->ChannelId->members   
        const currChannel=client.channel("messaging",channelId,{
          members:[userData._id,friendID]
        })

        await currChannel.watch()

        setChatClient(client);
        setChannel(currChannel)

      } catch (error) {
        console.error(error);
        toast.error("Failed to create channel")
      }
      finally{
        setLoading(false)
      }
    })()
  },[token,userData,friendID])

  const handleVideoCall=()=>{
    if(channel){
      const callUrl=`${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text:`Started a Video call. Join in ${callUrl}`
      })
      toast.success("Video call Link sent");
    }
  }

  if(loading || !chatClient || !channel){
    return <ChatLoader/>
  }

  return (
    <div className='h-[90vh] '>
      <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className='w-full relative'>
                <CallButton handleVideoCall={handleVideoCall} />
                <Window>
                  <ChannelHeader/>
                  <MessageList/>
                  <MessageInput focus/>
                </Window>
            </div>
            <Thread/>
          </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
