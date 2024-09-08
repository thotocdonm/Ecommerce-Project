export interface IUser {
    _id: string,
    email: string,
    name: string,
    address: string,
    phone: string,
    role: string,
    isVerify: boolean,
    type: string
}

export interface ILoginSocialMedia {
    email: string,
    type: string
}