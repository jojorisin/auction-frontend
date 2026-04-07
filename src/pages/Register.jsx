import { useState } from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await registerUser({ email, password, confirmPassword });
      //registered user logs in after registration
      localStorage.setItem("token", response.data.accessToken);
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center p-3">
        <Col md={6}>
          <h2>Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label className="text-muted">Email</Form.Label>
              <Form.Control
                className="shadow-sm mb-2"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label className="text-muted">Password</Form.Label>
              <Form.Control
                className="shadow-sm mb-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword">
              <Form.Label className="text-muted">Confirm Password</Form.Label>
              <Form.Control
                className="shadow-sm mb-3"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="dark" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-decoration-none">
                Login <strong>here</strong>
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
