import { Modal, Form, Input, Radio, Button, message } from "antd";
import { useState } from "react";
import { addMenuItem } from "../../apiCalls/menuItem";

/* eslint-disable react/prop-types */
const MenuForm = ({
  toggleMenuModal,
  setToggleMenuModal,
  restaurantId,
  setRestaurantId,
}) => {
  const [value, setValue] = useState(1);
  const onFinish = async (values) => {
    if (values.isVeg === 1) {
      values.isVeg = true;
    } else {
      values.isVeg = false;
    }
    values.availableIn = restaurantId;
    try {
      const response = await addMenuItem(values);
      if (response.success) {
        message.success(response.message);
        setToggleMenuModal(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };
  return (
    <Modal
      title="Add Menu Items"
      open={toggleMenuModal}
      onCancel={() => {
        setToggleMenuModal(false);
        setRestaurantId(null);
      }}
      footer={null}
      size="small"
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please Enter item name" }]}
        >
          <Input size="large" type="text" placeholder="Enter Item Name" />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please Enter item Price" }]}
        >
          <Input size="large" type="number" placeholder="Enter Item Price" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please Enter Description" }]}
        >
          <Input size="large" type="text" placeholder="Enter Description" />
        </Form.Item>
        <Form.Item label="Image URL" name="image">
          <Input size="large" type="text" placeholder="Enter Image URL" />
        </Form.Item>
        <Form.Item label="Type" name="isVeg">
          <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
            <Radio value={1}>Veg</Radio>
            <Radio value={2}>Non-Veg</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="w-full" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default MenuForm;
