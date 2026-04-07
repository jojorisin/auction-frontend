import { Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { placeBid } from "../services/api";
import BidResponse from "./BidResponse";
import MyMaxBid from "./MyMaxBid";
import "../index.css";

const BidForm = ({
  auctionId,
  currentHighestBid,
  currentHighestBidder,
  increment,
  currentUserId,
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidResponse, setBidResponse] = useState(null);
  const [showMaxBid, setShowMaxBid] = useState(false);
  const iAmLeadingNow = currentUserId === currentHighestBidder;
  const isResponseStillValid =
    bidResponse?.status === "LEADING" ? iAmLeadingNow : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const minAllowed = currentHighestBid + increment;

    if (parseInt(bidAmount) < minAllowed) {
      setError(`Bid has to be minimum ${minAllowed} kr`);
      setLoading(false);
      return;
    }

    try {
      const bidResponse = await placeBid(auctionId, {
        amount: parseInt(bidAmount),
      });
      setBidResponse(bidResponse.data);
      setBidAmount("");
      setShowMaxBid(false);
    } catch (err) {
      const status = err.response?.status;
      const errName = err.response?.data?.error;
      if (status === 401) {
        setError(
          <span className="small">
            <Alert.Link className="red-error-link" href="/auth/login">
              Login
            </Alert.Link>{" "}
            or{" "}
            <Alert.Link className="red-error-link" href="/auth/register">
              Register
            </Alert.Link>{" "}
            to place bid.
          </span>,
        );
        return;
      } else if (status === 400) {
        setError(err.response?.data?.message || "error");
        // if bid is lower than users current max bid - show max bid and alert
        if (errName === "DomainArgumentException") {
          setShowMaxBid(true);
        }
      } else {
        setError(err.response?.data?.message || "Error placing bid.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (bidResponse?.status === "LEADING") {
      if (currentHighestBidder !== currentUserId) {
        setBidResponse(null);
        setError("Someone just outbid you! Update your bid.");
      }
    }
  }, [currentHighestBidder, currentUserId]);

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group>
        <Form.Label className="text-muted small">
          Place a bid (Minimum bid: {currentHighestBid + increment} kr)
        </Form.Label>

        <Form.Control
          type="text"
          inputMode="numeric"
          placeholder={currentHighestBid + increment}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          min={currentHighestBid + 1}
          required
        />
        <Button
          className="my-2 lg w-100 bg-dark border-dark"
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? "Sending..." : "Place bid"}
        </Button>

        {showMaxBid && <MyMaxBid auctionId={auctionId} />}
      </Form.Group>
      {bidResponse && isResponseStillValid && (
        <BidResponse bidResponse={bidResponse} />
      )}
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </Form>
  );
};

export default BidForm;
