import { Tabs } from "antd";
import Restaurants from "./Restaurants";
import Orders from "./Orders";
import UserRestaurants from "../profile/UserRestaurants";

const items = [
  {
    key: "0",
    label: "My Restaurants",
    children: <UserRestaurants />,
  },
  {
    key: "1",
    label: "Restaurants",
    children: <Restaurants />,
  },
  {
    key: "2",
    label: "Orders",
    children: <Orders />,
  },
];

const Admin = () => {
  return (
    <div className="m-4">
      <Tabs items={items} defaultActiveKey="2" type="card" className="mt-2" />
    </div>
  );
};

export default Admin;
