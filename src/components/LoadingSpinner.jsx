import Spinner from "react-bootstrap/Spinner";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Spinner animation="border" variant="primary" />
      <span className="ms-2">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
