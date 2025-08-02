import { VideoIcon } from 'lucide-react'
import React from 'react'

const CallButton = ({handleVideoCall}) => {
  return (
    <div className='p-3 border-3 flex justify-end right-8 items-center max-w-7xl w-full absolute top-0'>
        <div onClick={handleVideoCall}
         className='btn btn-success btn-sm text-white'>
            <VideoIcon className='size-6'/>
        </div>
    </div>
  )
}

export default CallButton
