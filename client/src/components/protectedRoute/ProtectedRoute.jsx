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
    <div>
      <p>Content</p>
      <p>Content</p>
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
              <Space className="ml-6 mr-3">
                <Popover
                  content={content}
                  title="jshhjsbfjdkbh"
                  placement="bottomRight"
                >
                  <Badge
                    count={cart.reduce((acc, item) => {
                      return acc + item.quantity;
                    }, 0)}
                  >
                    <Avatar
                      size="small"
                      icon={<ShoppingCartOutlined style={{ color: "white" }} />}
                    />
                  </Badge>
                </Popover>
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
