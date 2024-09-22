import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../models/IUser";
import { loginUser, registerUser, logoutUser, checkAuth } from "./userActions";

export interface UserState {
    user: IUser,
    isAuth: boolean
}

const state: UserState = {
    user: {
        email: '',
        isActivated: false,
        id: '',
    },
    isAuth: false
}

export const userSlice = createSlice({
    name: "user",
    initialState: state,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.refreshToken);
            state.user = action.payload.user;
            state.isAuth = true;
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.refreshToken);
            state.user = action.payload.user;
            state.isAuth = true;
        })
        builder.addCase(logoutUser.fulfilled, (state) => {
            localStorage.removeItem('token');
            state.user = {} as IUser;
            state.isAuth = false;

        })
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload.refreshToken);
            state.user = action.payload.user;
            state.isAuth = true;
        })
    }
})
