import { useEffect, useState } from "react";
import {
  deleteRestaurant,
  getUserRestaurants,
} from "../../apiCalls/restaurant";
import {
  message,
  Avatar,
  List,
  Card,
  Typography,
  Tag,
  Button,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import RestaurantForm from "../restaurants/RestaurantForm";
import MenuForm from "../restaurants/MenuForm";
import MenuItems from "../restaurants/MenuItems";
import Spinner from "../../components/spinner/Spinner";

const UserRestaurants = () => {
  const [userRestaurants, setUserRestaurants] = useState([]);
  const [toggleFormModal, setToggleFormModal] = useState(false);
  const [toggleMenuModal, setToggleMenuModal] = useState(false);
  const [userRestaurant, setUserRestaurant] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [menuRestaurantId, setMenuRestaurantId] = useState(null);
  const [toggleMenuItems, setToggleMenuItems] = useState(false);
  const [formType, setFormType] = useState("add");
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      const response = await getUserRestaurants({ owner: user._id });
      if (response.success) {
        setUserRestaurants(response.data);
      } else {
        message.error(response.message);
      }
      setUserRestaurants(response.data);
    } catch (error) {
      message.error(error);
    }
  };

  const handleDelete = async (values) => {
    try {
      values.restaurantId = values._id;
      const response = await deleteRestaurant(values);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="w-full flex justify-end mb-4">
        <Button onClick={() => setToggleFormModal(true)}>Add Restaurant</Button>
      </div>
      {userRestaurants.length == 0 ? (
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
            xxl: 2,
          }}
          dataSource={userRestaurants}
          renderItem={(restaurant) => (
            <List.Item key={restaurant._id}>
              <Card
                size="large"
                actions={[
                  <EditOutlined
                    key={restaurant._id}
                    onClick={() => {
                      setToggleFormModal(true);
                      setFormType("edit");
                      setUserRestaurant(restaurant);
                    }}
                  />,
                  <DeleteOutlined
                    key={restaurant._id}
                    onClick={() => handleDelete(restaurant)}
                  />,
                  <Button
                    key={restaurant._id}
                    disabled={!restaurant.isActive}
                    size="small"
                    onClick={() => {
                      setMenuRestaurantId(restaurant._id);
                      setToggleMenuItems(true);
                    }}
                  >
                    <BookOutlined />
                  </Button>,
                  !restaurant.isActive ? (
                    <Tag
                      icon={<SyncOutlined spin />}
                      color="processing"
                      key={restaurant._id}
                    >
                      Pending
                    </Tag>
                  ) : (
                    <Tag
                      icon={<CheckCircleOutlined />}
                      color="success"
                      key={restaurant._id}
                    >
                      Active
                    </Tag>
                  ),
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "#f56a00",
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
                        {restaurant.isActive && (
                          <Button
                            type="link"
                            onClick={() => {
                              setToggleMenuModal(true);
                              setRestaurantId(restaurant._id);
                            }}
                          >
                            Add Menu
                          </Button>
                        )}
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

      {toggleFormModal && (
        <RestaurantForm
          toggleFormModal={toggleFormModal}
          setToggleFormModal={setToggleFormModal}
          userRestaurant={userRestaurant}
          formType={formType}
          setUserRestaurant={setUserRestaurant}
          getData={getData}
        />
      )}
      {toggleMenuModal && (
        <MenuForm
          toggleMenuModal={toggleMenuModal}
          setToggleMenuModal={setToggleMenuModal}
          restaurantId={restaurantId}
          setRestaurantId={setRestaurantId}
        />
      )}
      {toggleMenuItems && (
        <MenuItems
          toggleMenuItems={toggleMenuItems}
          setToggleMenuItems={setToggleMenuItems}
          menuRestaurantId={menuRestaurantId}
          setMenuRestaurantId={setMenuRestaurantId}
        />
      )}
    </>
  );
};

export default UserRestaurants;
