/* eslint-disable react/prop-types */
import { Form, Input, Select, message, Drawer } from "antd";
import { editAddress } from "../../apiCalls/address";

const AddressForm = ({
  addressDrawer,
  setAddressDrawer,
  getUserAddresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const onFinish = async (values) => {
    try {
      const response = await editAddress({
        addressId: selectedAddress._id,
        address: values,
      });
      if (response.success) {
        getUserAddresses();
        setSelectedAddress(null);
        setAddressDrawer(false);
      } else {
        message.error(response.message);
        setAddressDrawer(false);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <>
      <Drawer
        open={addressDrawer}
        onClose={() => setAddressDrawer(false)}
        title="Edit Address"
        placement="left"
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={selectedAddress}
        >
          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            rules={[{ required: true, message: "Please enter Address line 1" }]}
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
            rules={[{ required: true, message: "Please enter Address line 2" }]}
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
            rules={[{ required: true, message: "Please enter your pincode" }]}
          >
            <Input type="text" placeholder="enter your pincode" size="large" />
          </Form.Item>
          <Form.Item label="Make it Primary Address" name="isPrimary">
            <Select
              size="large"
              placeholder="Make it primary address"
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              className="w-full font-semibold text-white bg-orange-500 h-10"
            >
              SUBMIT
            </button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default AddressForm;
