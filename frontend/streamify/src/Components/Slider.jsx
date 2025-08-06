import React, { useState } from 'react';
import { HeartIcon, EllipsisVerticalIcon } from 'lucide-react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast';
import { axiosInstance } from '../utils/axios';
import PageLoader from './PageLoader';
import { useLocation } from 'react-router-dom';
import DeletePostModal from './DeletePostModal';
const Slider = ({ posts }) => {
  const queryClient=useQueryClient();
  const [current, setCurrent] = useState(0);
  const n = posts.length;
  const {pathname}=useLocation();
  const endpoint=pathname.substring(pathname.lastIndexOf('/')+1);
  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + n) % n);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % n);
  };

  const currPostId=posts[current]._id;

  const {data:likes,isLoading,error}=useQuery({
    queryKey:['likes',currPostId],
    queryFn:async()=>{
      try {
        const response=await axiosInstance.get(`likes/get-likes/${currPostId}`);
        return response.data.data;
      } catch (error) {
        console.error(error);
      }
    }    
  })

    const likeMutation = useMutation({
      mutationFn: async (id) => {
        const response = await axiosInstance.post(`likes/toggle-like/${id}`);
        return response.data;
      },
      onMutate: async (postId) => {
        await queryClient.cancelQueries(['likes', postId]);

        const previous = queryClient.getQueryData(['likes', postId]);

        queryClient.setQueryData(['likes', postId], (old) => {
          if (!old) return old;

          return {
            ...old,
            isLiked: !old.isLiked,
            likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
          };
        });

        return { previous };
      },
      onError: (err, postId, context) => {
        if (context?.previous) {
          queryClient.setQueryData(['likes', postId], context.previous);
        }
        toast.error("Failed to Like Video");
      },
      onSettled: (_, __, postId) => {
        queryClient.invalidateQueries(['likes', postId]);
      },
    });


    const toggleLikeHandler=(id)=>{
      likeMutation.mutate(id);
    }

    if(isLoading){
      return <PageLoader/>
    }


  return (
    <div className="w-full sm:w-[100%] md:w-[90%] lg:w-[80%] h-[400px] sm:h-[440px] md:h-[480px] overflow-hidden relative mx-auto rounded-xl bg-info">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {posts.map((post, index) => (
          <div
            key={index}
            className="min-w-full flex-shrink-0 relative h-full flex items-center justify-center bg-info"
          >
            <img
              src={post.image}
              alt={`Slide ${index + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            {endpoint==="my-profile"?            
            <div className='absolute top-3 right-4'>
                <details className="dropdown">
                  <summary className="btn m-1 bg-base-content/20 border-none rounded-full "><EllipsisVerticalIcon size={15}/></summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li><DeletePostModal post={currPostId}/></li>
                  </ul>
                </details>
            </div>:""}
            <div className='absolute bottom-2 left-5 flex items-center gap-2.5'>
              <HeartIcon onClick={()=>toggleLikeHandler(currPostId)}
              className={`hover:cursor-pointer size-10 fill-current ${likes.isLiked ? 'text-red-500' : 'text-white'}`} />

              <span className='text-white text-lg font-light z-10'>{likes.likesCount} like</span>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="btn btn-circle btn-sm sm:btn-md absolute top-1/2 left-4 transform -translate-y-1/2 z-10"
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="btn btn-circle btn-sm sm:btn-md absolute top-1/2 right-4 transform -translate-y-1/2 z-10"
      >
        ❯
      </button>
    </div>
  );
};

export default Slider;
