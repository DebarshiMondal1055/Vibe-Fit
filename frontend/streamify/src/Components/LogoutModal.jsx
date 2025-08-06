import React from 'react'
import {LogOutIcon} from "lucide-react"
import PageLoader from './PageLoader.jsx';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';
const LogoutModal = () => {
    const queryClient=useQueryClient();
    const logoutMutation=useMutation({
        mutationFn:async()=>{
            const response=await axiosInstance.post("auth/logout");
            return response.data.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['authUser']);
            toast.success("User logged out successfully");
        },
        onError:()=>{
            toast.error("Failed to logout");
        }
    })

    const logoutHandler=()=>{
        logoutMutation.mutate();
    }

    if(logoutMutation.isPending){
        return(
            <PageLoader/>
        )
    }
  return (
    <div>
        <button className="btn btn-ghost btn-circle" onClick={()=>document.getElementById('my_modal_1').showModal()}><LogOutIcon/></button>
        <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Logout User</h3>
            <p className="py-4">Are you sure you want to logout</p>
            <div className="modal-action space-x-2">
            <form method="dialog" >
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-info">Close</button>
            </form>
            <button onClick={logoutHandler} className="btn btn-info">Log out</button>
            </div>
        </div>
        </dialog>  
    </div>
  )
}

export default LogoutModal
