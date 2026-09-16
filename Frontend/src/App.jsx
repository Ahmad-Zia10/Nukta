import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLazyGetCurrentUserQuery } from "./store/apiSlice";
import { login, logout } from "./store/authSlice";
import Header from "./components/header/Header"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router";

function App() {
  const dispatch = useDispatch();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  // Render nothing meaningful until the session check has finished. Route
  // guards read the same flag, so they never redirect on a not-yet-known state.
  const authChecked = useSelector((state) => state.auth.checked);

  useEffect(() => {
    // A 401 is the normal "not signed in" response and rejects the promise,
    // so both outcomes have to be handled.
    getCurrentUser()
      .unwrap()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [getCurrentUser, dispatch]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-400">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App
