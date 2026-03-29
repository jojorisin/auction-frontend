import { Container, Row, Col, Nav } from "react-bootstrap";

const CategoryFilter = ({
  categories,
  subCategoryMap,
  selectedCategory,
  onCategoryChange,
  selectedSub,
  onSubChange,
}) => {
  return (
    <Container fluid className="p-0">
      <Row>
        <Col>
          <h5 className="mb-3 fw-bold">Kategorier</h5>

          {/* Huvudkategorier i en vertikal lista */}
          <Nav variant="pills" className="flex-column mb-4">
            <Nav.Link
              active={selectedCategory === ""}
              onClick={() => onCategoryChange("")}
              className="py-2"
            >
              Alla Auktioner
            </Nav.Link>

            {categories.map((cat) => (
              <Nav.Link
                key={cat}
                active={selectedCategory === cat}
                onClick={() => onCategoryChange(cat)}
                className="py-2"
              >
                {cat}
              </Nav.Link>
            ))}
          </Nav>

          {/* subs only shows when a category is selected */}
          {selectedCategory && (
            <div className="ms-3 border-start ps-3">
              <p className="text-muted small fw-bold text-uppercase">
                Underkategorier
              </p>
              <Nav className="flex-column">
                <Nav.Link
                  active={selectedSub === ""}
                  onClick={() => onSubChange("")}
                  className="py-1 small"
                >
                  Visa allt i {selectedCategory}
                </Nav.Link>

                {subCategoryMap[selectedCategory]?.map((sub) => (
                  <Nav.Link
                    key={sub}
                    active={selectedSub === sub}
                    onClick={() => onSubChange(sub)}
                    className="py-1 small"
                  >
                    {sub}
                  </Nav.Link>
                ))}
              </Nav>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CategoryFilter;
