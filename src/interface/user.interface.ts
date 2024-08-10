export interface IUser {
    _id: string,
    email: string,
    name: string,
    role: string
}

export interface ILoginSocialMedia {
    email: string,
    type: string
}