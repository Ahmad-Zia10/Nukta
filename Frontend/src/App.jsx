import { useEffect, useState } from "react"
import {useDispatch} from "react-redux"
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import Header from "./components/header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router";

function App() {
  // As soon as the site loads, we have to check whehther the user is logged in or not.If he is ,then only we will show the posts and articles, otherwise we can show the user things like about the site, home page ,etc.

  const [loading, setLoading] = useState(true);//whenever we are fetching/retrieving data from database/network, we should create a loading state.If true-show loading icon , else show data

  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
          dispatch(login({userData}));// an object should be passed to login() , now {userData:userData} this is the way we should have passed it, but in authSlice we have handled it in such a way key value is same.
      } else {
        dispatch(logout());
      }
    })
    .catch((error) => {
      console.log(`Error  ${error} fetching data from database ::`);
      
    })
    .finally(() => {
      setLoading(false)
    })
  },[])

  return !loading ? (
    <>
    <div className="min-h-screen flex flex-wrap 
    content-between bg-gray-400">
      <div className="w-full block">
      <Header/>
      <main>
       <Outlet />
      </main>
      <Footer/>
    </div>
    </div>
    </>
  )
   : 
   <>
   <span className="loading loading-dots loading-xs"></span>
   <span className="loading loading-dots loading-sm"></span>
   <span className="loading loading-dots loading-md"></span>
   <span className="loading loading-dots loading-lg"></span>
   <span className="loading loading-dots loading-xl"></span>
   </>
 
}

export default App
