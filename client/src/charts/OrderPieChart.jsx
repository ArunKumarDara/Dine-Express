import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { message, Typography } from "antd";
import { useEffect } from "react";
import { getOrderStatusDetails } from "../apiCalls/dashBoard";
import { useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderPieChart = () => {
  const [orderStatusCount, setOrderStatusCount] = useState(null);

  const data = {
    labels: ["Delivered", "Pending", "Cancelled"],
    datasets: [
      {
        label: "# of Orders",
        data: [
          orderStatusCount?.Deliver,
          orderStatusCount?.Pending,
          orderStatusCount?.Cancelled,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getData = async () => {
    try {
      const response = await getOrderStatusDetails();
      if (response.success) {
        setOrderStatusCount(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(orderStatusCount);
  return (
    <div className="mb-4">
      <Typography.Title level={5}>Order Status Distribution</Typography.Title>
      <Pie data={data} />
    </div>
  );
};

export default OrderPieChart;
