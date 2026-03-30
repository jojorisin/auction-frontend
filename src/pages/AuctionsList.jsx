import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  getActiveAuctions,
  getCategories,
  getSubCategories,
} from "../services/api";
import CategoryFilter from "../components/CategoryFilter";

const AuctionsList = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategoryMap, setSubCategoryMap] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // retrieves categories
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          getCategories(),
          getSubCategories(),
        ]);
        setCategories(catRes.data);
        setSubCategoryMap(subRes.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    loadInitialData();
  }, []);

  // filters auctions based on category and subcategory
  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedSub) params.subCategory = selectedSub;

        const response = await getActiveAuctions(params);
        setAuctions(response.data.content);
        setLoading(false);
      } catch (err) {
        setError("Kunde inte ladda auktioner. Försök igen senare.");
        setLoading(false);
      }
    };
    fetchAuctions();
  }, [selectedCategory, selectedSub]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSelectedSub("");
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3} lg={2} className="border-end">
          <CategoryFilter
            categories={categories}
            subCategoryMap={subCategoryMap}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSub={selectedSub}
            onSubChange={setSelectedSub}
          />
        </Col>
        <Col md={9} lg={10} className="ps-4">
          <h2 className="mb-4">
            {selectedCategory
              ? `${selectedCategory} ${selectedSub && `> ${selectedSub}`}`
              : "Alla Auktioner"}
          </h2>

          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Row className="g-4">
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <Col key={auction.auctionId} sm={6} lg={4} xl={3}>
                    <Card
                      className="h-100 shadow-sm border-0"
                      onClick={() => navigate(`/auctions/${auction.auctionId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <Card.Img
                        variant="top"
                        src={
                          auction.imageUrls && auction.imageUrls.length > 0
                            ? auction.imageUrls[0]
                            : "https://placehold.co/200x200?text=No+Image"
                        }
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title className="h6 text-truncate">
                          {auction.title}
                        </Card.Title>
                        <Card.Text className="fw-bold text-primary">
                          {auction.highestBid === 0
                            ? `${auction.valuation} SEK (Värdering)`
                            : `${auction.highestBid} SEK (Högsta bud)`}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col key="no-results">
                  <p>Inga auktioner hittades i denna kategori.</p>
                </Col>
              )}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionsList;
