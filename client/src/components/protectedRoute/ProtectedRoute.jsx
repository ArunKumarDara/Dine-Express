import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { getCurrentUser } from "../../apiCalls/user";
import { Avatar, Badge, message, Popover, Space, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import nonVeg from "../../assets/nonVeg.png";
import veg from "../../assets/veg.png";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.users);
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("tokenForDineExpress");
    navigate("/login");
  };

  const handleNavigate = () => {
    if (user.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  const getPresentUser = async () => {
    try {
      dispatch(showLoading());
      const response = await getCurrentUser();
      if (response.success) {
        dispatch(setUser(response?.data));
        dispatch(hideLoading());
      } else {
        dispatch(hideLoading());
        dispatch(setUser(null));
        message.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      dispatch(setUser(null));
      message.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("tokenForDineExpress")) {
      getPresentUser();
    } else {
      navigate("/login");
    }
  }, []);

  const content = (
    <div className="mt-4">
      <hr className="pb-3" />
      {cart.map((item) => {
        return (
          <div key={item._id}>
            <div className="flex justify-between pb-3">
              <div className="flex justify-start items-center">
                <img src={item.isVeg ? veg : nonVeg} className="w-4 mr-2" />
                <Typography.Text
                  strong
                >{`${item.name} x ${item.quantity}`}</Typography.Text>
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {`₹${item.price * item.quantity}`}
              </Typography.Text>
            </div>
          </div>
        );
      })}
      <hr />
      <div className="flex justify-between pt-1 pb-1 mt-2">
        <div className="flex flex-col">
          <Typography.Text strong>Sub total</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Extra charges may apply
          </Typography.Text>
        </div>
        <Typography.Text strong>
          {`₹${cart.reduce((acc, item) => {
            return acc + item.price * item.quantity;
          }, 0)}`}
        </Typography.Text>
      </div>
      <div className="w-full mt-4">
        <button
          className="w-full font-semibold text-white bg-orange-500 h-9"
          onClick={() => navigate("/checkout")}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={(handleMenuClose, handleNavigate)}>
        My Profile
      </MenuItem>
      <MenuItem onClick={(handleMenuClose, handleLogout)}>Log out</MenuItem>
    </Menu>
  );

  return (
    user && (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography.Title
                level={5}
                className="cursor-pointer"
                style={{ color: "white" }}
                onClick={() => navigate("/")}
              >
                DineExpress
              </Typography.Title>
              <Box sx={{ flexGrow: 1 }} />
              <Space
                className="flex justify-center items-center cursor-pointer"
                onClick={() => {
                  if (user.isAdmin) {
                    navigate("/admin");
                  } else {
                    navigate("/profile");
                  }
                }}
              >
                <UserOutlined size="large" />
                <Typography.Title
                  className="cursor-pointer pt-2"
                  style={{ color: "white" }}
                  level={5}
                >
                  {user.firstName}
                </Typography.Title>
              </Space>
              <Space className="ml-6 mr-3 cursor-pointer">
                {cart.length > 0 ? (
                  <Popover
                    content={content}
                    placement="bottomRight"
                    title={
                      <div className="flex flex-col justify-start items-start">
                        <Typography.Title level={5}>
                          {cart[0]?.availableIn?.name}
                        </Typography.Title>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 10 }}
                        >
                          {cart[0]?.availableIn?.address}
                        </Typography.Text>
                      </div>
                    }
                  >
                    <Badge
                      color="orange"
                      size="small"
                      count={cart.reduce((acc, item) => {
                        return acc + item.quantity;
                      }, 0)}
                    >
                      <Avatar size="small" icon={<ShoppingCartOutlined />} />
                    </Badge>
                  </Popover>
                ) : (
                  <Popover
                    placement="bottomRight"
                    title={
                      <div className="flex flex-col justify-start items-center">
                        <Typography.Title level={5}>
                          Cart Empty
                        </Typography.Title>
                        <Typography.Text type="secondary">
                          Good food is always cooking! Go ahead, order some
                          yummy items from the menu.
                        </Typography.Text>
                      </div>
                    }
                  />
                )}
              </Space>
            </Toolbar>
          </AppBar>
          {renderMenu}
        </Box>
        <div className="mt-1 p-1">{children}</div>
      </>
    )
  );
}
