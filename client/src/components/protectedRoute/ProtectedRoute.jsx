import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { getCurrentUser } from "../../apiCalls/user";
import { message, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/loaderSlice";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                DineExpress
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Space className="flex justify-center items-center">
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (user.isAdmin) {
                      navigate("/admin");
                    } else {
                      navigate("/profile");
                    }
                  }}
                >
                  {user.firstName}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
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
