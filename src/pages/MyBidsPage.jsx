import { useEffect, useState } from "react";
import { getMyBids } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Container, Alert, Row, Col, Table, Card } from "react-bootstrap";
import DateTimeFormatter from "../components/DateTimeFormatter";
import { useNavigate } from "react-router-dom";
import "./MyBidsPage.css";

const MyBidsPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBids = async () => {
      setLoading(true);
      try {
        const response = await getMyBids();
        setBids(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Unexpected error occurred. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBids();
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

  if (!bids) {
    return <Alert variant="warning">No bids available.</Alert>;
  }
  if (bids.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No bids available.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Table striped borderless className="justify-content-center align-middle">
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Ends</th>
            <th>Current highest</th>
            <th>Your max bid</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid.auctionId}>
              <td>
                <img
                  className="my-bids-image"
                  src={bid.imageUrls[0]}
                  alt={bid.title}
                  onClick={() => navigate(`/auctions/${bid.auctionId}`)}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </td>
              <td
                className="my-bids-title"
                onClick={() => navigate(`/auctions/${bid.auctionId}`)}
                style={{ cursor: "pointer" }}
              >
                {bid.auctionId},{bid.title}
              </td>
              <td>
                <DateTimeFormatter isoString={bid.endTime} />
              </td>
              <td
                className={
                  bid.status === "LEADING"
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {bid.highestBid} SEK
              </td>
              <td>{bid.maxSum} SEK</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyBidsPage;
