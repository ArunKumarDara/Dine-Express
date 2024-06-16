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

export const getAllAddressByUser = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/getAllAddressByUser",
      payload
    );
    return response.data;
  } catch (error) {
    return error || error.message;
  }
};

export const editAddress = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/editAddress",
      payload
    );
    return response.data;
  } catch (error) {
    return error || error.message;
  }
};

export const deleteAddress = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/deleteAddress",
      payload
    );
    return response.data;
  } catch (error) {
    return error || error.message;
  }
};

export const getPrimaryAddress = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/getPrimaryAddress",
      payload
    );
    return response.data;
  } catch (error) {
    return error || error.message;
  }
};
