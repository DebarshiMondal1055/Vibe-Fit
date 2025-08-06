import React from 'react'
import { Link } from 'react-router-dom'

const RecommendedUser = ({user,requestBeenSent,sendRequestHandler}) => {
  return (
    <div className="card bg-base-300 hover:shadow-lg z-10 w-96 shadow-sm p-6 ">
        <div className='card-body px-4 py-2'>
            <div className='flex items-center gap-3 '>
                <div className="avatar size-35">
                <div className="w-24 rounded-full">
                    <img src={user.avatar} />
                </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <h4 className='font-semibold truncate text-xl'>@{user.username}</h4>
                    <Link to={`/user-profile/${user._id}`} className="btn btn-dash btn-secondary btn-xs">View Profile</Link>

                </div>
            </div >
            <div className='flex gap-2 mt-3 px-4 py-2'>
                <span>Vibes :</span>
                {user.humor.map((humor,index)=>(
                     <div className="badge badge-soft badge-info" key={index}>{humor}</div>
                ))}
            </div>
            <button onClick={()=>sendRequestHandler(user._id)} 
            disabled={requestBeenSent} className={`btn btn-soft btn-success rounded-2xl`}>{requestBeenSent?"Request Sent":"Send Request"}</button>
        </div>
    </div>
  )
}

export default RecommendedUser
