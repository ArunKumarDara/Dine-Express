/* eslint-disable react/prop-types */
import {
  Modal,
  List,
  Typography,
  Card,
  Space,
  Divider,
  Button,
  message,
} from "antd";
import { PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addOrder } from "../../apiCalls/order";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrimaryAddress } from "../../apiCalls/address";

let restaurantCharges = 0;
let deliveryFee = 50;
let platformFee = 10;

const OrderDetails = ({
  orderModal,
  setOrderModal,
  orderItems,
  setOrderItems,
  totalAmount,
  setTotalAmount,
}) => {
  const { user } = useSelector((state) => state.users);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const fetchPrimaryAddress = async () => {
    try {
      const response = await getPrimaryAddress({ userId: user._id });
      if (response.success) {
        setPrimaryAddress(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderSummary = {
        totalAmount:
          totalAmount + restaurantCharges + deliveryFee + platformFee,
        user: user._id,
        restaurant: restaurantId,
        orderItems: orderItems,
      };
      const response = await addOrder(orderSummary);
      if (response.success) {
        message.success(response.message);
        setOrderModal(false);
        setOrderItems([]);
        setTotalAmount(0);
        navigate("/profile");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    fetchPrimaryAddress();
  }, []);

  return (
    <>
      <Modal
        open={orderModal}
        onCancel={() => setOrderModal(false)}
        footer={false}
      >
        <Card className="mt-6" title="Items Added" size="small">
          <List
            itemLayout="horizontal"
            dataSource={orderItems}
            renderItem={(each) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div className="flex flex-col justify-start">
                      <Typography.Text strong>{each.name}</Typography.Text>
                      <Typography.Text type="success">{`₹${each.price}`}</Typography.Text>
                    </div>
                  }
                />
                <Typography.Text type="danger">{each.quantity}</Typography.Text>
              </List.Item>
            )}
          />
        </Card>
        <Card size="small" className="mt-3">
          <Space className="flex justify-between items-center">
            <Typography.Text>
              <PhoneOutlined className="mr-2" />
              {`${user.firstName} ${user.lastName}`}
            </Typography.Text>
            <Typography.Text>9100401610</Typography.Text>
          </Space>
        </Card>
        <Card size="small" className="mt-3">
          <Space className="flex justify-between items-start">
            <Typography.Text>
              <HomeOutlined className="mr-2" />
              Delivery at:
            </Typography.Text>
            <Space
              direction="vertical"
              size={0}
              className="flex justify-end items-end w-full"
            >
              <Typography.Text>{primaryAddress?.addressLine1}</Typography.Text>
              <Typography.Text>{primaryAddress?.addressLine2}</Typography.Text>
              <Typography.Text>{primaryAddress?.state}</Typography.Text>
              <Typography.Text>{`${primaryAddress?.city}, ${primaryAddress?.landmark}`}</Typography.Text>
              <Typography.Text>{primaryAddress?.pinCode}</Typography.Text>
            </Space>
          </Space>
        </Card>
        <Card className="mt-3" title="Bill Summary" size="small">
          <Space className="flex justify-between items-center">
            <Typography.Text>Item Total</Typography.Text>
            <Typography.Text type="success">
              {`₹${totalAmount}`}
            </Typography.Text>
          </Space>
          <Space className="flex justify-between items-center">
            <Typography.Text>GST and restaurant charges</Typography.Text>
            <Typography.Text type="success">
              {`₹${restaurantCharges}`}
            </Typography.Text>
          </Space>
          <Space className="flex justify-between items-center">
            <Typography.Text>Delivery partner fee</Typography.Text>
            <Typography.Text type="success">{`₹${deliveryFee}`}</Typography.Text>
          </Space>
          <Space className="flex justify-between items-center">
            <Typography.Text>Platform fee</Typography.Text>
            <Typography.Text type="success">{`₹${platformFee}`}</Typography.Text>
          </Space>
          <Divider />
          <Space className="flex justify-between items-center">
            <Typography.Title level={5}>Grand Total</Typography.Title>
            <Typography.Text type="success" strong>
              {`₹${
                restaurantCharges + deliveryFee + platformFee + totalAmount
              }`}
            </Typography.Text>
          </Space>
        </Card>
        <div className="mt-3">
          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default OrderDetails;
