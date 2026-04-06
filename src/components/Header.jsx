import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles/Header.css";

const Header = ({ isLoggedIn, handleResetFilters, handleLogout }) => {
  return (
    <Navbar className="header-nav mb-4">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="text-start"
          onClick={handleResetFilters}
        >
          <h1 className="h1-header">Bautasten Auktioner</h1>
        </Navbar.Brand>

        {isLoggedIn ? (
          <NavDropdown
            className="my-pages-dropdown"
            title="My pages"
            id="basic-nav-dropdown"
            align="end"
          >
            <NavDropdown.Item className="my-pages-link" as={Link} to="/me">
              My pages
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="my-pages-link" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        ) : (
          <Nav.Link
            as={Link}
            to="/auth/login"
            className="btn btn-outline-dark px-4"
          >
            Login
          </Nav.Link>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
