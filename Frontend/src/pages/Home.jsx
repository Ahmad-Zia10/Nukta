import React, { useState } from 'react'
import { useListPostsQuery } from '../store/apiSlice';
import {Container, PostCard, Pagination} from '../components'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Home() {
    const authStatus = useSelector((state) => (state.auth.status));
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching } = useListPostsQuery({ page });
    const posts = data?.posts || [];
    const totalPages = data?.totalPages || 1;

    // Without this, the initial render (posts still empty, request in flight)
    // shows the "Login to read posts" prompt to every visitor for a moment.
    if (isLoading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <p className="text-xl">Loading posts...</p>
                </Container>
            </div>
        );
    }

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
                <div className={`flex flex-wrap ${isFetching ? 'opacity-60' : ''}`}>
                    {posts.map((post) => (
                        <div key={post._id} className='p-2 w-full sm:w-1/2 lg:w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    className='mt-8'
                />
            </Container>
        </div>
    )
}

export default Home