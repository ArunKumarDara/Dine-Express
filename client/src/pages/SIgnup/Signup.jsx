import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  message,
  Row,
  Col,
  Card,
  InputNumber,
} from "antd";
import { registerUser } from "../../apiCalls/user";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const handleFinish = async (values) => {
    try {
      const response = await registerUser(values);
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Row className="justify-center items-center h-screen">
      <Col xs={20} md={12} lg={8}>
        <Card className="shadow-lg">
          <Typography.Title level={5} className="text-center">
            Welcome to Dine Express, Please Sign Up!
          </Typography.Title>
          <hr />
          <Form layout="vertical" className="mt-4" onFinish={handleFinish}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please enter your first name!",
                },
              ]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
              }}
            >
              <Input
                size="large"
                type="text"
                placeholder="Enter your first name"
              />
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
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 8px",
              }}
            >
              <Input
                size="large"
                type="text"
                placeholder="Enter your last name"
              />
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
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input
                size="large"
                type="password"
                placeholder="Enter your password"
              />
            </Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              className="w-full"
            >
              Create Account
            </Button>
          </Form>
          <Space className="mt-2">
            <Typography.Text>Already have an account? </Typography.Text>
            <Link to="/user-login">
              <Typography.Text type="danger" className="cursor-pointer">
                Login
              </Typography.Text>
            </Link>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default Signup;
