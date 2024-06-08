import { Modal, Form, Button, Input, message } from "antd";
import { useSelector } from "react-redux";
import { addRestaurant } from "../../apiCalls/restaurant";

// eslint-disable-next-line react/prop-types
const RestaurantForm = ({ toggleFormModal, setToggleFormModal }) => {
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    values.owner = user._id;
    try {
      const response = await addRestaurant(values);
      if (response.success) {
        message.success(response.message);
        setToggleFormModal(false);
      } else {
        message.error(response.message);
        setToggleFormModal(false);
      }
    } catch (error) {
      message.error(error);
    }
  };
  return (
    <>
      <Modal
        title="Add Restaurant"
        open={toggleFormModal}
        onCancel={() => setToggleFormModal(false)}
        footer={null}
        size="small"
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter Restaurant name" },
            ]}
          >
            <Input
              size="large"
              type="text"
              placeholder="Enter Restaurant name"
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter Address" }]}
          >
            <Input size="large" type="text" placeholder="Enter Address" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input size="large" type="text" placeholder="Enter Description" />
          </Form.Item>
          <Form.Item label="Wallpaper" name="image">
            <Input size="large" type="text" placeholder="Enter Image URL" />
          </Form.Item>
          <Button
            className="w-full"
            htmlType="submit"
            size="large"
            type="primary"
          >
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default RestaurantForm;
