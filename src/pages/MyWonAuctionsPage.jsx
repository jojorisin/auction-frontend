import { getMyWonAuctions } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { Container, Alert, Table, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import DateTimeFormatter from "../components/DateTimeFormatter";
import { useNavigate, Link } from "react-router-dom";

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

  if (!myWon || myWon.length === 0) {
    return (
      <Container>
        <h1 className="no-data-h1 ">
          You have not won any auctions yet! Checkout out listings{" "}
          <Link to="/">
            <strong className="no-data-link">here.</strong>
          </Link>
        </h1>
      </Container>
    );
  }

  return (
    <Container className="py-1 table-responsive">
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
                    width: "100px",
                    height: "100px",
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
              <td>
                <Link
                  className={
                    auction?.status === "PAID"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }
                  to={`/me/orders/${auction.orderId}`}
                >
                  {auction.status}
                </Link>
              </td>
              <td>{auction.winningBid} SEK</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyWonAuctionsPage;
