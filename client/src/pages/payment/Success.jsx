import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { updateOrderById } from "../../apiCalls/order";
import { message } from "antd";

const PaymentSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

  const getOrderDetails = async () => {
    try {
      const response = await updateOrderById(orderId);
      if (response.success) {
        console.log(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  return <div>Success</div>;
};

export default PaymentSuccess;
