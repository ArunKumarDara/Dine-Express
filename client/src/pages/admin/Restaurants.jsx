// const Restaurants = () => {
//   return <div>Restaurants</div>;
// };

// export default Restaurants;

import { useEffect, useState } from "react";
import {
  getAllRestaurants,
  actionOnRestaurant,
} from "../../apiCalls/restaurant";
import { message, Tag, Button, Table } from "antd";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
// import { useSelector } from "react-redux";
// import RestaurantForm from "../restaurants/RestaurantForm";
// import MenuForm from "../restaurants/MenuForm";
// import MenuItems from "../restaurants/MenuItems";
import Spinner from "../../components/spinner/Spinner";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  //   const [toggleFormModal, setToggleFormModal] = useState(false);
  //   const [toggleMenuModal, setToggleMenuModal] = useState(false);
  //   const [userRestaurant, setUserRestaurant] = useState(null);
  //   const [restaurantId, setRestaurantId] = useState(null);
  //   const [menuRestaurantId, setMenuRestaurantId] = useState(null);
  //   const [toggleMenuItems, setToggleMenuItems] = useState(false);
  //   const [formType, setFormType] = useState("add");
  //   const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      const response = await getAllRestaurants();
      if (response.success) {
        setRestaurants(response.data);
      } else {
        message.error(response.message);
      }
      setRestaurants(response.data);
    } catch (error) {
      message.error(error);
    }
  };

  const handleAction = async (restaurant) => {
    try {
      const response = await actionOnRestaurant(restaurant);
      if (response.success) {
        message.success(response.message);
        await getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  const columns = [
    {
      title: "Restaurant",
      key: "restaurant",
      dataIndex: "name",
    },
    {
      title: "Created by",
      key: "owner",
      dataIndex: "name",
      render: (text, record) => {
        return `${record.owner.firstName} ${record.owner.lastName}`;
      },
    },
    {
      title: "Address",
      key: "address",
      dataIndex: "address",
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "isActive",
      render: (text) => {
        return text ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Approved
          </Tag>
        ) : (
          <Tag icon={<SyncOutlined spin />} color="processing">
            Pending
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text) => (
        <Button type="link" onClick={() => handleAction(text)}>
          {text.isActive ? "Disable" : "Approve"}
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  //   const handleDelete = async (values) => {
  //     try {
  //       values.restaurantId = values._id;
  //       const response = await deleteRestaurant(values);
  //       if (response.success) {
  //         message.success(response.message);
  //         getData();
  //       } else {
  //         message.error(response.message);
  //       }
  //     } catch (error) {
  //       message.error(error);
  //     }
  //   };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="w-full flex justify-end mb-4">
        <Button>Add Restaurant</Button>
      </div>
      {restaurants.length == 0 ? (
        <Spinner />
      ) : (
        <Table
          dataSource={restaurants}
          columns={columns}
          scroll={{
            x: 700,
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        />
      )}

      {/* {toggleFormModal && (
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
      )} */}
    </>
  );
};

export default Restaurants;
