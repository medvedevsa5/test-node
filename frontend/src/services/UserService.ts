import { AxiosResponse } from "axios";
import $api from "../http";
import { LinkCreationResponse, LinkQueryResponse, GetFullLinkResponse } from "../models/response/LinkResponse";

export default class UserService {
    static async getLinks(cursor: number) : Promise<AxiosResponse<LinkQueryResponse>>{
        return await $api.get<LinkQueryResponse>('/links', {params: {cursor}});
    }

    static async getShortened(link: string) : Promise<AxiosResponse<LinkCreationResponse>>{
        return await $api.post<LinkCreationResponse>('/links', {link});
    }

    static async getFull(link: string) : Promise<AxiosResponse<GetFullLinkResponse>> {
        return await $api.get<string>(`/ac`, {params: {link}});
    }
}