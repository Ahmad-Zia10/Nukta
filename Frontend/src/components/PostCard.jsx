import React from 'react'
import appwriteService from '../appwrite/bucket'
import { Link } from 'react-router-dom'

function PostCard({
   $id,
   title,
   featuredImage
}) {
    const review = appwriteService.getFileView(featuredImage);
    console.log("Get File Preview:",review);
    console.log("File review href ", review.href);
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4 text-center'>
            <div className='w-full justify-center mb-4'>
                <img src={review.href} alt={title}
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