import React from 'react'
import { useListPostsQuery } from '../store/apiSlice'
import { PostCard , Container} from '../components'


function AllPosts() {
    const { data, isLoading, isError, error } = useListPostsQuery({ status: 'active' });
    const posts = data?.posts || [];


  if (isLoading) {
    return (
      <div className='w-full py-8 text-center'>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full py-8 text-center'>
        <p className='text-red-500'>Error loading posts: {error?.message}</p>
      </div>
    );
  }

  return (
    <>
    <div className='w-full py-8'>
        <Container className={"flex"}>
        <div className='w-3/4 flex flex-col gap-8 mx-auto'>
        {posts.map((post) => (
            <div key={post._id} >
                <PostCard {...post}/>
            </div>
        ))}
        </div>
        </Container>
    </div>
    </>
  )
}

export default AllPosts