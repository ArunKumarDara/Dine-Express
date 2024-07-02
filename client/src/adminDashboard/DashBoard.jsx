import { Typography, Row, Col, Card, Statistic, message } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useState } from "react";
import { getDashBoardDetails } from "../apiCalls/dashBoard";
import Spinner from "../components/spinner/Spinner";
import OrderPieChart from "../charts/OrderPieChart";

const DashBoard = () => {
  const [dashBoardDetails, setDashBoardDetails] = useState(null);
  const getData = async () => {
    try {
      const response = await getDashBoardDetails();
      if (response.success) {
        message.success(response.message);
        setDashBoardDetails(response.data);
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
    <div className="m-4">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5}>Admin Dashboard</Typography.Title>
        </Col>
        {!dashBoardDetails ? (
          <Spinner />
        ) : (
          <>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Card bordered={false} size="large">
                <Statistic
                  title="Active Users"
                  value={dashBoardDetails.numberOfUsers}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Card bordered={false} size="large">
                <Statistic
                  title="Total Orders"
                  value={dashBoardDetails.numberOfOrders}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8}>
              <Card bordered={false} size="large">
                <Statistic
                  title="Total Order Amount"
                  value={dashBoardDetails.totalOrderAmount}
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                  prefix="₹"
                />
              </Card>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <OrderPieChart />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default DashBoard;
