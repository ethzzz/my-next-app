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
    login: (username: string, password: string) => Promise<void>
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
            login: async (username, password) => {
                fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password })}
                )
            },
            setToken: (token) => set({ token }),
            getToken: () => _get().token
        }
    },
    {
        name: 'user',
    }
)