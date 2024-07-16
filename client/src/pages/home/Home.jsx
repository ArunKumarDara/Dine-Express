import { useEffect, useState } from "react";
import { getAllActiveRestaurants } from "../../apiCalls/restaurant";
import {
  message,
  List,
  Card,
  Space,
  Typography,
  Avatar,
  Input,
  Tag,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { updateOrderById } from "../../apiCalls/order";

const { Search } = Input;

const Home = () => {
  const [restaurants, setRestaurants] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

  const getData = async () => {
    try {
      const response = await getAllActiveRestaurants();
      if (response.success) {
        message.success(response.message);
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const getOrderDetails = async () => {
    try {
      const response = await updateOrderById(orderId);
      if (response.success) {
        console.log(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const onSearch = (value) => {
    const searchedRestaurants = restaurants.filter((r) =>
      r.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRestaurants(searchedRestaurants);
  };

  useEffect(() => {
    getData();
    if (orderId) {
      getOrderDetails();
    }
  }, [orderId]);

  return (
    <div className="m-4">
      <Search
        placeholder="Search Restaurants"
        allowClear
        onChange={(e) => onSearch(e.target.value)}
        onSearch={onSearch}
        className="w-full md:w-[50vw] mb-4"
        size="large"
      />
      {!restaurants ? (
        <Spinner />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 2,
            xxl: 3,
          }}
          dataSource={filteredRestaurants}
          renderItem={(restaurant) => (
            <List.Item>
              <Card
                size="large"
                className="transform transition duration-200 hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "orange",
                        verticalAlign: "middle",
                      }}
                      size="large"
                    >
                      {restaurant.name[0]}
                    </Avatar>
                  }
                  title={
                    <Space direction="vertical" size={0} className="w-full">
                      <Space className="flex justify-between items-center">
                        <Typography.Title level={5} style={{ margin: 0 }}>
                          {restaurant.name}
                        </Typography.Title>

                        <Tag color="orange">
                          {`${restaurant.rating} `}
                          <StarFilled size="small" />
                        </Tag>
                      </Space>
                      <Typography.Text
                        type="secondary"
                        className="text-sm font-normal"
                      >
                        {restaurant.address}
                      </Typography.Text>
                    </Space>
                  }
                  description={
                    <Typography.Text>{restaurant.description}</Typography.Text>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Home;
