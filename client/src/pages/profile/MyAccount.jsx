/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import {
  Card,
  Avatar,
  Space,
  Typography,
  Collapse,
  Button,
  message,
  List,
  Popover,
} from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import AddressForm from "./AddressForm";
import { getAllAddressByUser } from "../../apiCalls/address";

// eslint-disable-next-line react/prop-types
export const AddressBook = ({
  address,
  setToggleAddressModal,
  setSelectedAddress,
  setTitle,
}) => {
  const handleEdit = (item) => {
    setToggleAddressModal(true);
    setSelectedAddress(item);
    setTitle("edit");
  };

  const handleDelete = (item) => {
    console.log(item);
  };

  return (
    <>
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
        dataSource={address}
        renderItem={(item) => (
          <List.Item>
            <Card size="small">
              <Space direction="vertical" size={0} className="w-full">
                <Space className="flex justify-between">
                  <Typography.Text>{`${item.addressLine1},`}</Typography.Text>
                  <Popover
                    content={
                      <div className="flex flex-col justify-start items-start">
                        <Button type="link" onClick={() => handleEdit(item)}>
                          <EditOutlined />
                          Edit
                        </Button>
                        <Button
                          type="link"
                          danger
                          onClick={() => handleDelete(item)}
                        >
                          <DeleteOutlined />
                          Delete
                        </Button>
                      </div>
                    }
                    placement="leftBottom"
                  >
                    <Button type="link">
                      <MoreOutlined size="large" />
                    </Button>
                  </Popover>
                </Space>
                <Typography.Text>{`${item?.addressLine2},`}</Typography.Text>
                <Typography.Text>{`${item.state},`}</Typography.Text>
                <Typography.Text>{`${item.city}, ${item?.landmark},`}</Typography.Text>
                <Typography.Text>{`${item.pinCode}.`}</Typography.Text>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

const MyAccount = () => {
  const { user } = useSelector((state) => state.users);
  const [toggleAddressModal, setToggleAddressModal] = useState(false);
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [title, setTitle] = useState("add");

  const handleAddress = (e) => {
    e.stopPropagation();
    setToggleAddressModal(true);
  };

  const getData = async () => {
    try {
      const response = await getAllAddressByUser({ userId: user._id });
      if (response.success) {
        message.success(response.message);
        setAddress(response.data);
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
      <Card size="large">
        <Space direction="vertical" size={0}>
          <Space>
            <Avatar
              style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
              size="large"
            >
              {`${user.firstName[0]} ${user.lastName[0]}`}
            </Avatar>
            <Space direction="vertical" className="ml-3">
              <Typography.Title level={5} style={{ margin: 0 }}>
                {`${user.firstName} ${user.lastName}`}
              </Typography.Title>
              <Typography.Text>{user.email}</Typography.Text>
            </Space>
          </Space>
        </Space>
      </Card>
      <Collapse
        size="small"
        className="mt-4"
        items={[
          {
            key: "1",
            label: (
              <Space className="flex justify-between w-full">
                <Typography.Text strong>Address Book</Typography.Text>
                <div>
                  <Button type="link" onClick={(e) => handleAddress(e)}>
                    Add Address
                  </Button>
                </div>
              </Space>
            ),
            children: (
              <AddressBook
                address={address}
                setToggleAddressModal={setToggleAddressModal}
                setSelectedAddress={setSelectedAddress}
                setTitle={setTitle}
              />
            ),
          },
        ]}
        defaultActiveKey={["1"]}
      />
      {toggleAddressModal && (
        <AddressForm
          toggleAddressModal={toggleAddressModal}
          setToggleAddressModal={setToggleAddressModal}
          getData={getData}
          selectedAddress={selectedAddress}
          title={title}
          setTitle={setTitle}
        />
      )}
    </>
  );
};

export default MyAccount;
