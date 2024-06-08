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

export const getUserRestaurants = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/getRestaurantsByOwner",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};

export const updateRestaurant = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/editRestaurant",
      payload
    );
    return response.data;
  } catch (error) {
    return error.response.data || error;
  }
};
