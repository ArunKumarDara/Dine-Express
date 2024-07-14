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
import Order from "./pages/home/Order";
import DashBoard from "./adminDashboard/DashBoard";
import OrderDetails from "./pages/home/OrderDetails";
import PaymentSuccess from "./pages/payment/Success";
import CancelPayment from "./pages/payment/Cancel";

function App() {
  const { loading } = useSelector((state) => state.loader);
  const { user } = useSelector((state) => state.users);
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
                {!user?.isAdmin ? <Home /> : <DashBoard />}
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
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
          <Route
            path="/restaurants/:restaurantId"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<CancelPayment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
