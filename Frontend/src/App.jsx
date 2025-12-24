import { useEffect } from "react"
import {useDispatch} from "react-redux"
import { useLazyGetCurrentUserQuery } from "./store/apiSlice";
import { login, logout } from "./store/authSlice";
import Header from "./components/header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router";

function App() {
  // As soon as the site loads, we have to check whether the user is logged in or not

  const dispatch = useDispatch();
  const [getCurrentUser, { isLoading }] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    getCurrentUser()
      .unwrap()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log('Not authenticated:', error);
        dispatch(logout());
      });
  }, []);

  return !isLoading ? (
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
   (
    <div className="min-h-screen flex items-center justify-center bg-gray-400">
      <div className="text-center">
        <p className="text-xl">Loading...</p>
      </div>
    </div>
   )
 
}

export default App
