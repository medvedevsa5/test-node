import { ILink } from "../ILink"

export interface LinkQueryResponse {
    links: ILink[];
    isEnded: boolean;
}

export interface LinkCreationResponse {
    link: ILink;
}

export type GetFullLinkResponse = string;