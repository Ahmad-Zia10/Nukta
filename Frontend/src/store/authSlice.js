import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // `false` until the session check against /api/auth/me has completed.
    // Guards must wait for this: before the check resolves, `status` is false
    // simply because we do not know yet, not because the user is signed out.
    checked: false,
    status: false,
    userData: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.checked = true;
            state.status = true;
            // Handle both formats: direct user object or {userData: user}
            state.userData = action.payload?.userData || action.payload;
        },
        logout: (state) => {
            state.checked = true;
            state.status = false;
            state.userData = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
