import { Container, Row, Col, Nav } from "react-bootstrap";
import "./styles/CategoryFilter.css";
import { formatSnakeCase } from "../utils/formatters";
import { useRef } from "react";

const CategoryFilter = ({
  categories,
  subCategoryMap,
  selectedCategory,
  onCategoryChange,
  selectedSub,
  onSubChange,
}) => {
  const scrollRef = useRef(null);
  const scroll = (offset) => {
    scrollRef.current.scrollLeft += offset;
  };

  const resetFilters = () => {
    onCategoryChange("");
    onSubChange("");
  };
  return (
    <Container fluid className="category-container p-0 mb-1">
      <Row>
        <Col className="mb-3">
          <div className="position-relative d-flex align-items-center">
            <button className="scroll-arrow left" onClick={() => scroll(-200)}>
              ‹
            </button>
            <Nav
              ref={scrollRef}
              className="d-flex flex-row flex-nowrap overflow-auto  hide-scrollbar"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <Nav.Link
                active={selectedCategory === ""}
                onClick={() => {
                  resetFilters();
                }}
                className="category-pill rounded-pill hide-scrollbar"
              >
                All
              </Nav.Link>

              {categories.map((cat) => (
                <Nav.Link
                  key={cat}
                  active={selectedCategory === cat}
                  onClick={() => {
                    onCategoryChange(cat);
                    onSubChange("");
                  }}
                  className="category-pill rounded-pill"
                >
                  {formatSnakeCase(cat)}
                </Nav.Link>
              ))}
            </Nav>
            <button className="scroll-arrow right" onClick={() => scroll(200)}>
              ›
            </button>
          </div>

          {selectedCategory && (
            <div className="p-0 m-0">
              <Nav className="d-flex flex-row flex-nowrap overflow-auto w-100 ">
                <Nav.Link
                  active={selectedSub === ""}
                  onClick={() => onSubChange("")}
                  className="sub-link"
                >
                  All {formatSnakeCase(selectedCategory)}
                </Nav.Link>

                {subCategoryMap[selectedCategory]?.map((sub) => (
                  <Nav.Link
                    key={sub}
                    active={selectedSub === sub}
                    onClick={() => onSubChange(sub)}
                    className="sub-link"
                  >
                    {formatSnakeCase(sub)}
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
