import { Table, message, Tag, Typography, Space, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../apiCalls/order";
import moment from "moment";
import {
  CloseCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Spinner from "../../components/spinner/Spinner";

const { confirm } = Modal;

const nextStatus = {
  Pending: ["Confirm", "Cancel"],
  Confirm: ["Preparing"],
  Preparing: ["Ready"],
  Ready: ["On the way"],
  "On the way": ["Completed"],
  Completed: ["Deliver"],
};

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

  const handleStatusChange = (orderId, newStatus) => {
    confirm({
      title: `Do you want to update the order status to ${newStatus}?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const response = await updateOrderStatus(orderId, newStatus);
          if (response.success) {
            message.success(`Order status updated to ${newStatus}`);
            getData();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error("Failed to update order status. Please try again.");
        }
      },
    });
  };

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
        if (text === "Pending" || text === "Confirm" || text === "Preparing") {
          return (
            <Tag icon={<ClockCircleOutlined />} color="processing">
              {text === "Confirm" ? "Confirmed" : text}
            </Tag>
          );
        } else if (text === "Cancelled") {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              {text}
            </Tag>
          );
        } else if (
          text === "Completed" ||
          text === "Ready" ||
          text === "Deliver"
        ) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              {text === "Deliver" ? "Delivered" : text}
            </Tag>
          );
        }
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (text, record) => {
        const availableActions = nextStatus[record.status] || [];
        return (
          <Space direction="vertical">
            {availableActions.map((status) => (
              <Button
                type="link"
                key={status}
                onClick={() =>
                  handleStatusChange(
                    record._id,
                    status === "Cancel" ? "Cancelled" : status
                  )
                }
              >
                {status}
              </Button>
            ))}
          </Space>
        );
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  useEffect(() => {
    getData();
  }, []);

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
            x: 1200,
          }}
        />
      )}
    </>
  );
};

export default Orders;
