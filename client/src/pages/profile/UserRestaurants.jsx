import { useEffect, useState } from "react";
import { getUserRestaurants } from "../../apiCalls/restaurant";
import { message, Avatar, List, Card, Typography, Tag } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const UserRestaurants = () => {
  const [userRestaurants, setUserRestaurants] = useState([]);
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

  useEffect(() => {
    getData();
  }, []);

  console.log(userRestaurants);
  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={userRestaurants}
      renderItem={(restaurant) => (
        <Card size="small" className="mb-2">
          <List.Item
            key={restaurant._id}
            actions={[
              <EditOutlined key={restaurant._id} />,
              <DeleteOutlined key={restaurant._id} />,
              !restaurant.isActive ? (
                <Tag
                  icon={<SyncOutlined spin />}
                  color="processing"
                  key={restaurant._id}
                >
                  Status : Pending
                </Tag>
              ) : (
                <Tag
                  icon={<CheckCircleOutlined />}
                  color="success"
                  key={restaurant._id}
                >
                  Status : Approved
                </Tag>
              ),
            ]}
          >
            <List.Item.Meta
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
                <Typography.Title level={5}>{restaurant.name}</Typography.Title>
              }
              description={restaurant.address}
            />
            {restaurant?.description}
          </List.Item>
        </Card>
      )}
    />
  );
};

export default UserRestaurants;
