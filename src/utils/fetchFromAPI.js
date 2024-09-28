import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
    // 'token': localStorage.getItem("LOGIN_USER")
  },
};



export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);

  return data;
};

export const getListVideo = async () => {
  const {data} = await axios.get(`${BASE_URL}/videos/get-videos`);
  return data;
}

export const getType = async () => {
  const {data} = await axios.get(`${BASE_URL}/videos/get-type`);
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

