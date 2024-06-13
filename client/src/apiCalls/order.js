import { axiosInstance } from ".";

export const addOrder = async ({
  totalAmount,
  user,
  restaurant,
  orderItems,
}) => {
  const payload1 = { totalAmount, user, restaurant };
  const payload2 = orderItems;
  try {
    const response = await axiosInstance.post("/app/v1/users/addOrder", {
      payload1,
      payload2,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getOrdersByUserId = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/users/getOrdersByUserId",
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
