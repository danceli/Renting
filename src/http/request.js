import axios from 'axios';
import { getToken, isAuth, removeToken } from '@/utils/auth';

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const service = axios.create({
  // timeout: 5000
});


service.interceptors.request.use((config) => {
  const { url } = config;
  if(url.startsWith("/user") && !url.startsWith("/user/login") && !url.startsWith("/user/registered")) {
    config.headers["Authorization"] = getToken();
  }
  //在请求发送前配置些什么, 例如token

  return config;
}, error => {
  console.log(error)
  return Promise.reject(error);
});

service.interceptors.response.use((response) => {
  if(response.data.status !== 200) {
    //说明请求失败,移除token
    removeToken();
  }
  return response;
}, error => {
  return Promise.reject(error);
});

export default service;


//1.判断接口路径是否是以/user开头的，并且不是登录或注册接口
//2.如果是，加上请求头Authorization
//3.添加相应拦截
//4.判断返回值中的状态码
//5.如果是404,表示token超时或异常，直接移除token