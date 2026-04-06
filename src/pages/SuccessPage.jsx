import { Container, Alert, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <Container className="py-5 text-center">
      <Alert variant="success" className="shadow-sm p-5">
        <div className="mb-4">
          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: "3rem" }}
          ></i>
        </div>
        <Alert.Heading as="h3">Payment was succesful!</Alert.Heading>

        {sessionId && (
          <p className="text-muted small">
            Sessions-ID: {sessionId.substring(0, 15)}...
          </p>
        )}
        <hr />
        <div className="mt-4 gap-3 d-flex justify-content-center">
          <Button as={Link} to="/me/won" variant="success">
            Show my order
          </Button>
        </div>
      </Alert>
    </Container>
  );
};

export default SuccessPage;
