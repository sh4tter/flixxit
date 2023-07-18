import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "./AuthActions";

export const login = async (user, dispatch, isAdmin = false) => {
  dispatch(loginStart());
  try {
    let url = "auth/login";
    if (isAdmin) {
      url = "auth/admin";
    }
    const res = await axios.post(url, user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};
