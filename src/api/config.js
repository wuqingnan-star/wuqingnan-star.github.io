import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('响应数据:', response.data);
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error);
    
    // 统一错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;
      console.error(`请求失败: ${status}`, data);
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('网络错误: 没有收到响应');
    } else {
      // 发送请求时出了点问题
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
