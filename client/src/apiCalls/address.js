import { axiosInstance } from ".";

export const addAddress = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/addAddress",
      payload
    );
    return response.data;
  } catch (error) {
    return "error while creating address" || error.message;
  }
};
