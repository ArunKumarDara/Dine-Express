import { axiosInstance } from ".";

export const addMenuItem = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/addMenuItem",
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getMenuItems = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/getMenuItemsByRestaurant",
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
