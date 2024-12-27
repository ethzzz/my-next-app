import webpack from 'webpack';

const mode = process.env.BUILD_MODE ?? 'standalone'    

// 是否需要分包
const disableChunk = !!process.env.DISABLE_CHUNK || mode === 'export'

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config){
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack']
        })
        if(disableChunk){
            new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
        }

        config.resolve.fallback = {
            child_process: false
        }

        return config;
    },
    output: mode,
    images:{
        unoptimized: true
    },
    experimental:{
        forceSwcTransforms: true
    },
    // 生成静态文件
    transpilePackages: ['@ant-design/icons',"antd","@babel"],
};

const CorsHeaders = [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,POST,PUT" },
    { key: "Access-Control-Allow-Headers", value: "Content-Type" },
    { key: "Access-Control-Allow-Headers", value: "X-Requested-With" },
    { key: "Access-Control-Allow-Headers", value: "Authorization" },
    { key: "Access-Control-Allow-Headers", value: "Origin, X-Requested-With, Content-Type, Accept" },
    { key: "Access-Control-Max-Age", value: "86400" },
]

if(mode !== "export"){
    nextConfig.headers = async()=>{
        return [
            {
                source: '/api/:path*',
                headers: CorsHeaders
            }
        ]
    }
    // 请求转发
    nextConfig.rewrites = async ()=>{
        const ret = [
            {
                source: '/api/proxy/v1/:path*',
                destination: 'https://api.openai.com/v1/:path*'
            },
            {   
                // 代理转发到本地
                source: '/api/proxy/local/:path*',
                destination: 'http://127.0.0.1:3000/api/:path*'
            }
        ]
        return {
            beforeFiles: ret
        }
    }
}

export default nextConfig;
