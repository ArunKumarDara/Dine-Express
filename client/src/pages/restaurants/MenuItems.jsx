import { Modal, Table, message, Space } from "antd";
import { useEffect, useState } from "react";
import { getMenuItems } from "../../apiCalls/menuItem";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Type",
    dataIndex: "isVeg",
    key: "isVeg",
    render: (text) => {
      if (text) {
        return "Veg";
      } else {
        return "Non-Veg";
      }
    },
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

/* eslint-disable react/prop-types */
const MenuItems = ({
  toggleMenuItems,
  setToggleMenuItems,
  menuRestaurantId,
  setMenuRestaurantId,
}) => {
  const [menuItems, setMenuItems] = useState([]);

  const getData = async () => {
    try {
      const response = await getMenuItems({ restaurantId: menuRestaurantId });
      if (response.success) {
        message.success(response.message);
        setMenuItems(response.data);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(menuItems);

  return (
    <>
      <Modal
        open={toggleMenuItems}
        onCancel={() => {
          setToggleMenuItems(false);
          setMenuRestaurantId(null);
        }}
        footer={null}
        width="100vw"
        title="Menu Items"
      >
        <Table columns={columns} dataSource={menuItems} />
      </Modal>
    </>
  );
};

export default MenuItems;
