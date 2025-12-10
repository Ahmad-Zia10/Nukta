import React from 'react'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../store/apiSlice'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router';

function LogoutBtn() {

    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const [logoutUser] = useLogoutMutation();
    

    const logoutHandler = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error('Logout error:', error);
        }
    }


  return (
    <button
    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
    onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn