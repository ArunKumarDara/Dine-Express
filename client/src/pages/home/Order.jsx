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
  MinusOutlined,
  HomeOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getMenuItems } from "../../apiCalls/menuItem";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { addItems, removeItems } from "../../redux/cartSlice";
import pluralize from "pluralize";
const { useBreakpoint } = Grid;

const Order = () => {
  const { cart } = useSelector((state) => state.cart);
  const [menuItems, setMenuItems] = useState(null);
  const [originalMenuItems, setOriginalMenuItems] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const screens = useBreakpoint();

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
    dispatch(addItems(item));
  };
  const handleRemoveItem = (item) => {
    dispatch(removeItems(item));
  };

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

  useEffect(() => {
    getData();
  }, []);

  console.log(cart);

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
            {cart.length > 0 && (
              <>
                <Card title="Order Details" className="ml-3">
                  <List
                    itemLayout="horizontal"
                    dataSource={cart}
                    renderItem={(each) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div className="flex flex-col justify-start">
                              <Typography.Text strong>
                                {each.name}
                              </Typography.Text>
                              <Typography.Text type="danger">
                                {each.quantity}
                              </Typography.Text>
                            </div>
                          }
                        />
                        <Typography.Text type="success">{`₹${each.price}`}</Typography.Text>
                      </List.Item>
                    )}
                  />
                </Card>
                <Card className="ml-3 mt-3">
                  <Space className="flex justify-between items-center">
                    <Typography.Title level={5}>Total Amount</Typography.Title>
                    <Typography.Text type="success" strong>
                      {`₹${cart.reduce((acc, item) => {
                        return acc + item.price * item.quantity;
                      }, 0)}`}
                    </Typography.Text>
                  </Space>
                </Card>
                <div className="ml-3 mt-3">
                  <Button
                    type="primary"
                    size="large"
                    className="w-full"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                    <ArrowRightOutlined size="large" />
                  </Button>
                </div>
              </>
            )}
          </Col>
        ) : (
          cart.length > 0 && (
            <Affix offsetBottom={0} className="w-full">
              <div className="w-full">
                <Button
                  size="large"
                  className="w-full"
                  type="primary"
                  onClick={() => navigate("/checkout")}
                >
                  <Space className="flex justify-between items-center w-full">
                    <Typography.Text strong style={{ color: "white" }}>
                      {`${cart.reduce((acc, curr) => {
                        return acc + curr.quantity;
                      }, 0)} ${pluralize(
                        "item",
                        cart.reduce((acc, curr) => {
                          return acc + curr.quantity;
                        }, 0)
                      )} added`}
                    </Typography.Text>
                    <Typography.Text strong style={{ color: "white" }}>
                      <ShoppingCartOutlined /> View cart
                    </Typography.Text>
                  </Space>
                </Button>
              </div>
            </Affix>
          )
        )}
      </Row>
    </>
  );
};

export default Order;
