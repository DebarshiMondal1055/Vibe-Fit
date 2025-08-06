import React, { useState } from 'react';
import { UploadIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';

const AddPostModal = () => {
  const queryClient=useQueryClient();  
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption,setCaption]=useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadPostMutation=useMutation({
    mutationFn:async(form)=>{
        const response=await axiosInstance.post("posts/upload",form);
        return response.data.data;
    },
    onSuccess:()=>{
        queryClient.invalidateQueries(['posts']);
        toast.success("Post Added");
        return;
    },
    onError:()=>{
        toast.error("Failed to upload post");
        return;
    }
  })

  const uploadPostHandler=()=>{
    const form=new FormData();
    form.append("caption",caption);
    form.append("image",selectedFile);
    uploadPostMutation.mutate(form)
  }

  return (
    <div>
      {/* Trigger button */}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => document.getElementById('add_post_modal').showModal()}
      >
        <UploadIcon />
      </button>

      {/* Modal */}
      <dialog id="add_post_modal" className="modal">
        <div className="modal-box w-full max-w-md">
          <h3 className="font-bold text-xl mb-4 text-center">Add a New Post</h3>

          <div className="flex flex-col gap-4">
            {/* File Upload */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Upload Image/Video</label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500">Max size: 2MB</p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Caption</label>
              <textarea
                onChange={(e)=>setCaption(e.target.value)}
                className="textarea textarea-bordered resize-none"
                placeholder="Say something about this post..."
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action justify-between mt-6">
            <form method="dialog">
              <button className="btn btn-outline">Cancel</button>
            </form>
            <button onClick={uploadPostHandler}
             className="btn btn-info" disabled={!selectedFile}>
              Add Post
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddPostModal;
