import axios from "axios"

const API = "http://192.168.1.5:9000";


const BASE_URL = 'http://10.0.2.2:9000';


export const login = async (email,password) => {

return axios.post(`${API}/login`,{
email,
password
})
}


export const loginUser = async (code, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { code, password });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};