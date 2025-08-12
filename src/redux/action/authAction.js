import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "./actionType";
import toast from "react-hot-toast";
import { server_url } from "../../utils/Helper";

// Action to initiate login request
export const loginRequest = () => ({
  type: LOGIN_REQUEST,
});

// Action for login success
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

// Action for login failure
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const login = (email, password, navigate) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await axios.post(server_url + "/api/users/login", {
        email,
        password,
      });
      const { userDetails, success, role } = response.data;

      if (success) {
        // Store token and user details in localStorage
        localStorage.setItem(
          "@@toke_$$_45598",
          JSON.stringify(userDetails.user_id)
        );
        localStorage.setItem("user", JSON.stringify(userDetails));

        // Dispatch login success action
        dispatch(loginSuccess(userDetails));

        // Navigate to the appropriate dashboard based on role
        if (role === "vendor") {
          toast.success("Logged in successfully");
          navigate("/seller-dashboard");
        } else if (role === "admin") {
          toast.success("Logged in successfully");
          navigate("/admin-dashboard");
        } else {
          toast.error("User not found");
        }

        return userDetails; // Return user details for unwrap()
      } else {
        toast.error(response.data.message);
        dispatch(loginFailure(response.data.message));
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
      throw error;
    }
  };
};

// Action to logout
export const logout = () => {
  localStorage.removeItem("@@toke_$$_45598");
  localStorage.removeItem("user");
  return { type: LOGOUT };
};
