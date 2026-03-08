import axios from "axios"

const API = "http://192.168.1.5:3000"

export const login = async (email,password) => {

return axios.post(`${API}/login`,{
email,
password
})

}