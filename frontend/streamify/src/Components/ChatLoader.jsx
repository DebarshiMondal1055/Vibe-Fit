import React from 'react'
import { LoaderIcon } from 'react-hot-toast'

const ChatLoader = () => {
  return (
    <div className='h-screen flex flex-col justify-start items-center p-4'>
        <LoaderIcon className='animate-spin size-15 text-primary'/>
        <p className='mt-4 text-center text-lg font-mono'>Connecting to chat...</p>
    </div>
  )
}

export default ChatLoader
