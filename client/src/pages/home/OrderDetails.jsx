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
  Radio,
  Result,
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
import {
  getPrimaryAddress,
  updatePrimaryAddress,
} from "../../apiCalls/address";
import Spinner from "../../components/spinner/Spinner";
import { addReceiverDetails, getReceiverDetails } from "../../apiCalls/user";
import { addAddress, getAllAddressByUser } from "../../apiCalls/address";

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
  const [userAddress, setUserAddress] = useState(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [deliveryArrow, setDeliveryArrow] = useState(true);
  const [addressArrow, setAddressArrow] = useState(true);
  const [addressForm, setAddressForm] = useState(false);
  const [result, setResult] = useState(false);
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const fetchPrimaryAddress = async () => {
    try {
      setAddressLoading(true);
      const response = await getPrimaryAddress({ userId: user._id });
      if (response.success) {
        setPrimaryAddress(response.data);
      } else {
        message.error(response.message);
      }
      setAddressLoading(false);
    } catch (error) {
      message.error(error);
    }
  };

  const fetchReceiverDetails = async () => {
    try {
      setDeliveryLoading(true);
      const response = await getReceiverDetails({ userId: user._id });
      if (response.success) {
        setReceiverDetails(response.data);
        setDeliveryLoading(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!primaryAddress) {
      message.error("Please add a primary address.");
      return;
    }

    if (!receiverDetails) {
      message.error("Please add receiver details.");
      return;
    }
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
        setOrderItems([]);
        setTotalAmount(0);
        setResult(true);
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
        setDeliveryArrow(!deliveryArrow);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const onFinish = async (values) => {
    setAddressLoading(true);
    try {
      const response = await addAddress({
        ...values,
        isPrimary: true,
        userId: user._id,
      });
      if (response.success) {
        message.success(response.message);
        setAddressForm(false);
        fetchPrimaryAddress();
      } else {
        message.error(response.message);
      }
      setAddressLoading(false);
    } catch (error) {
      message.error(error);
    }
  };

  const getUserAddress = async () => {
    try {
      const response = await getAllAddressByUser({ userId: user._id });
      if (response.success) {
        setUserAddress(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleAddressChange = async (addressId) => {
    try {
      const response = await updatePrimaryAddress({
        addressId,
        userId: user._id,
      });
      if (response.success) {
        fetchPrimaryAddress();
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
        {!result ? (
          <>
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
                    <Typography.Text type="danger">
                      {each.quantity}
                    </Typography.Text>
                  </List.Item>
                )}
              />
            </Card>
            <Card size="small" className="mt-3">
              {deliveryLoading && <Spinner />}
              {receiverDetails ? (
                <>
                  <Space className="flex justify-between items-center">
                    <Typography.Text>
                      <PhoneOutlined className="mr-2" />
                      {receiverDetails?.receiverName}
                    </Typography.Text>
                    <Space>
                      <Typography.Text>{`+91-${receiverDetails?.phoneNumber}`}</Typography.Text>
                      {deliveryArrow ? (
                        <DownOutlined
                          className="cursor-pointer"
                          onClick={() => setDeliveryArrow(false)}
                        />
                      ) : (
                        <UpOutlined
                          className="cursor-pointer"
                          onClick={() => setDeliveryArrow(true)}
                        />
                      )}
                    </Space>
                  </Space>
                </>
              ) : (
                !deliveryLoading &&
                deliveryArrow && (
                  <Space className="flex justify-center">
                    <Typography.Text>
                      No receiver details found,
                      <Button
                        type="link"
                        onClick={() => setDeliveryArrow(false)}
                      >
                        Add receiver details
                      </Button>
                    </Typography.Text>
                  </Space>
                )
              )}
              {!deliveryArrow && (
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
                      <Button
                        className="w-full"
                        htmlType="submit"
                        type="primary"
                      >
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
                {addressLoading && <Spinner />}
                {primaryAddress ? (
                  <Space>
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
                      <Typography.Text>
                        {primaryAddress?.pinCode}
                      </Typography.Text>
                    </Space>
                    {addressArrow ? (
                      <DownOutlined
                        className="cursor-pointer"
                        onClick={() => {
                          setAddressArrow(false);
                          setAddressForm(false);
                          getUserAddress();
                        }}
                      />
                    ) : (
                      <UpOutlined
                        className="cursor-pointer"
                        onClick={() => {
                          setAddressArrow(true);
                          setAddressForm(false);
                        }}
                      />
                    )}
                  </Space>
                ) : (
                  !addressLoading &&
                  !addressForm && (
                    <Button type="link" onClick={() => setAddressForm(true)}>
                      Add Address
                    </Button>
                  )
                )}
              </Space>
              {addressForm && (
                <>
                  <Divider />
                  <Typography.Title level={5}>
                    Add delivery address
                  </Typography.Title>
                  <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      label="Address Line 1"
                      name="addressLine1"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Address line 1",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="enter address line 1"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Address Line 2"
                      name="addressLine2"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Address line 2",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="enter address line 2"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label="City"
                      name="city"
                      rules={[
                        { required: true, message: "Please enter your city" },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="enter your city"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[
                        { required: true, message: "Please enter your state" },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="enter your state"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Landmark"
                      name="landmark"
                      rules={[
                        { required: true, message: "Please enter landmark" },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="enter landmark"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Pincode"
                      name="pinCode"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your pincode",
                        },
                      ]}
                    >
                      <Input
                        type="text"
                        placeholder="enter your pincode"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full"
                        size="large"
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              )}
              {!addressArrow && (
                <>
                  <Divider />
                  <Space className="flex justify-between">
                    <Typography.Title level={5}>
                      Update delivery address
                    </Typography.Title>
                    <Button
                      type="link"
                      onClick={() => {
                        setAddressForm(true);
                        setAddressArrow(true);
                      }}
                    >
                      Add address
                    </Button>
                  </Space>
                  {!userAddress ? (
                    <Spinner />
                  ) : (
                    <List
                      className="mt-2"
                      grid={{ gutter: 8, column: 2 }}
                      dataSource={userAddress}
                      renderItem={(item) => (
                        <List.Item>
                          <Card>
                            <Space className="flex flex-col justify-start items-start">
                              <Radio
                                checked={primaryAddress?._id === item._id}
                                onChange={() => handleAddressChange(item._id)}
                              >
                                Select
                              </Radio>
                              <Typography.Text>
                                {item?.addressLine1}
                              </Typography.Text>
                              <Typography.Text>
                                {item?.addressLine2}
                              </Typography.Text>
                              <Typography.Text>{item?.state}</Typography.Text>
                              <Typography.Text>{`${item?.city}, ${item?.landmark}`}</Typography.Text>
                              <Typography.Text>{item?.pinCode}</Typography.Text>
                            </Space>
                          </Card>
                        </List.Item>
                      )}
                    />
                  )}
                </>
              )}
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
          </>
        ) : (
          <Result
            status="success"
            title="Order Placed Successfully!!"
            subTitle="it takes 1-2 minutes to confirm your order, please wait."
            extra={[
              <Button type="primary" key="console">
                Track your order
              </Button>,
              <Button key="buy" onClick={() => navigate("/")}>
                Order again
              </Button>,
            ]}
          />
        )}
      </Modal>
    </>
  );
};

export default OrderDetails;
