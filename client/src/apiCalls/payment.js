import { axiosInstance } from ".";

export const makePayment = async ({ cart, orderSummary }) => {
  try {
    await axiosInstance.post("/app/v1/users/makePayment", {
      cart,
      orderSummary,
    });
  } catch (error) {
    return error;
  }
};
