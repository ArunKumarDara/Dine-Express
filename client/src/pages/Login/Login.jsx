import {
  Form,
  Input,
  Typography,
  Space,
  Button,
  message,
  Row,
  Col,
  Card,
} from "antd";
import { loginUser } from "../../apiCalls/user";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleFinish = async (values) => {
    try {
      const response = await loginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("tokenForDineExpress", response.data);
        navigate("/");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message(error);
    }
  };

  return (
    <Row className="justify-center items-center h-screen">
      <Col xs={20} md={12} lg={8}>
        <Card className="shadow-lg">
          <Typography.Title level={5} className="text-center">
            Welcome to Dine Express, Please Login!
          </Typography.Title>
          <hr />
          <Form layout="vertical" onFinish={handleFinish} className="mt-4">
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
              label="Password"
              name="password"
              rules={[
                {
                  type: "password",
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
              Login
            </Button>
          </Form>
          <Space className="mt-2">
            <Typography.Text>New To DineExpress? </Typography.Text>
            <Link to="/signup">
              <Typography.Text type="danger" className="cursor-pointer">
                Create account
              </Typography.Text>
            </Link>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
