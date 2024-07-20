/* eslint-disable react/prop-types */
import {
  List,
  Typography,
  Card,
  message,
  Form,
  Input,
  Row,
  Col,
  Skeleton,
  Drawer,
} from "antd";
import {
  PhoneOutlined,
  HomeOutlined,
  MinusOutlined,
  PlusOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPrimaryAddress,
  updatePrimaryAddress,
  getAllAddressNotPrimaryByUser,
} from "../../apiCalls/address";
import { addReceiverDetails, getReceiverDetails } from "../../apiCalls/user";
import { addAddress } from "../../apiCalls/address";
import { makePayment } from "../../apiCalls/payment";
import { addItems, removeItems } from "../../redux/cartSlice";
import nonVeg from "../../assets/nonVeg.png";
import veg from "../../assets/veg.png";

let restaurantCharges = 0;
let deliveryFee = 50;
let platformFee = 10;

const OrderDetails = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.users);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [changeAddress, setChangeAddress] = useState(false);
  const [addressDrawer, setAddressDrawer] = useState(false);
  const [deliveryDrawer, setDeliveryDrawer] = useState(false);
  const [addressLoader, setAddressLoader] = useState(false);
  const [receiverLoader, setReceiverLoader] = useState(false);
  const { restaurantId } = useParams();
  const dispatch = useDispatch();

  const totalAmount = cart.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  const fetchPrimaryAddress = async () => {
    try {
      setAddressLoader(true);
      const response = await getPrimaryAddress({ userId: user._id });
      if (response.success) {
        setPrimaryAddress(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setAddressLoader(false);
    }
  };

  const fetchReceiverDetails = async () => {
    try {
      setReceiverLoader(true);
      const response = await getReceiverDetails({ userId: user._id });
      if (response.success) {
        setReceiverDetails(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setReceiverLoader(false);
    }
  };

  const updateReceiverDetails = async (values) => {
    try {
      const response = await addReceiverDetails({ ...values, status: true });
      if (response.success) {
        fetchReceiverDetails();
        setDeliveryDrawer(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await addAddress({
        ...values,
        isPrimary: true,
        userId: user._id,
      });
      if (response.success) {
        setAddressDrawer(false);
        setChangeAddress(false);
        fetchPrimaryAddress();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const getUserAddress = async () => {
    try {
      const response = await getAllAddressNotPrimaryByUser({
        userId: user._id,
      });
      if (response.success) {
        setUserAddress(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const updateAddress = async (addressId) => {
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

  const handlePayment = async () => {
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
        orderItems: cart,
        deliverTo: primaryAddress._id,
      };
      const response = await makePayment({ cart, orderSummary });
      window.location.href = response.url;
    } catch (error) {
      message.error("Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchPrimaryAddress();
    fetchReceiverDetails();
  }, []);

  return (
    <>
      <Row className="m-4">
        <Col xs={24} md={12} lg={16}>
          <Card className="mb-4 md:mr-4">
            <div className="flex justify-between items-center w-full mb-5">
              <div className="flex justify-center items-center gap-4">
                <Typography.Title level={5}>
                  {changeAddress
                    ? "Choose a delivery address"
                    : "Delivery address"}
                </Typography.Title>
                {!changeAddress && (
                  <CheckCircleFilled className="text-[#60b246]" size="large" />
                )}
              </div>
              {!changeAddress && (
                <Typography.Text
                  strong
                  className="cursor-pointer"
                  style={{ color: "orange" }}
                  onClick={() => {
                    getUserAddress();
                    setChangeAddress(true);
                  }}
                >
                  CHANGE
                </Typography.Text>
              )}
            </div>
            {changeAddress ? (
              !userAddress ? (
                <Skeleton />
              ) : (
                <Row gutter={[12, 12]}>
                  {userAddress.map((address) => {
                    return (
                      <Col key={address._id} xs={24} md={24} lg={12}>
                        <Card size="small hover:shadow-xl">
                          <div className="flex justify-start items-start gap-4">
                            <div>
                              <HomeOutlined />
                            </div>
                            <div className="flex flex-col justify-start items-start">
                              <Typography.Text type="secondary">
                                {address?.addressLine1}
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                {address?.addressLine2}
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                {address?.state}
                              </Typography.Text>
                              <Typography.Text type="secondary">{`${address?.city}, ${address?.landmark}`}</Typography.Text>
                              <Typography.Text type="secondary">
                                {address?.pinCode}
                              </Typography.Text>
                              <div className="mt-3">
                                <button
                                  className="w-24 h-8 bg-[#60b246] text-white font-semibold"
                                  onClick={() => {
                                    setAddressLoader(true);
                                    updateAddress(address._id);
                                    setChangeAddress(false);
                                  }}
                                >
                                  Deliver here
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                  <Col xs={24} md={24} lg={12}>
                    <Card size="small hover:shadow-xl">
                      <div className="flex justify-start items-start gap-4">
                        <div>
                          <HomeOutlined />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <Typography.Text strong>
                            Add New Address
                          </Typography.Text>
                          <div className="mt-3">
                            <button
                              className="w-24 h-8 bg-white text-[#60b246] font-semibold border border-[#60b246]"
                              onClick={() => setAddressDrawer(true)}
                            >
                              Add New
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              )
            ) : addressLoader ? (
              <Skeleton active />
            ) : !primaryAddress ? (
              <div className="flex flex-col justify-center items-center mt-4 gap-4">
                <Typography.Text type="secondary">
                  <ExclamationCircleOutlined className="mr-2" />
                  No addresses found. Please add a new address.
                </Typography.Text>
                <div>
                  <button
                    className="ml-4 w-24 h-8 bg-white text-[#60b246] font-semibold border border-[#60b246]"
                    onClick={() => setAddressDrawer(true)}
                  >
                    Add New
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-start gap-3">
                <div>
                  <HomeOutlined />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <Typography.Text type="secondary">
                    {primaryAddress?.addressLine1}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {primaryAddress?.addressLine2}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {primaryAddress?.state}
                  </Typography.Text>
                  <Typography.Text type="secondary">{`${primaryAddress?.city}, ${primaryAddress?.landmark}`}</Typography.Text>
                  <Typography.Text type="secondary">
                    {primaryAddress?.pinCode}
                  </Typography.Text>
                </div>
              </div>
            )}
          </Card>
          <Card className="mb-4 md:mr-4">
            <div className="flex justify-between items-center w-full mb-5">
              <div className="flex justify-center items-center gap-4">
                <Typography.Title level={5}>Deliver to</Typography.Title>
                <CheckCircleFilled className="text-[#60b246]" size="large" />
              </div>
              <Typography.Text
                strong
                className="cursor-pointer"
                style={{ color: "orange" }}
                onClick={() => {
                  setDeliveryDrawer(true);
                }}
              >
                UPDATE
              </Typography.Text>
            </div>
            {receiverLoader ? (
              <Skeleton active />
            ) : !receiverDetails ? (
              <div className="flex flex-col justify-center items-center mt-4 gap-4">
                <Typography.Text type="secondary">
                  <ExclamationCircleOutlined className="mr-2" />
                  No receiver details found. Please add a new receiver details.
                </Typography.Text>
                <div>
                  <button
                    className="ml-4 w-24 h-8 bg-white text-[#60b246] font-semibold border border-[#60b246]"
                    onClick={() => setDeliveryDrawer(true)}
                  >
                    Add New
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-start items-start gap-3">
                <div>
                  <PhoneOutlined />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <Typography.Text type="secondary">
                    {receiverDetails?.receiverName}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {`+91-${receiverDetails?.phoneNumber}`}
                  </Typography.Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <div className="flex flex-col justify-start items-start m-1 mb-2">
                <Typography.Title level={5}>
                  {cart[0]?.availableIn?.name}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 10 }}>
                  {cart[0]?.availableIn?.address}
                </Typography.Text>
              </div>
            }
            size="small"
          >
            <List
              itemLayout="horizontal"
              dataSource={cart}
              renderItem={(each) => (
                <div className="flex justify-between items-center w-full m-1 mb-4">
                  <div className="flex justify-start items-center w-32">
                    <img src={each.isVeg ? veg : nonVeg} className="w-3 mr-2" />
                    <Typography.Text strong>{each.name}</Typography.Text>
                  </div>
                  <div className="border-2 p-2 flex justify-between items-center w-20 cursor-pointer">
                    <MinusOutlined
                      className="hover:text-orange-500"
                      onClick={() => dispatch(removeItems(each))}
                    />
                    <Typography.Text
                      style={{ color: "#60b246", fontSize: 12 }}
                      strong
                    >
                      {each.quantity}
                    </Typography.Text>
                    <PlusOutlined
                      onClick={() => dispatch(addItems(each))}
                      className="hover:text-[#60b246]"
                    />
                  </div>
                  <div>
                    <Typography.Text type="secondary">
                      {`₹${each.quantity * each.price}`}
                    </Typography.Text>
                  </div>
                </div>
              )}
            />
            <hr className="mb-2 mt-2" />
            <Typography.Text strong className="mb-2">
              Bill details
            </Typography.Text>
            <div className="flex flex-col m-1 w-full">
              <div className="w-full flex justify-between items-center mb-2">
                <Typography.Text type="secondary">Item Total</Typography.Text>
                <Typography.Text type="secondary">
                  {`₹${totalAmount}`}
                </Typography.Text>
              </div>
              <div className="w-full flex justify-between items-center mb-2">
                <Typography.Text type="secondary">Delivery Fee</Typography.Text>
                <Typography.Text type="secondary">
                  {`₹${deliveryFee}`}
                </Typography.Text>
              </div>
              <div className="w-full flex justify-between items-center mb-2">
                <Typography.Text type="secondary">Platform fee</Typography.Text>
                <Typography.Text type="secondary">
                  {`₹${platformFee}`}
                </Typography.Text>
              </div>
              <div className="w-full flex justify-between items-center mb-2">
                <Typography.Text type="secondary">
                  GST and Restaurant Charges
                </Typography.Text>
                <Typography.Text type="secondary">
                  {`₹${restaurantCharges}`}
                </Typography.Text>
              </div>
            </div>
            <hr className="mb-1 bg-black" style={{ height: "2px" }} />
            <div className="w-full flex justify-between items-center mt-3">
              <Typography.Text strong>TO PAY</Typography.Text>
              <Typography.Text strong>
                {`₹${
                  restaurantCharges + totalAmount + platformFee + deliveryFee
                }`}
              </Typography.Text>
            </div>
          </Card>
          <div className="mt-4">
            <button
              className="w-full font-semibold text-white bg-[#60b246] h-10"
              onClick={handlePayment}
            >
              PROCEED TO PAY
            </button>
          </div>
        </Col>
      </Row>
      {addressDrawer && (
        <Drawer
          title="Add Delivery Address"
          open={addressDrawer}
          onClose={() => setAddressDrawer(false)}
        >
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
              rules={[{ required: true, message: "Please enter your city" }]}
            >
              <Input type="text" placeholder="enter your city" size="large" />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: "Please enter your state" }]}
            >
              <Input type="text" placeholder="enter your state" size="large" />
            </Form.Item>
            <Form.Item
              label="Landmark"
              name="landmark"
              rules={[{ required: true, message: "Please enter landmark" }]}
            >
              <Input type="text" placeholder="enter landmark" size="large" />
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
              <button
                type="submit"
                className="w-full font-semibold text-white bg-orange-500 h-10"
              >
                SAVE ADDRESS & PROCEED
              </button>
            </Form.Item>
          </Form>
        </Drawer>
      )}
      {deliveryDrawer && (
        <Drawer
          open={deliveryDrawer}
          onClose={() => setDeliveryDrawer(false)}
          title="Update delivery user details"
        >
          <Form layout="vertical" onFinish={updateReceiverDetails}>
            <Form.Item name="receiverName" label="Receiver Name">
              <Input placeholder="Enter receiver name" size="large" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Number">
              <Input placeholder="Enter phone number" size="large" />
            </Form.Item>
            <Form.Item>
              <button
                type="submit"
                className="w-full font-semibold text-white bg-orange-500 h-10"
              >
                UPDATE
              </button>
            </Form.Item>
          </Form>
        </Drawer>
      )}
    </>
  );
};

export default OrderDetails;
