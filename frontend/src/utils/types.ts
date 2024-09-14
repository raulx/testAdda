interface UserData {
    _id:string,
    email:string,
    username:string,
    avatar_url:string,
    is_subscribed:boolean,
    createdAt:string,
    updatedAt:string
}

interface ApiResponseType<T = unknown> {
    statusCode:number,
    data:T,
    message:string,
    success:boolean
}


export type {ApiResponseType,UserData}