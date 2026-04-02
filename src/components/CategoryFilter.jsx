import { Container, Row, Col, Nav } from "react-bootstrap";
import "./styles/CategoryFilter.css";

const CategoryFilter = ({
  categories,
  subCategoryMap,
  selectedCategory,
  onCategoryChange,
  selectedSub,
  onSubChange,
}) => {
  return (
    <Container fluid className="p-0 mb-4">
      <Row>
        <Col>
          <Nav
            className="d-flex flex-row flex-nowrap overflow-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <Nav.Link
              active={selectedCategory === ""}
              onClick={() => {
                onCategoryChange("");
                onSubChange("");
              }}
              className="category-link"
            >
              ALL
            </Nav.Link>

            {categories.map((cat) => (
              <Nav.Link
                key={cat}
                active={selectedCategory === cat}
                onClick={() => {
                  onCategoryChange(cat);
                  onSubChange("");
                }}
                className="category-link"
              >
                {cat}
              </Nav.Link>
            ))}
          </Nav>

          {selectedCategory && (
            <div className="p-0 m-0">
              <Nav className="d-flex flex-row flex-wrap">
                <Nav.Link
                  active={selectedSub === ""}
                  onClick={() => onSubChange("")}
                  className="category-link"
                >
                  ALL
                </Nav.Link>

                {subCategoryMap[selectedCategory]?.map((sub) => (
                  <Nav.Link
                    key={sub}
                    active={selectedSub === sub}
                    onClick={() => onSubChange(sub)}
                    className="category-link"
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
