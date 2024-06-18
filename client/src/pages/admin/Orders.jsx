import { Table, message, Tag, Typography, Space } from "antd";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../apiCalls/order";
import moment from "moment";
import {
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
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
    title: "Ordered by",
    dataIndex: "name",
    render: (text, record) => {
      return (
        <Space direction="vertical">
          <Typography.Text>{`${record.user.firstName} ${record.user.lastName},`}</Typography.Text>
          <Typography.Text>{`+91-${record.user.phoneNumber},`}</Typography.Text>
          <Typography.Text>{record.user.email}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Delivery Address",
    dataIndex: "deliverTo",
    render: (text) => {
      return (
        <Space direction="vertical">
          <Typography.Text>{`${text?.addressLine1},`}</Typography.Text>
          <Typography.Text>{`${text.addressLine2},`}</Typography.Text>
          <Typography.Text>{`${text.state}`}</Typography.Text>
          <Typography.Text>{`${text.city}, ${text.landmark}`}</Typography.Text>
          <Typography.Text>{text.pinCode}</Typography.Text>
        </Space>
      );
    },
  },
  {
    title: "Ordered on",
    dataIndex: "createdAt",
    render: (text) => {
      return moment(text).format("MMMM Do, YYYY");
    },
  },
  {
    title: "Ordered Items",
    render: (text, record) => {
      return record.menuItems.map((menuItem) => (
        <div key={menuItem.item._id}>
          <Typography.Text>
            {menuItem.item.name}
            <span>- </span>
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
    render: (text) => {
      return `₹${text}`;
    },
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

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const getData = async () => {
    try {
      const response = await getAllOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(orders);

  return (
    <>
      {!orders ? (
        <Spinner />
      ) : (
        <Table
          className="mt-3"
          dataSource={orders}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
          scroll={{
            x: 800,
          }}
        />
      )}
    </>
  );
};

export default Orders;
