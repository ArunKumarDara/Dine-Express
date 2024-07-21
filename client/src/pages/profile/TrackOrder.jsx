/* eslint-disable react/prop-types */
import { Divider, Drawer, Typography } from "antd";
import moment from "moment";
import pluralize from "pluralize";
import { FileDoneOutlined } from "@ant-design/icons";

const TrackOrder = ({ trackDrawer, setTrackDrawer, selectedOrder }) => {
  const totalItems = selectedOrder.menuItems.reduce(
    (acc, menuItem) => acc + menuItem.quantity,
    0
  );

  const statuses = [
    "pending_payment",
    "payment_completed",
    "confirmed",
    "preparing",
    "ready",
    "completed",
    "delivered",
    "cancelled",
  ];

  const statusMessages = {
    pending_payment: "Order received, waiting for payment.",
    payment_completed: "Payment completed, waiting for confirmation.",
    confirmed: "Order confirmed, preparing your food.",
    preparing: "Food is being prepared.",
    ready: "Food is ready for pickup/delivery.",
    completed: "Order completed.",
    delivered: "Order delivered.",
    cancelled: "Order cancelled.",
  };

  const currentStatusIndex = statuses.indexOf(selectedOrder.status);
  const nextStatusIndex = currentStatusIndex + 1;
  const laterStatusIndex = currentStatusIndex + 2;

  const renderStatusMessage = (status, timeLabel, withIcon = false) => {
    const message = statusMessages[status];
    return (
      <div className="flex justify-start items-start gap-3">
        {withIcon && (
          <div className="bg-blue-400 p-2 flex flex-col justify-center items-center w-32">
            <FileDoneOutlined className="mt-2" />
            <Typography.Text className="text-white">
              {timeLabel}
            </Typography.Text>
          </div>
        )}
        <div className="flex flex-col justify-start items-start">
          {withIcon && <Typography.Text strong>{message}</Typography.Text>}
          <Typography.Text type="secondary">
            {withIcon
              ? `${selectedOrder.restaurant.name} is processing your order.`
              : message}
          </Typography.Text>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      open={trackDrawer}
      onClose={() => setTrackDrawer(false)}
      title="Live tracking details"
      placement="left"
    >
      <div className="border border-gray-300 p-4 flex flex-col justify-start items-start mb-3">
        <Typography.Text
          type="secondary"
          className="mb-1"
        >{`Order #${selectedOrder?.orderNo}`}</Typography.Text>
        <Typography.Text strong>
          {selectedOrder.restaurant.name}
        </Typography.Text>
        <div className="flex justify-start items-center">
          <Typography.Text type="secondary">
            {moment(selectedOrder.createdAt).format("LLL")}
          </Typography.Text>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
            {totalItems} {pluralize("item", totalItems)}
          </Typography.Text>
          <Divider type="vertical" />
          <Typography.Text type="secondary">
            {`₹${selectedOrder.totalAmount}`}
          </Typography.Text>
        </div>
        <Divider className="mt-2 mb-2" />
        <Typography.Text className="text-gray-500">
          For help and queries, please contact below number
        </Typography.Text>
        <Typography.Text strong style={{ color: "orange" }}>
          9100401610
        </Typography.Text>
      </div>
      <div className="border border-gray-300 p-4 flex flex-col justify-start items-start gap-3">
        {renderStatusMessage(selectedOrder.status, "Now", true)}
        {selectedOrder.status !== "delivered" &&
          selectedOrder.status !== "cancelled" &&
          nextStatusIndex < statuses.length && (
            <>
              <Divider className="mt-2 mb-2" />
              <div className="flex justify-start items-center gap-6">
                <div className="p-1 border border-gray-300 w-20 text-center">
                  <Typography.Text type="secondary">NEXT</Typography.Text>
                </div>
                {renderStatusMessage(statuses[nextStatusIndex], "Next")}
              </div>
            </>
          )}
        {selectedOrder.status !== "delivered" &&
          selectedOrder.status !== "cancelled" &&
          laterStatusIndex < statuses.length && (
            <>
              <Divider className="mt-2 mb-2" />
              <div className="flex justify-start items-center gap-6">
                <div className="p-1 border border-gray-300 w-20 text-center">
                  <Typography.Text type="secondary">LATER</Typography.Text>
                </div>
                {renderStatusMessage(statuses[laterStatusIndex], "Later")}
              </div>
            </>
          )}
      </div>
    </Drawer>
  );
};

export default TrackOrder;
