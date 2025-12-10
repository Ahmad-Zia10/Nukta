import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData : null,
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        login : (state, actions) => {
            state.status = true;
            // Handle both formats: direct user object or {userData: user}
            state.userData = actions.payload.userData || actions.payload;
        },
        logout : (state) => {
            state.status = false;
            state.userData = null;
        }
    }
}
)

export const {login, logout} = authSlice.actions;

export default authSlice.reducer