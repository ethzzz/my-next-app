import { createPersistStore } from "@/utils/store";

type User = {
    id: string
    name: string
    avatar?:string
    token: string
    isLogin: boolean
}

const USER_STATE: User = {
    id: '',
    name: '',
    avatar: '',
    token: '',
    isLogin: false
}

type UserMethods = {
    getUserInfo:() => User
    setUserInfo: (user: User) => void
    setToken: (token: string) => void
    getToken:() => string
}

export const useUserStore = createPersistStore<
    User,
    UserMethods
>(
    USER_STATE,
    (set,_get)=>{
        return {
            getUserInfo: () => _get(),
            setUserInfo: (user) => set(user),
            setToken: (token) => set({ token }),
            getToken: () => _get().token
        }
    },
    {
        name: 'user',
    }
)