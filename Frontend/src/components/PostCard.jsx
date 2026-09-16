import React from 'react'
import { getFileView } from '../store/apiSlice'
import { Link } from 'react-router-dom'

function PostCard({ slug, title, featuredImage }) {
    const imageUrl = getFileView(featuredImage);

    return (
        <Link to={`/post/${slug}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4 text-center'>
                <div className='w-full justify-center mb-4'>
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className='rounded-xl w-full object-cover' />
                    ) : (
                        <div className='rounded-xl bg-gray-200 aspect-video' />
                    )}
                </div>
                <h2 className='text-xl font-bold'>{title}</h2>
            </div>
        </Link>
    )
}

export default PostCard
