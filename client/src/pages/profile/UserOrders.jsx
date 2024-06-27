import { Table, Typography, message, Tag, Space, Button } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrdersByUserId } from "../../apiCalls/order";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Spinner from "../../components/spinner/Spinner";
import moment from "moment";
import { BlobProvider } from "@react-pdf/renderer";
import Invoice from "../../Invoice/Invoice";

const UserOrders = () => {
  const { user } = useSelector((state) => state.users);
  const [orders, setOrders] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const columns = [
    {
      title: "Restaurant",
      dataIndex: "name",
      render: (text, record) => {
        return record.restaurant.name;
      },
    },
    {
      title: "Ordered On",
      dataIndex: "createdAt",
      render: (text) => {
        return moment(text).format("MMMM Do, YYYY");
      },
    },
    {
      title: "Ordered Items",
      render: (record) => {
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
      render: (text) => {
        return `₹${text}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      fixed: "right",
      width: 120,
      render: (text, record) => {
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
            <Space direction="vertical">
              <Tag icon={<CheckCircleOutlined />} color="success">
                {text === "Deliver" ? "Delivered" : text}
              </Tag>
              {text === "Deliver" && (
                <BlobProvider document={<Invoice order={record} />}>
                  {({ url }) => (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => window.open(url, "_blank")}
                      icon={<DownloadOutlined />}
                    >
                      Invoice
                    </Button>
                  )}
                </BlobProvider>
              )}
            </Space>
          );
        }
      },
    },
  ];

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

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Typography.Title level={5}>My Orders</Typography.Title>
      {!orders ? (
        <Spinner />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          className="mt-3"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          scroll={{
            x: 800,
          }}
          onChange={handleTableChange}
        />
      )}
    </>
  );
};

export default UserOrders;
