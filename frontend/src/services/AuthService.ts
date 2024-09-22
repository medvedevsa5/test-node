import $api, { API_URL } from "../http";

import axios, { AxiosResponse } from "axios";

import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {email, password});
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password});
    }

    static async logout(): Promise<void> {
        return $api.post('/logout');
    }

    static async requestChangePassword(email: string): Promise<AxiosResponse> {
        return $api.post('/request-reset', {email});
    }

    static async changePassword(token: string, userId: string, password: string) : Promise<AxiosResponse> {
        return await axios.post(`${API_URL}/resetpw`, {token, userId, password});
    }
}