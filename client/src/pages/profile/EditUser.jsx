import { Drawer, Form, Input, InputNumber, message } from "antd";
import { useSelector } from "react-redux";
import { updateUserProfile } from "../../apiCalls/user";

// eslint-disable-next-line react/prop-types
const EditUser = ({ userDrawer, setUserDrawer }) => {
  const { user } = useSelector((state) => state.users);

  const handleFinish = async (values) => {
    try {
      const response = await updateUserProfile({ ...values, userId: user._id });
      if (response.success) {
        setUserDrawer(false);
        message.success("user profile updated. please refresh the page!!");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <Drawer
      open={userDrawer}
      onClose={() => setUserDrawer(false)}
      title="Edit Profile"
    >
      <Form
        layout="vertical"
        className="mt-4"
        initialValues={user}
        onFinish={handleFinish}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please enter your first name!",
            },
          ]}
        >
          <Input size="large" type="text" placeholder="Enter your first name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please enter your last name!",
            },
          ]}
        >
          <Input size="large" type="text" placeholder="Enter your last name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please enter your email!",
            },
          ]}
        >
          <Input size="large" type="email" placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            {
              type: "number",
              required: true,
              message: "Please enter your phone number!",
            },
          ]}
        >
          <InputNumber
            addonBefore="+91"
            size="large"
            className="w-full"
            maxLength={10}
          />
        </Form.Item>
        <button
          type="submit"
          className="w-full font-semibold text-white bg-orange-500 h-10"
        >
          UPDATE
        </button>
      </Form>
    </Drawer>
  );
};

export default EditUser;
