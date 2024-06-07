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
