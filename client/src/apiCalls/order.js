import { axiosInstance } from ".";

export const addOrder = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/addOrder",
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
