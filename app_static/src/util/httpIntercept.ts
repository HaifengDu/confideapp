import { AxiosStatic, AxiosRequestConfig } from "axios";
import store from '../store'
export default function(axios:AxiosStatic){

    // // add a request interceptor
    axios.interceptors.request.use((config:AxiosRequestConfig)=> {
        // do something before request is sent
        if(!config.params){
          config.params = {};
        }
        config.params.userid = store.getters.user.id;
        return config;
      // tslint:disable-next-line:typedef
      }, function (error:Error) {
        // do something with request error
        return Promise.reject(error);
      });
    axios.interceptors.response.use(resp=>{
        const data = resp.data;
        if(!data.success){
            //提示错误
        }
        return resp;
    }, (error) => {
        // 当返回错误时
        if (axios.isCancel(error)) {
            return Promise.reject(new Error('请求被取消'))
        }
        if ('code' in error && error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('请求超时'))
        }
        return Promise.reject(error)
    })
}
