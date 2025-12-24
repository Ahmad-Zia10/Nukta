import React from 'react'
import { useListPostsQuery } from '../store/apiSlice';
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Home() {
    const authStatus = useSelector((state) => (state.auth.status));
    const { data, isLoading } = useListPostsQuery({ status: 'active' });
    const posts = data?.posts || [];
  
    if (posts.length === 0 && !authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                <Link to={'/login'}>
                                Login to read posts
                                </Link>
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    else if (posts.length === 0 && authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                <Link to={'/login'}>
                                Nothing to show Here
                                </Link>
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post._id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home