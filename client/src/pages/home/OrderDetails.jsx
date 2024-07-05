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
  Form,
  Input,
} from "antd";
import {
  PhoneOutlined,
  HomeOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addOrder } from "../../apiCalls/order";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrimaryAddress } from "../../apiCalls/address";
import Spinner from "../../components/spinner/Spinner";
import { addReceiverDetails, getReceiverDetails } from "../../apiCalls/user";

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
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [arrow, setArrow] = useState(true);
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

  const fetchReceiverDetails = async () => {
    try {
      const response = await getReceiverDetails({ userId: user._id });
      if (response.success) {
        setReceiverDetails(response.data);
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
        deliverTo: primaryAddress._id,
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

  const handleReceiverDetails = async (values) => {
    try {
      const response = await addReceiverDetails({ ...values, status: true });
      if (response.success) {
        message.success(response.message);
        fetchReceiverDetails();
        setArrow(!arrow);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    fetchPrimaryAddress();
    fetchReceiverDetails();
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
              {receiverDetails?.receiverName}
              {/* {`${user.firstName} ${user.lastName}`} */}
            </Typography.Text>
            <Space>
              <Typography.Text>{`+91-${receiverDetails?.phoneNumber}`}</Typography.Text>
              {arrow ? (
                <DownOutlined
                  className="cursor-pointer"
                  onClick={() => setArrow(false)}
                />
              ) : (
                <UpOutlined
                  className="cursor-pointer"
                  onClick={() => setArrow(true)}
                />
              )}
            </Space>
          </Space>
          {!arrow && (
            <>
              <Divider />
              <Typography.Title level={5}>
                Update receiver details
              </Typography.Title>
              <Form layout="vertical" onFinish={handleReceiverDetails}>
                <Form.Item name="receiverName" label="Receiver Name">
                  <Input placeholder="Enter receiver name" size="large" />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number">
                  <Input placeholder="Enter phone number" size="large" />
                </Form.Item>
                <Form.Item>
                  <Button className="w-full" htmlType="submit" type="primary">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Card>

        <Card size="small" className="mt-3">
          <Space className="flex justify-between items-start">
            <Typography.Text>
              <HomeOutlined className="mr-2" />
              Delivery at:
            </Typography.Text>
            {!primaryAddress ? (
              <Spinner />
            ) : (
              <Space
                direction="vertical"
                size={0}
                className="flex justify-end items-end w-full"
              >
                <Typography.Text>
                  {primaryAddress?.addressLine1}
                </Typography.Text>
                <Typography.Text>
                  {primaryAddress?.addressLine2}
                </Typography.Text>
                <Typography.Text>{primaryAddress?.state}</Typography.Text>
                <Typography.Text>{`${primaryAddress?.city}, ${primaryAddress?.landmark}`}</Typography.Text>
                <Typography.Text>{primaryAddress?.pinCode}</Typography.Text>
              </Space>
            )}
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
