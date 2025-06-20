import { createPersistStore } from "../utils/store";

type User = {
    id: string
    username: string
    avatar?:string
    token: string | null
    isLogin: boolean
}

const USER_STATE: User = {
    id: '',
    username: '',
    avatar: '',
    token: '',
    isLogin: false
}

type UserMethods = {
    login: (username: string, password: string) => Promise<any>
    getInfo: () => void
    getUserInfo:() => User
    setUserInfo: (user: User) => void
    setToken: (token: string) => void
    getToken:() => string | null
    logOut: () => void
}

export const useUserStore = createPersistStore<
    User,
    UserMethods
>(
    USER_STATE,
    (set,_get)=>{
        function get() {
            return {
              ..._get(),
              ...methods,
            };
          }
        const methods = {
            getUserInfo: () => _get(),
            setUserInfo: (user:User) => set(user),
            login: async (username: string, password: string) => {
                const res = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password })}
                )
                const data = await res.json()
                if(data.code !== 0) return Promise.reject(data.msg)
                get().setUserInfo({...data.data,isLogin:true})
                return Promise.resolve(data)
            },
            getInfo: async()=>{

            },
            setToken: (token: string | null) => set({ token }),
            getToken: () => _get().token,
            logOut: ()=>{
                set({ id:'', username: '', avatar: '', token: '', isLogin: false })
                console.log(_get())
            }
        }
        return methods
    },
    {
        name: 'user',
    }
)