import axios from 'axios'

// 创建axios实例，设置默认配置
class NAxios {
    private instance: any
    getInstance(){
        if(this.instance){
            return this.instance
        }
        this.instance = axios.create({
            baseURL: '/api',
            timeout: 10000
        })
        return this.instance
    }

    // 请求拦截
    public requestInterceptor = (config: any) => {
        return config
    }

    // 响应拦截
    public responseInterceptor = (res: any) => {
        return res
    }

    public request = (config: any) => {
        this.instance.interceptors.request.use(this.requestInterceptor)
        this.instance.interceptors.response.use(this.responseInterceptor)
        return this.instance(config)
    }

    public get = (url: string, config?: any) => {
        return this.request({
            url,
            method: 'get',
            ...config
        })
    }

    public post = (url: string, config?: any) => {
        return this.request({
            url,
            method: 'post',
            ...config
        })
    }

    public put = (url: string, config?: any) => {
        return this.request({
            url,
            method: 'put',
            ...config
        })
    }
}

export const nAxiosInstance = new NAxios();
export const http = nAxiosInstance.getInstance();