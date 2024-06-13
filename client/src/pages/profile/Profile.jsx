import { Tabs } from "antd";
import UserRestaurants from "./UserRestaurants";
import UserOrders from "./UserOrders";
import MyAccount from "./MyAccount";

const items = [
  {
    key: "1",
    label: "My Restaurants",
    children: <UserRestaurants />,
  },
  {
    key: "2",
    label: "Orders",
    children: <UserOrders />,
  },
  {
    key: "3",
    label: "Account",
    children: <MyAccount />,
  },
];

const Profile = () => {
  return (
    <div className="m-4">
      <Tabs items={items} defaultActiveKey="1" type="card" className="mt-2" />
    </div>
  );
};

export default Profile;
