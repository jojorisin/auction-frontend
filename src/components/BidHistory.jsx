import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Table } from "react-bootstrap";
import BidForm from "./BidForm";
import { getBidHistory } from "../services/api";
import { Client } from "@stomp/stompjs";
import DateTimeFormatter from "./DateTimeFormatter";
import "./styles/BidHistory.css";

const BidHistory = ({ auction }) => {
  // --- States ---
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [showAllBids, setShowAllBids] = useState(false);
  const visibleBids = showAllBids ? bids : bids.slice(0, 10);

  // Get current user ID from JWT token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Number(payload.sub);
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // generates a color based on bidder alias for visual distinction in bid history
  const getAliasColor = (alias) => {
    const hue = (alias * 137.5) % 360;

    const turns = Math.floor((alias - 1) / 10);
    const lightness = Math.min(70 + turns * 10, 80);

    return `hsl(${hue}, 80%, ${lightness}%)`;
  };

  const fetchBidHistory = async () => {
    setLoading(true);
    try {
      const response = await getBidHistory(auction.auctionId);
      setBids(response.data);
    } catch (err) {
      console.error("Error loading bid history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auction?.auctionId) return;

    fetchBidHistory();

    const client = new Client({
      brokerURL: import.meta.env.VITE_WEBSOCKET_URL,

      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe(`/topic/bids/${auction.auctionId}`, (message) => {
          const updatedBids = JSON.parse(message.body);
          setBids(updatedBids);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    client.activate();

    return () => {
      if (client.active) {
        console.log("Deactivating WebSocket...");
        client.deactivate();
      }
    };
  }, [auction?.auctionId]);

  if (!auction) return <Spinner animation="border" />;

  return (
    <Container className="bid-history-container mt-4">
      <Row>
        <Col>
          <p className="text-muted small mb-0">Current highest bid</p>
          <p className="fs-4">{bids.length > 0 ? bids[0].bidSum : 0} kr</p>
        </Col>
        <Col>
          <p className="text-muted small mb-0">Endtime</p>
          <p className="fs-4">
            <DateTimeFormatter isoString={auction.endTime} />
          </p>
        </Col>
        <Col xs={12}>
          <BidForm
            auctionId={auction.auctionId}
            currentHighestBid={bids.length > 0 ? bids[0].bidSum : 0}
            currentHighestBidder={bids.length > 0 ? bids[0].userId : null}
            increment={auction.increment}
            currentUserId={currentUserId}
          />
        </Col>

        <Col xs={12}>
          <h5 className="mt-3">Budhistorik</h5>
        </Col>

        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" size="sm" />
          </Col>
        ) : (
          <Col xs={12}>
            <Table size="sm">
              <tbody>
                {visibleBids.map((bid) => (
                  <tr key={bid.bidId}>
                    <td>
                      <span
                        className="bidder-alias p-2 rounded"
                        style={{
                          backgroundColor: getAliasColor(bid.bidderAlias),
                        }}
                      >
                        {bid.userId === currentUserId ? (
                          <span className="small">ME </span>
                        ) : (
                          bid.bidderAlias
                        )}
                      </span>
                    </td>
                    <td>{bid.isAuto && <span className="is-auto">A</span>}</td>
                    <td className="text-muted small">
                      <DateTimeFormatter isoString={bid.createdAt} />
                    </td>
                    <td>{bid.bidSum} kr</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {bids.length > 10 && (
              <div className="text-center mt-2">
                <button
                  className="btn btn-link text-black  text-decoration-none"
                  onClick={() => setShowAllBids(!showAllBids)}
                >
                  {showAllBids ? (
                    <>Show less ▲</>
                  ) : (
                    <>Show all ({bids.length}) ▼</>
                  )}
                </button>
              </div>
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default BidHistory;
