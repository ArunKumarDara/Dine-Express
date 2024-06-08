import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { getCurrentUser } from "../../apiCalls/user";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import RestaurantForm from "../../pages/restaurants/RestaurantForm";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [toggleFormModal, setToggleFormModal] = useState(false);
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem("tokenForDineExpress");
    navigate("/login");
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
      <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
      <MenuItem onClick={(handleMenuClose, handleLogout)}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Typography
          fontSize="16px"
          noWrap
          component="div"
          sx={{
            cursor: "pointer",
          }}
        >
          Add Restaurant
        </Typography>
      </MenuItem>
      <MenuItem>
        <Typography
          fontSize="16px"
          noWrap
          component="div"
          sx={{
            cursor: "pointer",
          }}
        >
          My Orders
        </Typography>
      </MenuItem>
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
                sx={{ display: { xs: "none", sm: "block" }, cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                DineExpress
              </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search Restaurants"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Box sx={{ flexGrow: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  mr: 4,
                  cursor: "pointer",
                }}
                onClick={() => setToggleFormModal(true)}
              >
                Add Restaurant
              </Typography>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: "none", sm: "block" },
                  mr: 4,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (user.isAdmin) {
                    navigate("/admin");
                  } else {
                    navigate("/user");
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
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          {renderMobileMenu}
          {renderMenu}
        </Box>
        {toggleFormModal && (
          <RestaurantForm
            toggleFormModal={toggleFormModal}
            setToggleFormModal={setToggleFormModal}
          />
        )}
        <div className="mt-1 p-1">{children}</div>
      </>
    )
  );
}
