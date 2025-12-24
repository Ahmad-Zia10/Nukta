import React from 'react'
import { getFileView } from '../store/apiSlice'
import { Link } from 'react-router-dom'

function PostCard({
   _id,
   slug,
   title,
   featuredImage
}) {
    const imageUrl = getFileView(featuredImage);
    
  return (
    <Link to={`/post/${slug}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4 text-center'>
            <div className='w-full justify-center mb-4'>
                <img src={imageUrl} alt={title}
                className='rounded-xl' />

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard