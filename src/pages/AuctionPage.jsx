import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getAuctionById } from "../services/api";
import BidHistory from "../components/BidHistory";

const AuctionPage = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (
      auction &&
      currentImageIndex < auction.itemResponse.imageUrls.length - 1
    ) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (auction && auction.itemResponse.imageUrls.length > 1) {
        if (e.key === "ArrowLeft") {
          prevImage();
        } else if (e.key === "ArrowRight") {
          nextImage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [auction, currentImageIndex]);

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      try {
        const response = await getAuctionById(id);
        setAuction(response.data);
      } catch (err) {
        setError("Could not load auction details. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id]);

  if (loading)
    return (
      <Container className="mt-5">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!auction)
    return (
      <Container className="mt-5">
        <Alert variant="warning">Auction not found.</Alert>
      </Container>
    );

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h1 className="mb-3">
            {auction.auctionId}, {auction.itemResponse.title}
          </h1>
        </Col>
        <Col xs={12} md={7} className="p-0 mx-auto" style={{ maxWidth: "90%" }}>
          <div>
            <div className="position-relative">
              <img
                src={
                  auction.itemResponse.imageUrls &&
                  auction.itemResponse.imageUrls.length > 0
                    ? auction.itemResponse.imageUrls[currentImageIndex]
                    : "https://placehold.co/200x200?text=No+Image"
                }
                alt={auction.itemResponse.title}
                className="img-fluid"
                style={{
                  objectFit: "cover",
                  maxwidth: "100%",
                  height: "600px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />

              {auction.itemResponse.imageUrls.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    className="position-absolute start-0 top-50 translate-middle-y"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    style={{ zIndex: 10 }}
                  >
                    ‹
                  </Button>

                  <Button
                    variant="secondary"
                    className="position-absolute end-0 top-50 translate-middle-y"
                    onClick={nextImage}
                    disabled={
                      currentImageIndex ===
                      auction.itemResponse.imageUrls.length - 1
                    }
                    style={{ zIndex: 10 }}
                  >
                    ›
                  </Button>

                  <div className="text-center mt-2">
                    <small className="text-muted">
                      {currentImageIndex + 1} /{" "}
                      {auction.itemResponse.imageUrls.length}
                    </small>
                  </div>

                  {/* thumbnail navigation */}
                  <div className="d-flex justify-content-center mt-3 flex-wrap">
                    {auction.itemResponse.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className={`img-thumbnail me-2 mb-2 ${index === currentImageIndex ? "border-primary" : ""}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          cursor: "pointer",
                          border:
                            index === currentImageIndex
                              ? "3px solid #007bff"
                              : "2px solid #dee2e6",
                          borderRadius: "4px",
                        }}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <p className="mt-3">Description: </p>
            <p>{auction.itemResponse.description}</p>
          </div>
        </Col>
        <Col xs={12} md={5} className="bg-light">
          <BidHistory auction={auction} />
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionPage;
