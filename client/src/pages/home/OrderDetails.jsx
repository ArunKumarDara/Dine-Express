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
  Modal,
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
import Spinner from "../../components/spinner/Spinner";
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
  const [addressModal, setAddressModal] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState(false);
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
        message.success(response.message);
        fetchReceiverDetails();
        setDeliveryModal(false);
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
        message.success(response.message);
        setAddressModal(false);
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
                <Spinner />
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
                              onClick={() => setAddressModal(true)}
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
              <Spinner />
            ) : !primaryAddress ? (
              <div className="flex flex-col justify-center items-center mt-4 gap-4">
                <Typography.Text type="secondary">
                  <ExclamationCircleOutlined className="mr-2" />
                  No addresses found. Please add a new address.
                </Typography.Text>
                <div>
                  <button
                    className="ml-4 w-24 h-8 bg-white text-[#60b246] font-semibold border border-[#60b246]"
                    onClick={() => setAddressModal(true)}
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
          <Card>
            <div className="flex justify-between items-center w-full mb-5">
              <div className="flex justify-center items-center gap-4">
                <Typography.Title level={5}>Receiver details</Typography.Title>
                {receiverDetails && (
                  <CheckCircleFilled className="text-[#60b246]" size="large" />
                )}
              </div>
              {receiverDetails && (
                <Typography.Text
                  strong
                  className="cursor-pointer"
                  style={{ color: "orange" }}
                  onClick={() => setDeliveryModal(true)}
                >
                  CHANGE
                </Typography.Text>
              )}
            </div>
            {receiverLoader ? (
              <Spinner />
            ) : !receiverDetails ? (
              <div className="flex flex-col justify-center items-center mt-4 gap-4">
                <Typography.Text type="secondary">
                  <ExclamationCircleOutlined className="mr-2" />
                  No receiver details found. Please add new receiver details.
                </Typography.Text>
                <div>
                  <button
                    className="ml-4 w-24 h-8 bg-white text-[#60b246] font-semibold border border-[#60b246]"
                    onClick={() => setDeliveryModal(true)}
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
                    {receiverDetails?.name}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {receiverDetails?.phoneNumber}
                  </Typography.Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card className="mb-4">
            <Typography.Title level={5} className="uppercase">
              {cart.length} Items
            </Typography.Title>
            <div>
              <List
                dataSource={cart}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex justify-center items-center gap-2">
                        <div>
                          <img
                            src={item.type === "veg" ? veg : nonVeg}
                            alt=""
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="flex flex-col justify-start items-start">
                          <Typography.Text>{item.name}</Typography.Text>
                          <Typography.Text
                            strong
                          >{`₹${item.price}`}</Typography.Text>
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-4">
                        <MinusOutlined
                          className="cursor-pointer"
                          onClick={() => {
                            dispatch(removeItems(item));
                          }}
                        />
                        <Typography.Text strong>
                          {item.quantity}
                        </Typography.Text>
                        <PlusOutlined
                          className="cursor-pointer"
                          onClick={() => {
                            dispatch(addItems(item));
                          }}
                        />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
          <Card className="mt-2">
            <Typography.Title level={5} className="uppercase">
              Bill Details
            </Typography.Title>
            <div className="flex justify-between items-center mt-3">
              <Typography.Text type="secondary">Item total</Typography.Text>
              <Typography.Text>{`₹${totalAmount}`}</Typography.Text>
            </div>
            <div className="flex justify-between items-center mt-3">
              <Typography.Text type="secondary">
                Restaurant charges
              </Typography.Text>
              <Typography.Text>{`₹${restaurantCharges}`}</Typography.Text>
            </div>
            <div className="flex justify-between items-center mt-3">
              <Typography.Text type="secondary">Delivery fee</Typography.Text>
              <Typography.Text>{`₹${deliveryFee}`}</Typography.Text>
            </div>
            <div className="flex justify-between items-center mt-3">
              <Typography.Text type="secondary">Platform fee</Typography.Text>
              <Typography.Text>{`₹${platformFee}`}</Typography.Text>
            </div>
            <div className="flex justify-between items-center mt-3">
              <Typography.Text strong>Total</Typography.Text>
              <Typography.Text>{`₹${
                totalAmount + restaurantCharges + deliveryFee + platformFee
              }`}</Typography.Text>
            </div>
            <div className="mt-4">
              <button
                className="bg-[#60b246] text-white p-2 w-full uppercase"
                onClick={handlePayment}
              >
                Proceed to pay
              </button>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Address Form"
        open={addressModal}
        onCancel={() => setAddressModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            rules={[
              {
                required: true,
                message: "Please input your Address Line 1!",
              },
            ]}
          >
            <Input placeholder="Address Line 1" />
          </Form.Item>
          <Form.Item
            label="Address Line 2"
            name="addressLine2"
            rules={[
              {
                required: true,
                message: "Please input your Address Line 2!",
              },
            ]}
          >
            <Input placeholder="Address Line 2" />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[
              {
                required: true,
                message: "Please input your State!",
              },
            ]}
          >
            <Input placeholder="State" />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[
              {
                required: true,
                message: "Please input your City!",
              },
            ]}
          >
            <Input placeholder="City" />
          </Form.Item>
          <Form.Item
            label="Landmark"
            name="landmark"
            rules={[
              {
                required: true,
                message: "Please input your Landmark!",
              },
            ]}
          >
            <Input placeholder="Landmark" />
          </Form.Item>
          <Form.Item
            label="PinCode"
            name="pinCode"
            rules={[
              {
                required: true,
                message: "Please input your PinCode!",
              },
            ]}
          >
            <Input placeholder="PinCode" />
          </Form.Item>
          <div className="flex justify-end items-end">
            <button
              className="bg-[#60b246] text-white px-4 py-2 uppercase"
              type="submit"
            >
              Add Address
            </button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Receiver Details"
        open={deliveryModal}
        onCancel={() => setDeliveryModal(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={updateReceiverDetails}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input receiver name!",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input receiver phone number!",
              },
            ]}
          >
            <Input placeholder="Phone number" />
          </Form.Item>
          <div className="flex justify-end items-end">
            <button
              className="bg-[#60b246] text-white px-4 py-2 uppercase"
              type="submit"
            >
              Save
            </button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OrderDetails;
