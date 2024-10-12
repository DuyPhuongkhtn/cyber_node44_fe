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

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`
})

// thêm một interceptor để gắn access token vào header trước mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    if(config.requiredAuth) {
      const token = localStorage.getItem('LOGIN_USER');
      if (token) {
        config.headers["token"] = `${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

const extendToken = async () => {
  let {data} = await axiosInstance.post(`/auth/extend-token`, {}, {
    withCredentials: true
  });

  // lưu newAccessToken mới vào localStorage
  localStorage.setItem("LOGIN_USER", data.data);
  return data.data;
}

// custom response để thực hiện flow refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  }, // khi response có status code là 2xx 
  async (error) => {
    const originalRequest = error.config;
    // console.log("error and extend token: ", error);

    if (error.response.status === 401) {
      // call API extend-token để tạo access token mới
      const newAccessToken = await extendToken();
      // console.log("newAccessToken: ", newAccessToken)
      originalRequest.headers["token"] = newAccessToken;
      return axiosInstance(originalRequest);
    }
  } // khi response có status code khác 2xx
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
  const {data} = await axiosInstance.get(`${BASE_URL}/videos/get-type`, {requiredAuth: true}, options);
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
    withCredentials: true //cho phép gửi và nhận cookie từ server
  });
  return data;
}

export const loginFacebookAPI = async (newUser) => {
  const {data} = await axiosInstance.post(`${BASE_URL}/auth/login-face`, newUser);
  return data;
}

export const forgetCheckMailAPI = async (newData) => {

  const { data } = await axios.post(`${BASE_URL}/auth/forget-check-email`, newData, options);

  return data;
};


export const changePassAPI = async (newData) => {

  const { data } = await axios.post(`${BASE_URL}/auth/change-password`, newData, options);

  return data;
};
