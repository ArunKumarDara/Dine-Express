import {
  message,
  Card,
  List,
  Row,
  Col,
  Space,
  Typography,
  Badge,
  Button,
  Rate,
  Grid,
  Affix,
  Breadcrumb,
  Input,
} from "antd";
import {
  PlusOutlined,
  ArrowRightOutlined,
  MinusOutlined,
  HomeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getMenuItems } from "../../apiCalls/menuItem";
import { useParams, useNavigate } from "react-router-dom";
import OrderDetails from "./OrderDetails";
import Spinner from "../../components/spinner/Spinner";

const { useBreakpoint } = Grid;

const Order = () => {
  const screens = useBreakpoint();
  const [menuItems, setMenuItems] = useState(null);
  const [originalMenuItems, setOriginalMenuItems] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderModal, setOrderModal] = useState(false);
  const navigate = useNavigate();

  const { restaurantId } = useParams();
  const getData = async () => {
    try {
      const response = await getMenuItems({ restaurantId: restaurantId });
      if (response.success) {
        message.success(response.message);
        setMenuItems(response.data);
        setOriginalMenuItems(response.data);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const handleAddItem = (item) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((each) => each._id === item._id);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map((each) =>
          each._id === item._id
            ? { ...each, quantity: each.quantity + 1 }
            : each
        );
      } else {
        updatedItems = [...prevItems, { ...item, quantity: 1 }];
      }
      const newTotalAmount = updatedItems.reduce(
        (sum, each) => sum + each.quantity * each.price,
        0
      );
      setTotalAmount(newTotalAmount);
      return updatedItems;
    });
  };
  const handleRemoveItem = (item) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((each) => each._id === item._id);
      let updatedItems;
      if (existingItem) {
        if (existingItem.quantity > 1) {
          updatedItems = prevItems.map((each) =>
            each._id === item._id
              ? { ...each, quantity: each.quantity - 1 }
              : each
          );
        } else {
          updatedItems = prevItems.filter((each) => each._id !== item._id);
        }
      } else {
        updatedItems = [...prevItems];
      }
      const newTotalAmount = updatedItems?.reduce(
        (sum, each) => sum + each.quantity * each.price,
        0
      );
      setTotalAmount(newTotalAmount);
      return updatedItems;
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleVegItems = () => {
    setMenuItems(menuItems.filter((item) => item.isVeg === true));
  };

  const handleClearFilter = () => {
    getData();
  };

  const handleSearchItems = (value) => {
    const searchedItems = originalMenuItems.filter((r) =>
      r.name.toLowerCase().includes(value.toLowerCase())
    );
    setMenuItems(searchedItems);
  };

  console.log(menuItems);

  return (
    <>
      <Row className="m-4">
        <Col span={24}>
          <Breadcrumb
            className="mb-4"
            items={[
              {
                title: <HomeOutlined onClick={() => navigate("/")} />,
              },
              {
                title: menuItems && menuItems[0]?.availableIn?.name,
              },
              {
                title: "Menu Items",
              },
            ]}
          />
        </Col>
        <Col span={24} className="mb-4">
          <Space>
            <Input.Search
              placeholder="search menu here"
              allowClear
              onChange={(e) => handleSearchItems(e.target.value)}
              onSearch={handleSearchItems}
            />
            <Button onClick={handleVegItems}>Pure Veg</Button>
            <Button onClick={handleClearFilter} icon={<CloseOutlined />}>
              Filter
            </Button>
          </Space>
        </Col>
        {!menuItems ? (
          <Spinner />
        ) : (
          <Col xs={24} sm={24} md={24} lg={16}>
            <List
              grid={{
                gutter: 12,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              dataSource={menuItems}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    title={
                      <Badge
                        dot
                        offset={[12, 12]}
                        color={item.isVeg ? "green" : "red"}
                      >
                        {item.name}
                      </Badge>
                    }
                    extra={
                      <Typography.Text
                        strong
                      >{`₹${item.price}`}</Typography.Text>
                    }
                  >
                    <Space direction="vertical">
                      <Rate disabled value={item.rating} size="small" />
                      <Typography.Text type="secondary">
                        {item.description}
                      </Typography.Text>
                    </Space>
                    <Space.Compact
                      block
                      className="flex justify-center items-center mt-3"
                    >
                      <Button
                        icon={<MinusOutlined />}
                        size="middle"
                        onClick={() => handleRemoveItem(item)}
                      >
                        Remove
                      </Button>
                      <Button
                        icon={<PlusOutlined />}
                        size="middle"
                        onClick={() => handleAddItem(item)}
                      >
                        Add
                      </Button>
                    </Space.Compact>
                  </Card>
                </List.Item>
              )}
            />
          </Col>
        )}
        {screens.md ? (
          <Col span={8}>
            {orderItems.length > 0 && (
              <>
                <Card title="Order Details" className="ml-3">
                  <List
                    itemLayout="horizontal"
                    dataSource={orderItems}
                    renderItem={(each) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div className="flex flex-col justify-start">
                              <Typography.Text strong>
                                {each.name}
                              </Typography.Text>
                              <Typography.Text type="success">{`₹${each.price}`}</Typography.Text>
                            </div>
                          }
                        />
                        <Typography.Text type="danger">
                          {each.quantity}
                        </Typography.Text>
                      </List.Item>
                    )}
                  />
                </Card>
                <Card className="ml-3 mt-3">
                  <Space className="flex justify-between items-center">
                    <Typography.Title level={5}>Total Amount</Typography.Title>
                    <Typography.Text type="success" strong>
                      {`₹${totalAmount}`}
                    </Typography.Text>
                  </Space>
                </Card>
                <div className="ml-3 mt-3">
                  <Button
                    type="primary"
                    size="large"
                    className="w-full"
                    onClick={() => setOrderModal(true)}
                  >
                    Proceed
                    <ArrowRightOutlined size="large" />
                  </Button>
                </div>
              </>
            )}
          </Col>
        ) : (
          orderItems.length > 0 && (
            <Affix offsetBottom={0} className="w-full">
              <div className="w-full">
                <Button
                  size="large"
                  className="w-full"
                  type="primary"
                  onClick={() => setOrderModal(true)}
                >
                  <Space>
                    {`${orderItems.reduce((acc, curr) => {
                      return acc + curr.quantity;
                    }, 0)} item(s) added`}
                    <ArrowRightOutlined />
                  </Space>
                </Button>
              </div>
            </Affix>
          )
        )}
      </Row>
      {orderModal && (
        <OrderDetails
          orderModal={orderModal}
          setOrderModal={setOrderModal}
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
        />
      )}
    </>
  );
};

export default Order;
