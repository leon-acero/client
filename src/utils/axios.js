import axios from "axios";
		
  // export const BASE_URL = 'http://127.0.0.1:8000';
  export const BASE_URL = 'https://eljuanjo-dulces.onrender.com';

  export default axios.create ({
    baseURL: BASE_URL,
    withCredentials: true
  })
