export interface IUser {
    _id: string,
    email: string,
    name: string,
    role: string,
    isVerify: boolean
}

export interface ILoginSocialMedia {
    email: string,
    type: string
}