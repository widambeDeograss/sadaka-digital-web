import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import  {store}  from "../store/Store";
import { DataBaseUrl } from "../Constants/BaseUrl";
import { REFRESH_TOKEN } from "../Constants/apiEndpoint";

// Defining Axios defaults
axios.defaults.baseURL = "http://localhost:3010";
axios.defaults.headers.post["Content-Type"] = "application/json";


// const state = store.getState();
// const accessToken = state.user.accessToken;

// Intercepting requests to add the Authorization header
axios.interceptors.request.use(
  (config: any) => {
    const state = store.getState();
    const accessToken = state.user.accessToken;
    
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  }
);

// Function to set Authorization header
const setAuthorization = (accessToken: string) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

// Intercepting to capture errors and handle token refresh
axios.interceptors.response.use(
  (response: AxiosResponse) => response?.data,
  async (error:any) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
  
      originalRequest._retry = true;
      const state = store.getState();
      const refreshToken = state.user.refreshToken;
      

      if (refreshToken) {
        try {
          const response = await axios.post(`${DataBaseUrl}${REFRESH_TOKEN}`, { refreshToken });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("authUser", newAccessToken); // Set new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest); // Retry the original request with new token
        } catch (err) {
          toast.warning("Session timed out, please login again", { autoClose: 2000 });
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

class APIClient {
  get = (url: string, params?: Record<string, any>,  responseType?: "blob" | "json"): Promise<AxiosResponse<any>> => {
    const queryString = params
      ? Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join("&")
      : "";
    return axios.get(`${url}${queryString ? `?${queryString}` : ""}`, {
      responseType: responseType || "json",
    });
  };

  create = async (url: string, data: any): Promise<AxiosResponse<any>> => {
    try {
      const response = await axios.post(url, data);
      console.log(response);
      
      return response;
    } catch (error:any) {
      console.error("API Client Create Error:", error.message);
      throw new Error(error.message);
    }
  };

  update = (url: string, data: any): Promise<AxiosResponse<any>> => {
    return axios.patch(url, data);
  };

  put = (url: string, data: any): Promise<AxiosResponse<any>> => {
    return axios.put(url, data);
  };

  delete = (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
    return axios.delete(url, config);
  };
}

export { APIClient, setAuthorization };
