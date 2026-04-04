import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  FormControl,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const SearchBar = ({
  searchTerm,
  handleSearchChange,
  searchStatus,
  handleStatusChange,
}) => {
  return (
    <InputGroup className=" rounded-pill bg-white border overflow-hidden">
      <InputGroup.Text
        className="border-0 rounded-pill shadow-none"
        id="search-icon"
      >
        <Search />
      </InputGroup.Text>
      <FormControl
        className="border-0 shadow-none"
        type="text"
        placeholder="Search all our auctions..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      ></FormControl>
      <Dropdown>
        <Dropdown.Toggle
          variant="light"
          id="dropdown-status"
          className="border-0 rounded-end px-3 text-small text-secondary"
        >
          status
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" popperConfig={{ strategy: "fixed" }}>
          <Dropdown.Item onClick={() => handleStatusChange("ACTIVE")}>
            Active
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleStatusChange("SOLD")}>
            Sold
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </InputGroup>
  );
};
export default SearchBar;
