import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Alert,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { placeBid } from "../services/api";
import BidResponse from "./BidResponse";

const BidForm = ({ auctionId, currentHighestBid, increment }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bidResponse, setBidResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const minAllowed = currentHighestBid + increment;

    if (parseInt(bidAmount) < minAllowed) {
      setError(`Budet måste vara minst ${minAllowed} kr`);
      setLoading(false);
      return;
    }

    try {
      const bidResponse = await placeBid(auctionId, {
        amount: parseInt(bidAmount),
      });
      setBidResponse(bidResponse.data);
      setBidAmount(""); // Rensa fältet vid succé
    } catch (err) {
      setError(err.response?.data?.message || "Kunde inte lägga bud");
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? "Skickar..." : "Lägg bud"}
        </Button>
      </Form.Group>
      {bidResponse && <BidResponse bidResponse={bidResponse} />}
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
    </Form>
  );
};

export default BidForm;
