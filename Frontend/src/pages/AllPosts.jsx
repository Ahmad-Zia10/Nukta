import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/configure'
import { PostCard , Container} from '../components'


function AllPosts() {

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        appwriteService.listPosts([]).then((posts) => {
            if(posts) {
                setPosts(posts.documents);
                console.log("Posts in AllPosts is:",posts);
                
            }
        })
        .catch((e) => (console.log(e.message))) ;
    },[])


  return (
    <>
    <div className='w-full py-8'>
        <Container className={"flex"}>
        <div className='w-3/4 flex flex-col gap-8 mx-auto'>
        {posts.map((post) => (
            <div key={post.$id} >
                
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