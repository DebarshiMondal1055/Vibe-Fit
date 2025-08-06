import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthUser } from '../Hooks/useAuthUser'
import {HomeIcon,Users2Icon,BellIcon} from 'lucide-react'
const Sidebar = () => {
    const {userData,isLoading,error}=useAuthUser();
    return (
    <div className='h-[92vh] w-[18%] border-r-2 border-r-zinc-500 p-4 '>
      <ul className="menu  lg:flex flex-col w-full space-y-2 p-0 text-primary">
        <li><Link to={"/"} className="rounded-2xl hover:bg-base-500 "><HomeIcon/>Home</Link></li>
        <li><Link to={"/friends"} className="rounded-2xl hover:bg-base-500 "><Users2Icon/>Friends</Link></li>
        <li><Link to={"/notifications"} className="rounded-2xl hover:bg-base-500 "><BellIcon/>Notifications</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar
