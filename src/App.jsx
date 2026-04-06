import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Button,
  Nav,
  Navbar,
  Container,
  Row,
  Col,
  NavDropdown,
} from "react-bootstrap";
import AuctionsListPage from "./pages/AuctionsListPage";
import AuctionPage from "./pages/AuctionPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import MyBidsPage from "./pages/MyBidsPage";
import MyWonAuctionsPage from "./pages/MyWonAuctionsPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import { logoutUser } from "./services/api";
import "./App.css";
import Header from "./components/Header";

const RootLayout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedSub("");
    setSearchTerm("");
    setSearchStatus("ACTIVE");
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    }
  };

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        handleResetFilters={handleResetFilters}
        handleLogout={handleLogout}
      />

      <main>
        <Outlet
          context={{
            isLoggedIn,
            handleLogout,
            handleResetFilters,
            selectedCategory,
            setSelectedCategory,
            selectedSub,
            setSelectedSub,
            searchTerm,
            setSearchTerm,
            searchStatus,
            setSearchStatus,
          }}
        />
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AuctionsListPage />,
      },
      { path: "auctions/:id", element: <AuctionPage /> },
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },
      { path: "/me", element: <MyPage /> },
      { path: "/me/bids", element: <MyBidsPage /> },
      { path: "/me/won", element: <MyWonAuctionsPage /> },
      { path: "/me/edit", element: <ProfileSettingsPage /> },
      { path: "/me/orders/:id", element: <OrderDetailsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
