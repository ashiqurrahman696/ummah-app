import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://ummahapi.com",
    headers: {
        "X-API-Key": process.env.UMMAH_API_KEY
    }
});

const useAxios = () => {
    return axiosInstance;
}

export default useAxios;