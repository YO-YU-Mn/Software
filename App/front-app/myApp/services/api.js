import axios from "axios"
import { API_BASE_URL } from '../config'

export const login = async (email,password) => {

return axios.post(`${API_BASE_URL}/login`,{
email,
password
})

}