import { axiosInstance } from ".";

export const getDashBoardDetails = async () => {
  try {
    const response = await axiosInstance.get("/app/v1/admin/dashboard");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getOrderStatusDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/app/v1/admin/orderStatusDistribution"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
