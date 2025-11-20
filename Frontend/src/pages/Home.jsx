import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/configure";
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Home() {
    const [posts, setPosts] = useState([])
    const authStatus = useSelector((state) => (state.auth.status));
    useEffect(() => {
        appwriteService.listPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [authStatus])
  
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
                        <div key={post.$id} className='p-2 w-1/4'>
                            {console.log("Single Post is ",{...post})}
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home