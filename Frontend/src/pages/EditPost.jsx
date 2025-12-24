import React from 'react'
import { Container, PostForm } from '../components'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetPostQuery } from '../store/apiSlice';


function EditPost() {
    const navigate = useNavigate();
    const {slug} = useParams();
    const { data: post, isLoading, isError } = useGetPostQuery(slug, {
        skip: !slug,
    });

    if (!slug) {
        navigate('/');
        return null;
    }

    if (isLoading) {
        return (
            <div className='py-8 text-center'>
                <p>Loading post...</p>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className='py-8 text-center'>
                <p className='text-red-500'>Error loading post</p>
            </div>
        );
    }

  return (
    <div className='py-8'>
        <Container>
            <PostForm post={post}/>
        </Container>
    </div>
  );
}

export default EditPost