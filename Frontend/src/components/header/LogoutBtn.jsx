import React from 'react'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../store/apiSlice'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom';

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutUser, { isLoading }] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutUser().unwrap();
        } catch {
            // The request can fail while the cookie has already been cleared,
            // and staying "signed in" locally is worse than a redundant logout.
            // Clear client state either way.
        } finally {
            dispatch(logout());
            navigate('/login', { replace: true });
        }
    };

    return (
        <button
            className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full disabled:opacity-50'
            onClick={logoutHandler}
            disabled={isLoading}
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    )
}

export default LogoutBtn
