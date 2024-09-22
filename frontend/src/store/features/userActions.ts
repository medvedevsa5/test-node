/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';

import axios from 'axios';
import { AuthResponse } from '../../models/response/AuthResponse';
import { API_URL } from '../../http';

export const registerUser = createAsyncThunk(
    'user/register',
    async ({email, password}: {email: string, password: string}, {rejectWithValue}) => {
        try{
            const response = await AuthService.registration(email, password);
            return response.data;
        } catch(e: any) {
            if (e.response && e.response?.data?.message) {
                return rejectWithValue(e.response?.data?.message)
              } else {
                return rejectWithValue(e.message)
              }
        }
    }
)

export const loginUser = createAsyncThunk(
    'user/login',
    async ({email, password}: {email: string, password: string}, {rejectWithValue}) => {
        try{
            const response = await AuthService.login(email, password);
            return response.data;
        } catch(e: any) {
            if (e.response && e.response?.data?.message) {
                return rejectWithValue(e.response?.data?.message)
              } else {
                return rejectWithValue(e.message)
              }
        }
    }
)

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, {rejectWithValue}) => {
        try{
            await AuthService.logout();
        } catch(e: any) {
            if (e.response && e.response?.data?.message) {
                return rejectWithValue(e.response?.data?.message)
              } else {
                return rejectWithValue(e.message)
              }
        }
    }
)

export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, {rejectWithValue}) => {
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            return response.data;
        } catch(e: any) {
            if (e.response && e.response?.data?.message) {
                return rejectWithValue(e.response?.data?.message)
              } else {
                return rejectWithValue(e.message)
              }
        }
    }
)
