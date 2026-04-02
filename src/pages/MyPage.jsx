import { useEffect, useState } from "react";
import { getMe } from "../services/api";
import { Link } from "react-router-dom";
import { Container, Col, Row, Alert, Card } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import "./MyPage.css";

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
    return <LoadingSpinner />;
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
    <Container>
      <Row>
        <Col xs={12} className="mb-5">
          <h1>Hello, {user?.email}</h1>
        </Col>
        <Col md={4} sm={6}>
          <Card className="my-pages-card h-100 shadow-sm hover-shadow text-center p-3">
            <Card.Body>
              <Card.Title>My Bids</Card.Title>
              <Card.Text>View all the auctions you are bidding on.</Card.Text>
              <Link to="/me/bids" className="stretched-link">
                Go to Bids
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={6}>
          <Card className="my-pages-card h-100 shadow-sm text-center p-3">
            <Card.Body>
              <Card.Title>Won Auctions</Card.Title>
              <Card.Text>Check out the auctions you have won.</Card.Text>
              <Link to="/me/won" className="stretched-link">
                See Won
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} sm={12}>
          <Card className="my-pages-card h-100 shadow-sm text-center p-3 border-primary">
            <Card.Body>
              <Card.Title>Update Profile</Card.Title>
              <Card.Text>Change your account details.</Card.Text>
              <Link to="/me/edit" className="stretched-link">
                Edit Profile
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;
