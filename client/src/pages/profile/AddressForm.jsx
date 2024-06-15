/* eslint-disable react/prop-types */
import { Form, Modal, Input, Button, Select, message } from "antd";
import { useSelector } from "react-redux";
import { addAddress, editAddress } from "../../apiCalls/address";

const AddressForm = ({
  toggleAddressModal,
  setToggleAddressModal,
  getData,
  selectedAddress,
  title,
  setTitle,
}) => {
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    if (title === "add") {
      try {
        const response = await addAddress({ ...values, userId: user._id });
        if (response.success) {
          message.success(response.message);
          setToggleAddressModal(false);
          getData();
        } else {
          message.error(response.message);
          setToggleAddressModal(false);
        }
      } catch (error) {
        message.error(error);
      }
    } else {
      try {
        const response = await editAddress({
          addressId: selectedAddress._id,
          address: values,
        });
        if (response.success) {
          message.success(response.message);
          setToggleAddressModal(false);
          setTitle("add");
          getData();
        } else {
          message.error(response.message);
          setToggleAddressModal(false);
        }
      } catch (error) {
        message.error(error);
      }
    }
  };

  return (
    <>
      <Modal
        title={title === "add" ? "Create Address" : "Edit Address"}
        open={toggleAddressModal}
        onCancel={() => {
          setToggleAddressModal(false), setTitle("add");
        }}
        footer={null}
        size="small"
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
              defaultValue={false}
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
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
      </Modal>
    </>
  );
};

export default AddressForm;
