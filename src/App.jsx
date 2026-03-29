import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import AuctionsList from "./pages/AuctionsList";
import AuctionDetails from "./pages/AuctionDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { logoutUser } from "./services/api";

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <header className="p-3 bg-light border-bottom mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h1 className="mb-0">Bautasten Auktioner</h1>
          </Link>
          <nav>
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                <span className="me-3">My Pages</span>
                <Button variant="outline-secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth/login" className="btn btn-outline-primary">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
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
        element: <AuctionsList />,
      },
      { path: "auctions/:id", element: <AuctionDetails /> },
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
