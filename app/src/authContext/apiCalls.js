import { loginFailure, loginStart, loginSuccess } from "./AuthActions";
import { axiosInstance } from "../axiosInstance";

export const login = async (user, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};
