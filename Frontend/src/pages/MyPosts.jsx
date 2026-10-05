import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetMyPostsQuery, getFileView } from '../store/apiSlice'
import { Container, Button, Pagination } from '../components'

/**
 * The author's own posts, drafts included.
 *
 * This is the only place unpublished posts are reachable: the public listing
 * returns published posts only, and fetching a draft by slug 404s for anyone
 * but its author.
 */
function MyPosts() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error, isFetching } = useGetMyPostsQuery({ page });

    const posts = data?.posts || [];
    const totalPages = data?.totalPages || 1;

    if (isLoading) {
        return (
            <div className='w-full py-8 text-center'>
                <Container><p className='text-xl'>Loading your posts...</p></Container>
            </div>
        );
    }

    if (isError) {
        return (
            <div className='w-full py-8 text-center'>
                <Container>
                    <p className='text-red-600'>
                        {error?.data?.message || error?.error || 'Could not load your posts'}
                    </p>
                </Container>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className='w-full py-8 text-center'>
                <Container>
                    <h1 className='text-2xl font-bold mb-4'>You have not written anything yet</h1>
                    <Link to='/add-post'>
                        <Button>Write your first post</Button>
                    </Link>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-2xl font-bold'>
                        My Posts <span className='text-base font-normal text-gray-700'>({data?.total ?? posts.length})</span>
                    </h1>
                    <Link to='/add-post'><Button size='sm'>New post</Button></Link>
                </div>

                <div className={`flex flex-col gap-4 ${isFetching ? 'opacity-60' : ''}`}>
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className='flex items-center gap-4 bg-gray-100 rounded-xl p-4'
                        >
                            <div className='w-28 shrink-0'>
                                {post.featuredImage ? (
                                    <img
                                        src={getFileView(post.featuredImage)}
                                        alt={post.title}
                                        className='rounded-lg w-28 h-20 object-cover'
                                    />
                                ) : (
                                    <div className='rounded-lg w-28 h-20 bg-gray-200' />
                                )}
                            </div>

                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <h2 className='text-lg font-bold truncate'>{post.title}</h2>
                                    <span
                                        className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                                            post.status === 'active'
                                                ? 'bg-green-200 text-green-900'
                                                : 'bg-amber-200 text-amber-900'
                                        }`}
                                    >
                                        {post.status === 'active' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <p className='text-sm text-gray-600 truncate'>/{post.slug}</p>
                            </div>

                            <div className='flex gap-2 shrink-0'>
                                <Link to={`/post/${post.slug}`}>
                                    <Button size='sm' variant='ghost'>View</Button>
                                </Link>
                                <Link to={`/edit-post/${post.slug}`}>
                                    <Button size='sm' variant='green'>Edit</Button>
                                </Link>
                            </div>
                        </article>
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

export default MyPosts
