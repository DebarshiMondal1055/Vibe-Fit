import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../utils/axios'
import toast from 'react-hot-toast';

const DeletePostModal = ({post}) => {
    const queryClient=useQueryClient();
    const deletePostMutation=useMutation({
        mutationFn:async(id)=>{
            const response=await axiosInstance.post(`posts/delete-post/${id}`)
            return response.data.data;
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['posts']);
            toast.success("Post deleted successfully");
            return;
        },
        onError:(error)=>{
            console.error(error);
            toast.error("Failed to delete post");
            return;
        }
    })

    const deletePostHandler=(id)=>{
        deletePostMutation.mutate(id);
    }
    return (
    <div>
        <button className="btn btn-ghost btn-circle " onClick={()=>document.getElementById('my_modal_2').showModal()}>Delete</button>
        <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Post</h3>
            <p className="py-4">Are you sure you want to Delete this post?</p>
            <div className="modal-action space-x-2">
            <form method="dialog" >
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-info">Close</button>
            </form>
            <button onClick={()=>deletePostHandler(post)}  
            className="btn bg-red-600">Delete</button>
            </div>
        </div>
        </dialog>  
    </div>
  )
}

export default DeletePostModal
