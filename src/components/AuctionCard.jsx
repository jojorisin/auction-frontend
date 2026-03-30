import { useState } from "react";
import { Card } from "react-bootstrap";

const AuctionCard = ({ auction, onClick }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images =
    auction.imageUrls && auction.imageUrls.length > 0
      ? auction.imageUrls
      : ["https://placehold.co/200x200?text=No+Image"];

  const hasMultiple = images.length > 1;

  return (
    <Card
      className="h-100 shadow-sm border-0"
      onClick={onClick}
      onMouseEnter={() => hasMultiple && setCurrentImgIndex(1)}
      onMouseLeave={() => setCurrentImgIndex(0)}
      style={{ cursor: "pointer" }}
    >
      <Card.Img
        variant="top"
        src={images[currentImgIndex]}
        style={{
          height: "200px",
          objectFit: "cover",
          transition: "opacity 0.3s",
        }}
      />
      <Card.Body>
        <Card.Title className="text-truncate fw-light">
          {auction.title}
        </Card.Title>
        <Card.Text className="text-muted">
          {auction.highestBid === 0 ? (
            <>
              <span
                className="d-block small text-uppercase"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Valuation
              </span>
              <span className="fw-bold text-dark">{auction.valuation} SEK</span>
            </>
          ) : (
            <>
              <span
                className="d-block small text-uppercase"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Highest bid
              </span>
              <span className="text-primary fw-semibold text-dark">
                {auction.highestBid} SEK
              </span>
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AuctionCard;
