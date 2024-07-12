import {
  message,
  List,
  Row,
  Col,
  Space,
  Typography,
  Affix,
  Breadcrumb,
  Input,
  Divider,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getMenuItems } from "../../apiCalls/menuItem";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { addItems, removeItems } from "../../redux/cartSlice";
import pluralize from "pluralize";
import "./order.css";
import nonVeg from "../../assets/nonVeg.png";
import veg from "../../assets/veg.png";

const Order = () => {
  const { cart } = useSelector((state) => state.cart);
  const [menuItems, setMenuItems] = useState(null);
  const [originalMenuItems, setOriginalMenuItems] = useState(null);
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleSearchItems = (value) => {
    const searchedItems = originalMenuItems.filter((r) =>
      r.name.toLowerCase().includes(value.toLowerCase())
    );
    setMenuItems(searchedItems);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="xs-m-4 lg:mt-4 lg:mb-4 lg:m-0">
      <Row className="flex justify-center items-center">
        <Col xs={24} lg={16}>
          <Breadcrumb
            className="mb-3"
            items={[
              {
                title: (
                  <Typography.Text
                    type="secondary"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </Typography.Text>
                ),
              },
              {
                title: menuItems && (
                  <Typography.Text type="secondary">
                    {menuItems[0]?.availableIn?.name}
                  </Typography.Text>
                ),
              },
            ]}
          />
        </Col>
        <Col xs={24} lg={16}>
          <div className="w-full text-center">
            <Divider>
              <Typography.Text type="secondary" style={{ textAlign: "center" }}>
                MENU
              </Typography.Text>
            </Divider>
          </div>
        </Col>
        <Col xs={24} lg={16} className="mb-4">
          <div>
            <Input.Search
              size="large"
              placeholder="search for dishes"
              allowClear
              onChange={(e) => handleSearchItems(e.target.value)}
              onSearch={handleSearchItems}
            />
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div className="flex justify-start items-center gap-4">
            {!filterVeg ? (
              <div
                className="border rounded-xl h-9 w-16 flex justify-center items-center p-2 cursor-pointer border-gray-300"
                onClick={() => {
                  setFilterVeg(true);
                  setMenuItems(menuItems.filter((item) => item.isVeg === true));
                }}
              >
                <div>
                  <img src={veg} className="w-7" />
                </div>
                <div className="w-7 h-3 bg-gray-300 rounded-r-md"></div>
              </div>
            ) : (
              <div
                className="border rounded-xl h-9 w-16 flex justify-center items-center p-2 cursor-pointer border-gray-300"
                onClick={() => {
                  setFilterVeg(false);
                  setMenuItems(originalMenuItems);
                }}
              >
                <div className="w-7 h-3 bg-[#60b246] rounded-l-md"></div>
                <div>
                  <img src={veg} className="w-7" />
                </div>
              </div>
            )}
            {!filterNonVeg ? (
              <div
                className="border rounded-xl h-9 w-16 flex justify-center items-center p-2 cursor-pointer border-gray-300"
                onClick={() => {
                  setFilterNonVeg(true);
                  setMenuItems(
                    menuItems.filter((item) => item.isVeg === false)
                  );
                }}
              >
                <div>
                  <img src={nonVeg} className="w-7" />
                </div>
                <div className="w-7 h-3 bg-gray-300 rounded-r-md"></div>
              </div>
            ) : (
              <div
                className="border rounded-xl h-9 w-16 flex justify-center items-center p-2 cursor-pointer border-gray-300"
                onClick={() => {
                  setFilterNonVeg(false);
                  setMenuItems(originalMenuItems);
                }}
              >
                <div className="w-7 h-3 bg-red-700 rounded-l-md"></div>
                <div>
                  <img src={nonVeg} className="w-7" />
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <Divider />
        </Col>
        {!menuItems ? (
          <Spinner />
        ) : (
          <Col xs={24} lg={16}>
            <List
              itemLayout="horizontal"
              dataSource={menuItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col justify-start gap-0">
                          <img
                            src={item.isVeg ? veg : nonVeg}
                            className="w-4"
                          />
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                          >
                            {item.name}
                          </Typography.Title>
                          <Typography.Text
                            style={{ marginTop: 0 }}
                            strong
                          >{`₹${item.price}`}</Typography.Text>
                        </div>
                        <div>
                          {cart.find(
                            (cartItem) => cartItem._id === item._id
                          ) ? (
                            <div className="border p-3 flex justify-between items-center w-28 h-10 cursor-pointer">
                              <MinusOutlined
                                className="hover:text-orange-500"
                                onClick={() => dispatch(removeItems(item))}
                              />
                              <Typography.Title
                                style={{ color: "#60b246" }}
                                level={5}
                              >
                                {cart.map(
                                  (each) =>
                                    each._id === item._id && each.quantity
                                )}
                              </Typography.Title>
                              <PlusOutlined
                                onClick={() => dispatch(addItems(item))}
                                className="hover:text-[#60b246]"
                              />
                            </div>
                          ) : (
                            <button
                              className="text-[#60b246] font-bold w-28 h-10  border border-gray-200 hover:bg-gray-200"
                              onClick={() => dispatch(addItems(item))}
                            >
                              ADD
                            </button>
                          )}
                        </div>
                      </div>
                    }
                    description={
                      <Typography.Text type="secondary">
                        {item.description}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Col>
        )}
        <Col xs={24} lg={16}>
          {cart.length > 0 && (
            <Affix offsetBottom={0} className="w-full">
              <div className="w-full">
                <button
                  className="w-full bg-[#60b246] h-12 font-semibold text-white pl-4 pr-4"
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
                    <Space>
                      <Typography.Text strong style={{ color: "white" }}>
                        VIEW CART
                      </Typography.Text>
                      <ShoppingCartOutlined />
                    </Space>
                  </Space>
                </button>
              </div>
            </Affix>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Order;
