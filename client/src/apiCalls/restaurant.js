import { axiosInstance } from ".";

export const getAllActiveRestaurants = async () => {
  try {
    const response = await axiosInstance.get(
      "/app/v1/users/getAllActiveRestaurants"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllRestaurants = async () => {
  try {
    const response = await axiosInstance.get("/app/v1/admin/getAllRestaurants");
    return response.data;
  } catch (error) {
    return error;
  }
};

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

export const deleteRestaurant = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/deleteRestaurant",
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const actionOnRestaurant = async (restaurant) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/admin/actionOnRestaurant",
      restaurant
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
