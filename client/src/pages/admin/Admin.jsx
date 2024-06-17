import { Tabs } from "antd";
import Restaurants from "./Restaurants";
import Orders from "./Orders";
import Account from "./Account";

const items = [
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
  {
    key: "3",
    label: "Account",
    children: <Account />,
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
