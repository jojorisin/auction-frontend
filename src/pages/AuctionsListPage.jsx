import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  getActiveAuctions,
  getCategories,
  getSubCategories,
} from "../services/api";
import CategoryFilter from "../components/CategoryFilter";
import AuctionCard from "../components/AuctionCard";

const AuctionsListPage = () => {
  const { selectedCategory, setSelectedCategory, selectedSub, setSelectedSub } =
    useOutletContext();
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategoryMap, setSubCategoryMap] = useState({});

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
    <Container className="mt-4">
      <Row>
        <Col xs={12}>
          <CategoryFilter
            categories={categories}
            subCategoryMap={subCategoryMap}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedSub={selectedSub}
            onSubChange={setSelectedSub}
          />
        </Col>
        <Col xs={12} className="ps-4 bg-light p-3">
          <h2 className="mb-4 fs-6">
            {selectedCategory
              ? `${selectedCategory} ${selectedSub && `> ${selectedSub}`}`
              : ""}
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
                  <Col key={auction.auctionId} xs={6} sm={6} lg={4} xl={3}>
                    <AuctionCard
                      auction={auction}
                      onClick={() => navigate(`/auctions/${auction.auctionId}`)}
                    />
                  </Col>
                ))
              ) : (
                <Col key="no-results">
                  <p>No auctions in this category.</p>
                </Col>
              )}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AuctionsListPage;
