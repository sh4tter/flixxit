import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import { axiosInstance } from "../axiosInstance";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    console.error("Login API error:", err.response?.data || err.message);
    dispatch(loginFailure());
    
    // Re-throw the error with more specific information
    if (err.response?.status === 401) {
      throw new Error("Invalid email or password");
    } else if (err.response?.status === 400) {
      throw new Error("Please provide valid email and password");
    } else if (err.response?.status === 500) {
      throw new Error("Server error. Please try again later");
    } else if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
      throw new Error("Connection failed. Please check your internet connection");
    } else {
      throw new Error("Login failed. Please try again");
    }
  }
};

export const register = async (userData) => {
  try {
    const res = await axiosInstance.post("auth/register", userData);
    return res.data;
  } catch (err) {
    console.error("Registration API error:", err.response?.data || err.message);
    
    // Re-throw the error with more specific information
    if (err.response?.status === 400) {
      const errorMessage = err.response?.data?.message || "Invalid registration data";
      throw new Error(errorMessage);
    } else if (err.response?.status === 409) {
      const errorMessage = err.response?.data?.message || "Email or username already exists";
      throw new Error(errorMessage);
    } else if (err.response?.status === 500) {
      throw new Error("Server error. Please try again later");
    } else if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
      throw new Error("Connection failed. Please check your internet connection");
    } else {
      throw new Error("Registration failed. Please try again");
    }
  }
};
