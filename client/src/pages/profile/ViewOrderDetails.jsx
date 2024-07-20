/* eslint-disable react/prop-types */
import { Drawer, Typography } from "antd";
import { ArrowDownOutlined, EnvironmentOutlined } from "@ant-design/icons";
import nonVeg from "../../assets/nonVeg.png";
import veg from "../../assets/veg.png";

let restaurantCharges = 0;
let deliveryFee = 50;
let platformFee = 10;

const ViewOrderDetails = ({
  selectedOrder,
  viewOrderDetails,
  setViewOrderDetails,
  setSelectedOrder,
}) => {
  return (
    <Drawer
      open={viewOrderDetails}
      onClose={() => {
        setViewOrderDetails(false), setSelectedOrder(null);
      }}
      title={`Order #${selectedOrder.orderNo}`}
    >
      <div className="flex flex-col justify-start items-start gap-5">
        <div className="flex justify-start items-start gap-4">
          <div className="flex flex-col justify-start items-start gap-8">
            <EnvironmentOutlined size="large" className="mt-1" />
            <ArrowDownOutlined size="large" />
          </div>
          <div className="flex flex-col justify-start items-start">
            <Typography.Text strong>
              {selectedOrder.restaurant.name}
            </Typography.Text>
            <Typography.Text type="secondary">
              {selectedOrder.restaurant.address}
            </Typography.Text>
          </div>
        </div>
        <div className="flex justify-start items-start gap-4">
          <EnvironmentOutlined size="large" className="mt-1" />
          <div className="flex flex-col justify-start items-start">
            <Typography.Text strong>Home</Typography.Text>
            <div className="flex flex-col justify-start items-start">
              <Typography.Text type="secondary">
                {selectedOrder?.deliverTo?.addressLine1}
              </Typography.Text>
              <Typography.Text type="secondary">
                {selectedOrder?.deliverTo?.addressLine2}
              </Typography.Text>
              <Typography.Text type="secondary">
                {selectedOrder?.deliverTo?.state}
              </Typography.Text>
              <Typography.Text type="secondary">{`${selectedOrder?.deliverTo?.city}, ${selectedOrder?.deliverTo?.landmark}`}</Typography.Text>
              <Typography.Text type="secondary">
                {selectedOrder?.deliverTo?.pinCode}
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
      <hr className="mb-3 mt-2" />
      {selectedOrder.menuItems.map((item) => {
        return (
          <div key={item.item._id}>
            <div className="flex justify-between">
              <div className="flex justify-start items-center">
                <img
                  src={item.item.isVeg ? veg : nonVeg}
                  className="w-3 mr-2"
                />
                <Typography.Text
                  strong
                >{`${item.item.name} x ${item.quantity}`}</Typography.Text>
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {`₹${item.item.price * item.quantity}`}
              </Typography.Text>
            </div>
          </div>
        );
      })}
      <hr className="mb-2 mt-3" />
      <div className="flex justify-between items-center mb-1 w-full">
        <Typography.Text strong>Item total</Typography.Text>
        <Typography.Text strong>
          {`₹${selectedOrder.menuItems.reduce((acc, item) => {
            return acc + item.item.price * item.quantity;
          }, 0)}`}
        </Typography.Text>
      </div>
      <div className="w-full flex justify-between items-center mb-1">
        <Typography.Text type="secondary">Delivery Fee</Typography.Text>
        <Typography.Text type="secondary">{`₹${deliveryFee}`}</Typography.Text>
      </div>
      <div className="w-full flex justify-between items-center mb-1">
        <Typography.Text type="secondary">Platform fee</Typography.Text>
        <Typography.Text type="secondary">{`₹${platformFee}`}</Typography.Text>
      </div>
      <div className="w-full flex justify-between items-center mb-1">
        <Typography.Text type="secondary">
          GST and Restaurant Charges
        </Typography.Text>
        <Typography.Text type="secondary">
          {`₹${restaurantCharges}`}
        </Typography.Text>
      </div>
      <hr className="mb-2 mt-2" />
      <div className="flex justify-between">
        <Typography.Text strong>BILL TOTAL</Typography.Text>
        <Typography.Text strong>
          {`₹${
            selectedOrder.menuItems.reduce((acc, item) => {
              return acc + item.item.price * item.quantity;
            }, 0) +
            deliveryFee +
            platformFee +
            restaurantCharges
          }`}
        </Typography.Text>
      </div>
    </Drawer>
  );
};

export default ViewOrderDetails;
