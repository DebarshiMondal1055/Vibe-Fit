import { CallControls, CallingState, SpeakerLayout, StreamTheme, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const CallContent = () => {
  const {useCallCallingState}=useCallStateHooks()
  const navigate=useNavigate();
  const callState=useCallCallingState();
  if(callState===CallingState.LEFT){
    toast.apply("Call disconnected");
    return navigate("/")

  }
  return (
    <div className='w-full '>
    <StreamTheme>
      <SpeakerLayout/>
      <CallControls/>
    </StreamTheme>
    </div>
  )
}

export default CallContent
