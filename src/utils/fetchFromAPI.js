import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    token: localStorage.getItem("LOGIN_USER")
  },
};

// tạo một instance axios
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`
});

// thêm một interceptor để gắn access token vào headers trước mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    // kiểm tra flag requiredAuth của API
    if(config.requiredAuth) {
      // lấy access token từ localStorage
      const accessToken = localStorage.getItem("LOGIN_USER");
      if (accessToken) {
        config.headers["token"] = `${accessToken}`;
      }
    }
    return config;
  },
  (error) => {}
);

const extendToken = async () => {
  const {data} = await axiosInstance.post(`/auth/extend-token`, {}, {
    withCredentials: true // cho phép gửi và nhận cookie từ server
  })

  console.log("response data from api extend-token: ", data)

  // lưu access token mới vào localStorage
  localStorage.setItem("LOGIN_USER", data.data);

  return data;
}

// config interceptor cho response mỗi khi response API nào đó trả về 401
axiosInstance.interceptors.response.use(
  (response) => { return response}, // param function khi response API trả về 2xx
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401) {
      try {
        const data = await extendToken();
        console.log("data: ", data);
        // gán lại token mới vào headers
        originalRequest.headers["token"] = data.data;
        // call lại API 1 lần nữa
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log('Extend token failed', error);
      }
    }
  } // param function khi response API trả về khác 2xx
)

export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);

  return data;
};

export const getListVideo = async () => {
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-videos`);
  return data;
}

export const getType = async () => {
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-type`, {
    requiredAuth: true
  }, options);
  return data;
}

export const getVideoById = async (typeId) => {
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-video-type-by-id/${typeId}`);
  return data;
}

export const registerAPI = async (payload) => {
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/register`, payload);
  return data;
}

export const loginAPI = async (payload) => {
  console.log("get payload: ", payload)
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login`, payload, {
    withCredentials: true //cho phép gửi và nhận cookie từ server (BE)
  });
  return data;
}

export const loginAsyncKeyAPI = async (payload) => {
  console.log("get payload: ", payload)
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login-async-key`, payload, {
    withCredentials: true //cho phép gửi và nhận cookie từ server (BE)
  });
  return data;
}

export const loginFacebookAPI = async (newUser) => {
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login-face`, newUser);
  return data;
}

export const forgotPassAPI = async (email) => {
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/forgot-password`, email);
  return data;
}
