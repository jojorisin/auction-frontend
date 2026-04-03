import { getMyWonAuctions } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Container, Alert, Table, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import DateTimeFormatter from "../components/DateTimeFormatter";
import { useNavigate, Link } from "react-router-dom";
import "./MyWonAuctionsPage.css";

const MyWonAuctionsPage = () => {
  const navigate = useNavigate();
  const [myWon, setMyWon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyWonAuctions = async () => {
      setLoading(true);
      try {
        const response = await getMyWonAuctions();
        setMyWon(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          "Unexpected error occurred. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchMyWonAuctions();
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

  if (!myWon) {
    return <Alert variant="warning">No won auctions available.</Alert>;
  }
  if (myWon.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No won auctions available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="p-5">
      <Table
        striped
        borderless
        className="striped-table justify-content-center align-middle shadow-sm"
      >
        <thead>
          <tr>
            <th></th>
            <th>item</th>
            <th>Ended</th>
            <th>Order Status</th>
            <th>Winning bid</th>
          </tr>
        </thead>
        <tbody>
          {myWon.map((auction) => (
            <tr key={auction.auctionId}>
              <td>
                <img
                  className="my-won-image"
                  src={
                    auction.imageUrls && auction.imageUrls.length > 0
                      ? auction.imageUrls[0]
                      : "https://placehold.co/200x200?text=No+Image"
                  }
                  alt={auction.title}
                  onClick={() => navigate(`/auctions/${auction.auctionId}`)}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </td>
              <td
                className="my-won-title"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/auctions/${auction.auctionId}`)}
              >
                {auction.auctionId}, {auction.title}
              </td>
              <td>
                <DateTimeFormatter isoString={auction.endTime} />
              </td>
              <td className="order-link">
                <Link to={`/me/orders/${auction.orderId}`}>
                  {auction.status}
                </Link>
              </td>
              <td>{auction.highestBid} SEK</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyWonAuctionsPage;
