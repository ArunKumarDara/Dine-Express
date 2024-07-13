import { axiosInstance } from ".";

export const makePayment = async ({ cart, orderSummary }) => {
  try {
    const response = await axiosInstance.post("/app/v1/users/makePayment", {
      cart,
      orderSummary,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
