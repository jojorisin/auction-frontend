import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Nav, Navbar, Container, Row, Col } from "react-bootstrap";
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

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedSub("");
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
    }
  };

  return (
    <div>
      <Navbar expand="lg" className="header-nav mb-4">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-none d-lg-block" style={{ flex: 1 }}></div>

          <Navbar.Brand
            as={Link}
            to="/"
            className="mx-auto text-center"
            style={{ flex: 2 }}
            onClick={handleResetFilters}
          >
            <h1 className="h1-header mb-0 text-light">Bautasten Auktioner</h1>
          </Navbar.Brand>

          <div
            className="d-flex justify-content-end align-items-center"
            style={{ flex: 1 }}
          >
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="ms-auto"
            />

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                {isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to="/me" className="me-2">
                      My Pages
                    </Nav.Link>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Nav.Link
                    as={Link}
                    to="/auth/login"
                    className="btn btn-outline-dark px-4"
                  >
                    Login
                  </Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>

      <main>
        <Container>
          <Outlet
            context={{
              isLoggedIn,
              handleResetFilters,
              selectedCategory,
              setSelectedCategory,
              selectedSub,
              setSelectedSub,
            }}
          />
        </Container>
      </main>
    </div>
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
