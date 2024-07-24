import { axiosInstance } from ".";
export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/register",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/app/v1/users/login", payload);
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/app/v1/users/getCurrentUser");
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};

export const addReceiverDetails = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/addReceiverDetails",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};

export const getReceiverDetails = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/getReceiverDetails",
      payload
    );
    return response.data;
  } catch (error) {
    return error || "cannot get receiver details";
  }
};

export const updateUserProfile = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/updateUserProfile",
      payload
    );
    return response.data;
  } catch (error) {
    return error || "cannot update user profile";
  }
};

export const googleAuth = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/googleAuthentication",
      payload
    );
    return response.data;
  } catch (error) {
    return error || "cannot sign in with google";
  }
};
