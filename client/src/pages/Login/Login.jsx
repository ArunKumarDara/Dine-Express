import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Divider, Typography, message } from "antd";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Oauth from "../../components/oauth/Oauth";
import { loginUser } from "../../apiCalls/user";

const defaultTheme = createTheme();

export default function Login() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const response = await loginUser({
        email: data.get("email"),
        password: data.get("password"),
      });
      if (response.success) {
        localStorage.setItem("tokenForDineExpress", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography.Title level={3}>Sign in</Typography.Title>
          <Oauth />
          <Divider
            className="uppercase text-gray-500"
            plain
            style={{ border: "gray" }}
          >
            or
          </Divider>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="w-full font-semibold text-white bg-orange-500 rounded-md mt-4 mb-3 p-3"
            >
              LOGIN
            </button>
            <Link to="/signup" variant="body2">
              <Typography.Text className="text-center ">
                Don&apos;t have an account?{" "}
                <span className="hover:text-blue-500">Sign Up</span>
              </Typography.Text>
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
