import { axiosInstance } from ".";

export const addRestaurant = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/addRestaurant",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};