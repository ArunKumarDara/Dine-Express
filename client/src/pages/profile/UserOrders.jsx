import { Table, Typography, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrdersByUserId } from "../../apiCalls/order";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import Spinner from "../../components/spinner/Spinner";

const columns = [
  {
    title: "Restaurant",
    dataIndex: "name",
    render: (text, record) => {
      return record.restaurant.name;
    },
  },
  {
    title: "Ordered Items",
    render: (text, record) => {
      return record.menuItems.map((menuItem) => (
        <div key={menuItem.item._id}>
          <Typography.Text>
            {menuItem.item.name}
            <span>: </span>
          </Typography.Text>
          <Typography.Text>
            {menuItem.quantity}
            <span>,</span>
          </Typography.Text>
        </div>
      ));
    },
  },
  {
    title: "Amount",
    dataIndex: "totalAmount",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (text) => {
      if (text === "Pending" || text === "Confirmed" || text === "Preparing") {
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            {text}
          </Tag>
        );
      } else if (text === "Cancelled") {
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {text}
          </Tag>
        );
      } else if (text === "Completed" || text === "Ready") {
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {text}
          </Tag>
        );
      }
    },
  },
];

const UserOrders = () => {
  const { user } = useSelector((state) => state.users);
  const [orders, setOrders] = useState([]);

  const getData = async () => {
    try {
      const response = await getOrdersByUserId({ userId: user._id });
      if (response.success) {
        message.success(response.message);
        setOrders(response.data);
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

  return (
    <>
      <Typography.Title level={5}>My Orders</Typography.Title>
      {orders.length === 0 ? (
        <Spinner />
      ) : (
        <Table columns={columns} dataSource={orders} className="mt-3" />
      )}
    </>
  );
};

export default UserOrders;
