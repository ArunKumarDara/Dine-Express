import {
  Typography,
  Row,
  Col,
  message,
  Divider,
  Skeleton,
  Grid,
  Popconfirm,
} from "antd";
import { useSelector } from "react-redux";
import {
  ShoppingOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getOrdersByUserId } from "../../apiCalls/order";
import { deleteAddress, getAllAddressByUser } from "../../apiCalls/address";
import AddressForm from "./AddressForm";
import ViewOrderDetails from "./ViewOrderDetails";
const { useBreakpoint } = Grid;

const Profile = () => {
  const { user } = useSelector((state) => state.users);
  const [selectedContainer, setSelectedContainer] = useState(1);
  const [orders, setOrders] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [addressDrawer, setAddressDrawer] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const screens = useBreakpoint();

  const getUserOrders = async () => {
    try {
      const response = await getOrdersByUserId({ userId: user._id });
      if (response.success) {
        setOrders(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const getUserAddresses = async () => {
    try {
      const response = await getAllAddressByUser({ userId: user._id });
      if (response.success) {
        setAddresses(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleDeleteAddress = async (address) => {
    try {
      const response = await deleteAddress({ addressId: address._id });
      if (response.success) {
        getUserAddresses();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleClick = (containerId) => {
    setSelectedContainer(containerId);
  };

  useEffect(() => {
    if (selectedContainer === 1) {
      getUserOrders();
    } else if (selectedContainer === 2) {
      getUserAddresses();
    }
  }, [selectedContainer]);

  return (
    <Row>
      <Col span={24}>
        <div className="bg-[#37718e]">
          <div className="flex justify-between items-center p-5  pt-7 md:pt-10">
            <div className="flex flex-col justify-start items-start">
              <Typography.Title
                style={{ color: "white" }}
                level={3}
              >{`${user.firstName} ${user.lastName}`}</Typography.Title>
              <div className="flex justify-start items-center gap-2">
                <Typography.Text className="text-white">
                  {user.phoneNumber}
                </Typography.Text>
                <Typography.Text className="text-white">.</Typography.Text>
                <Typography.Text className="text-white">
                  {user.email}
                </Typography.Text>
              </div>
            </div>
            <div>
              <button className="h-8 w-28 md:h-11 md:w-36 border border-white font-semibold text-center text-white hover:bg-white hover:text-[#37718e]">
                EDIT PROFILE
              </button>
            </div>
          </div>
        </div>
      </Col>
      {screens.md ? (
        <Col span={24}>
          <div className="m-4 md:m-10">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div className="flex flex-col justify-start items-start bg-gray-200 pt-6 pb-6 pl-6">
                  <div
                    className={`flex justify-start items-center gap-3 w-full cursor-pointer p-5 ${
                      selectedContainer === 1 ? "bg-[#f5f5f5]" : "bg-gray-200"
                    }`}
                    onClick={() => handleClick(1)}
                  >
                    <ShoppingOutlined />
                    <Typography.Text strong>Orders</Typography.Text>
                  </div>
                  <div
                    className={`flex justify-start items-center gap-3 w-full cursor-pointer p-5 ${
                      selectedContainer === 2 ? "bg-[#f5f5f5]" : "bg-gray-200"
                    }`}
                    onClick={() => handleClick(2)}
                  >
                    <EnvironmentOutlined />
                    <Typography.Text strong>Addresses</Typography.Text>
                  </div>
                  <div
                    className={`flex justify-start items-center gap-3 w-full cursor-pointer p-5 ${
                      selectedContainer === 3 ? "bg-[#f5f5f5]" : "bg-gray-200"
                    }`}
                    onClick={() => handleClick(3)}
                  >
                    <SettingOutlined />
                    <Typography.Text strong>Settings</Typography.Text>
                  </div>
                </div>
              </Col>
              <Col span={18}>
                {selectedContainer === 1 ? (
                  !orders ? (
                    <Skeleton active className="m-4" />
                  ) : (
                    <div
                      className="overflow-y-auto h-full"
                      style={{ height: "500px" }}
                    >
                      {orders.map((order) => {
                        return (
                          <div
                            key={order._id}
                            className="border border-gray-300 p-5 flex flex-col justify-start items-start mb-4"
                          >
                            <Typography.Text strong>
                              {order.restaurant.name}
                            </Typography.Text>
                            <Typography.Text className="text-gray-500">
                              {order.restaurant.address}
                            </Typography.Text>
                            <Typography.Text type="secondary" className="mt-1">
                              {`ORDER #${order.orderNo}`}
                            </Typography.Text>
                            <Typography.Text
                              strong
                              style={{
                                color: "orange",
                                hovered: { color: "black" },
                              }}
                              className="mt-2 cursor-pointer"
                              onClick={() => {
                                setViewOrderDetails(true),
                                  setSelectedOrder(order);
                              }}
                            >
                              VIEW DETAILS
                            </Typography.Text>
                            <Divider className="mt-2 mb-2" />
                            <div className="flex justify-between w-full">
                              <div className="flex justify-between flex-col items-start">
                                {order.menuItems.map((item) => {
                                  return (
                                    <Typography.Text
                                      key={item.item._id}
                                    >{`${item.item.name} x ${item.quantity}`}</Typography.Text>
                                  );
                                })}
                              </div>
                              <Typography.Text className="text-gray-500">
                                {`Total Paid: ₹${order.totalAmount}`}
                              </Typography.Text>
                            </div>
                            <button className="p-2 w-28 mt-3 font-semibold text-white bg-orange-500 h-10 hover:shadow-lg">
                              TRACK
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : selectedContainer === 2 ? (
                  <Col span={24}>
                    <Row gutter={[12, 12]}>
                      {!addresses ? (
                        <Skeleton active className="m-4" />
                      ) : (
                        addresses.map((address) => {
                          return (
                            <Col key={address._id} span={12}>
                              <div className="border border-gray-300 p-5 flex flex-col justify-center items-start">
                                <div className="flex justify-start items-start gap-4">
                                  <div>
                                    <HomeOutlined />
                                  </div>
                                  <div className="flex flex-col justify-start items-start">
                                    <Typography.Text>
                                      {address?.addressLine1}
                                    </Typography.Text>
                                    <Typography.Text>
                                      {address?.addressLine2}
                                    </Typography.Text>
                                    <Typography.Text>
                                      {address?.state}
                                    </Typography.Text>
                                    <Typography.Text>{`${address?.city}, ${address?.landmark}`}</Typography.Text>
                                    <Typography.Text>
                                      {address?.pinCode}
                                    </Typography.Text>
                                    <div className="flex justify-start gap-7 mt-4">
                                      <Typography.Text
                                        strong
                                        className="text-orange-500 cursor-pointer"
                                        onClick={() => {
                                          setAddressDrawer(true),
                                            setSelectedAddress(address);
                                        }}
                                      >
                                        EDIT
                                      </Typography.Text>
                                      <Popconfirm
                                        title="Delete the address"
                                        icon={
                                          <QuestionCircleOutlined
                                            style={{
                                              color: "orange",
                                            }}
                                          />
                                        }
                                        description="Are you sure to delete this address?"
                                        onConfirm={() =>
                                          handleDeleteAddress(address)
                                        }
                                        onCancel
                                        okText="Yes"
                                        cancelText="No"
                                      >
                                        <Typography.Text
                                          strong
                                          className="text-orange-500 cursor-pointer"
                                        >
                                          DELETE
                                        </Typography.Text>
                                      </Popconfirm>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })
                      )}
                    </Row>
                  </Col>
                ) : (
                  <div>jdfnkjkgkfaknk</div>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      ) : (
        <>
          <Col span={24}>
            <div className="flex justify-center items-center bg-gray-200 pt-4 pl-4 pr-4 w-full overflow-x-auto ">
              <div
                className={`flex justify-center items-center gap-2  w-full cursor-pointer p-3 text-center ${
                  selectedContainer === 1 ? "bg-[#f5f5f5]" : "bg-gray-200"
                }`}
                onClick={() => handleClick(1)}
              >
                <ShoppingOutlined />
                <Typography.Text strong>Orders</Typography.Text>
              </div>
              <div
                className={`flex justify-center items-center gap-2 w-full cursor-pointer p-3 text-center ${
                  selectedContainer === 2 ? "bg-[#f5f5f5]" : "bg-gray-200"
                }`}
                onClick={() => handleClick(2)}
              >
                <EnvironmentOutlined />
                <Typography.Text strong>Addresses</Typography.Text>
              </div>
              <div
                className={`flex justify-center items-center gap-2 w-full cursor-pointer p-3 text-center ${
                  selectedContainer === 3 ? "bg-[#f5f5f5]" : "bg-gray-200"
                }`}
                onClick={() => handleClick(3)}
              >
                <SettingOutlined />
                <Typography.Text strong>Settings</Typography.Text>
              </div>
            </div>
          </Col>
          <Col span={24}>
            {selectedContainer === 1 ? (
              !orders ? (
                <Skeleton active className="h-full m-4" />
              ) : (
                <div
                  className="overflow-y-auto h-full m-4"
                  style={{ height: "500px" }}
                >
                  {orders.map((order) => {
                    return (
                      <div
                        key={order._id}
                        className="border border-gray-300 p-5 flex flex-col justify-start items-start mb-4"
                      >
                        <Typography.Text strong>
                          {order.restaurant.name}
                        </Typography.Text>
                        <Typography.Text className="text-gray-500">
                          {order.restaurant.address}
                        </Typography.Text>
                        <Typography.Text type="secondary" className="mt-1">
                          {`ORDER #${order.orderNo}`}
                        </Typography.Text>
                        <Typography.Text
                          strong
                          style={{
                            color: "orange",
                            hovered: { color: "black" },
                          }}
                          className="mt-2 cursor-pointer"
                          onClick={() => {
                            setViewOrderDetails(true), setSelectedOrder(order);
                          }}
                        >
                          VIEW DETAILS
                        </Typography.Text>
                        <Divider className="mt-2 mb-2" />
                        <div className="flex justify-between w-full">
                          <div className="flex justify-between flex-col items-start">
                            {order.menuItems.map((item) => {
                              return (
                                <Typography.Text
                                  key={item.item._id}
                                >{`${item.item.name} x ${item.quantity}`}</Typography.Text>
                              );
                            })}
                          </div>
                          <Typography.Text className="text-gray-500">
                            {`Total Paid: ₹${order.totalAmount}`}
                          </Typography.Text>
                        </div>
                        <button className="text-center w-24 mt-3 font-semibold text-white bg-orange-500 h-8 hover:shadow-lg">
                          TRACK
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            ) : selectedContainer === 2 ? (
              <div className="overflow-y-auto m-4" style={{ height: "500px" }}>
                {!addresses ? (
                  <Skeleton active className="m-4" />
                ) : (
                  addresses.map((address) => {
                    return (
                      <div
                        key={address._id}
                        className="border border-gray-300 p-5 flex flex-col justify-start items-start mb-4"
                      >
                        <div className="flex justify-start items-start gap-4">
                          <div>
                            <HomeOutlined />
                          </div>
                          <div className="flex flex-col justify-start items-start">
                            <Typography.Text>
                              {address?.addressLine1}
                            </Typography.Text>
                            <Typography.Text>
                              {address?.addressLine2}
                            </Typography.Text>
                            <Typography.Text>{address?.state}</Typography.Text>
                            <Typography.Text>{`${address?.city}, ${address?.landmark}`}</Typography.Text>
                            <Typography.Text>
                              {address?.pinCode}
                            </Typography.Text>
                            <div className="flex justify-start gap-7 mt-4">
                              <Typography.Text
                                strong
                                className="text-orange-500 cursor-pointer"
                                onClick={() => {
                                  setAddressDrawer(true),
                                    setSelectedAddress(address);
                                }}
                              >
                                EDIT
                              </Typography.Text>
                              <Popconfirm
                                title="Delete the address"
                                icon={
                                  <QuestionCircleOutlined
                                    style={{
                                      color: "orange",
                                    }}
                                  />
                                }
                                description="Are you sure to delete this address?"
                                onConfirm={() => handleDeleteAddress(address)}
                                onCancel
                                okText="Yes"
                                cancelText="No"
                              >
                                <Typography.Text
                                  strong
                                  className="text-orange-500 cursor-pointer"
                                >
                                  DELETE
                                </Typography.Text>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div>sknlklkslkdlknksd</div>
            )}
          </Col>
        </>
      )}
      {addressDrawer && (
        <AddressForm
          addressDrawer={addressDrawer}
          selectedAddress={selectedAddress}
          setAddressDrawer={setAddressDrawer}
          getUserAddresses={getUserAddresses}
          setSelectedAddress={setSelectedAddress}
        />
      )}
      {viewOrderDetails && (
        <ViewOrderDetails
          selectedOrder={selectedOrder}
          viewOrderDetails={viewOrderDetails}
          setViewOrderDetails={setViewOrderDetails}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </Row>
  );
};

export default Profile;
