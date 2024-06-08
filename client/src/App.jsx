import "./App.css";
// import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/SIgnup/Signup";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import Profile from "./pages/profile/Profile";
import Admin from "./pages/admin/Admin";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import AddRestaurants from "./pages/restaurants/AddRestaurants";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      )}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/addRestaurant"
            element={
              <ProtectedRoute>
                <AddRestaurants />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
