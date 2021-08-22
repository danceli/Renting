import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const service = axios.create({
  // timeout: 5000
});


service.interceptors.request.use((config) => {
  //在请求发送前配置些什么, 例如token

  return config;
}, error => {
  console.log(error)
  return Promise.reject(error);
});

service.interceptors.response.use((response) => {
  return response;
}, error => {
  return Promise.reject(error);
});

export default service;