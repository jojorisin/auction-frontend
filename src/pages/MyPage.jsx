import { useEffect, useState } from "react";
import { getMe } from "../services/api";
import { Link } from "react-router-dom";
import { Container, Col, Row, Alert, Card } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import "./styles/MyPage.css";

const MyPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await getMe();
        setUser(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Unexpected error occurred. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return <Alert variant="warning">No user data available.</Alert>;
  }

  return (
    <Container className="my-container bg-white py-5">
      <Row className="gy-3">
        <Col xs={12}>
          <h1 className="fs-5 mb-2">Hello, {user?.email}</h1>
        </Col>
        <Col xs={12} md={4} sm={6}>
          <Card className="my-pages-card text-center">
            <Card.Body>
              <Card.Title>My Bids</Card.Title>
              <Link to="/me/bids" className="stretched-link"></Link>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4} sm={6}>
          <Card className="my-pages-card text-center">
            <Card.Body>
              <Card.Title>Won Auctions</Card.Title>
              <Link to="/me/won" className="stretched-link"></Link>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4} sm={12}>
          <Card className="my-pages-card text-center ">
            <Card.Body>
              <Card.Title>Update Profile</Card.Title>
              <Link to="/me/edit" className="stretched-link"></Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;
