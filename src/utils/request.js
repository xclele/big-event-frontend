//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { useTokenStore } from '@/stores/token';
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀  ,  baseURL
const baseURL = '/api';
const instance = axios.create({baseURL})

//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //获取token
        const tokenStore = useTokenStore();
        //给请求头添加token
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    err=>{
        //请求错误使用把异步的状态转化成失败的状态
        return Promise.reject(err);
    }
)

import router from '@/router';

//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if (result.data.code === 0){
            return result.data;
        } else{
            ElMessage.error(result.data.message?result.data.message:'服务异常');
            return Promise.reject(result.data);
        }
    },
    err=>{
        //未登录，提示，并且跳转登录页面
        if (err.response.status === 401){
            ElMessage.info('请先登录');
            router.push('/login');
        }else{
            ElMessage.error('服务异常');
        }
        
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;