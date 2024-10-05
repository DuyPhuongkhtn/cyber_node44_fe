import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
  },
};

// Tạo một instance của Axios
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  ...options, // Áp dụng các tùy chọn mặc định, như headers và params
});

// Thêm một interceptor để gắn access token vào headers trước mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.requiresAuth) {
      const token = localStorage.getItem('LOGIN_USER');
      if (token) {
        config.headers['token'] = `${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm làm mới access token bằng refresh token
const extendToken = async () => {
  try {
      const response = await axiosInstance.post('/auth/extend-token', {}, {
        withCredentials: true  // Cho phép gửi và nhận cookie từ server
      }); // Gửi yêu cầu làm mới token
      console.log("get response from api extend-token: ", response)
      const { data } = response.data;

      // Lưu access token mới vào localStorage hoặc state manager
      localStorage.setItem('LOGIN_USER', data);

      // Trả về access token mới
      return data;
  } catch (error) {
      console.error('Unable to refresh token', error);
      // Nếu không thể làm mới token, yêu cầu người dùng đăng nhập lại
      throw error;
  }
};

let failedAttempts = 0;
axiosInstance.interceptors.response.use(
  (response) => {
    failedAttempts = 0;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("error and extend token", error)

    // kiểm tra nếu lỗi là do token hết hạn
    if (error.response.status === 401 && !originalRequest._retry){
      console.log("testttt")
      originalRequest._retry = true;
      try {
        const newAccessToken = await extendToken();
        console.log("newAccessToken: ", newAccessToken)
        originalRequest.headers['token'] = newAccessToken;
        return axiosInstance(originalRequest);

      }catch (error) {
        console.log('Extend token failed', error);
      }
    }
  }
)



export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);

  return data;
};

export const getListVideo = async () => {
  const {data} = await axios.get(`${BASE_URL}/videos/get-videos`);
  return data;
}

export const getType = async () => {
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-type`,{
    requiresAuth: true, // Đánh dấu rằng yêu cầu này cần xác thực
  });
  return data;
}

export const getVideoById = async (typeId) => {
  const {data} = await axios.get(`${BASE_URL}/videos/get-video-type-by-id/${typeId}`);
  return data;
}

export const registerAPI = async (payload) => {
  const {data} = await axios.post(`${BASE_URL}/auth/register`, payload);
  return data;
}

export const loginAPI = async (payload) => {
  console.log("get payload: ", payload)
  const {data} = await axios.post(`${BASE_URL}/auth/login`, payload, {
    withCredentials: true  // Cho phép gửi và nhận cookie từ server
  });
  return data;
}

export const loginFacebookAPI = async (newData) => {

  const { data } = await axios.post(`${BASE_URL}/auth/login-face`, newData, options);

  return data;
};

