import { axiosInstance } from ".";

export const addOrder = async ({
  totalAmount,
  user,
  restaurant,
  deliverTo,
  orderItems,
}) => {
  const payload1 = { totalAmount, user, restaurant, deliverTo };
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

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get("/app/v1/admin/getAllOrders");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.post(
      "/app/v1/admin/updateOrderStatus",
      {
        orderId,
        status,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
