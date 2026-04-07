import { Form, Button, Row, Col } from "react-bootstrap";

const AddressForm = ({ addressData, onChange, onSubmit, fieldErrors = {} }) => {
  return (
    <Form onSubmit={onSubmit} className="p-3 address-form">
      <h3 className="mb-3">Address Details</h3>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              name="firstName"
              value={addressData.firstName}
              onChange={onChange}
              isInvalid={!!fieldErrors.firstName}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              name="lastName"
              value={addressData.lastName}
              onChange={onChange}
              isInvalid={!!fieldErrors.lastName}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-2">
        <Form.Label>C/O (Optional)</Form.Label>
        <Form.Control name="co" value={addressData.co} onChange={onChange} />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Street Address *</Form.Label>
        <Form.Control
          name="streetName"
          value={addressData.streetName}
          onChange={onChange}
          isInvalid={!!fieldErrors.streetName}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Street Address 2</Form.Label>
        <Form.Control
          name="streetName2"
          value={addressData.streetName2}
          onChange={onChange}
        />
      </Form.Group>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Postal Code *</Form.Label>
            <Form.Control
              name="postalCode"
              value={addressData.postalCode}
              onChange={onChange}
              isInvalid={!!fieldErrors.postalCode}
              required
            />
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>City *</Form.Label>
            <Form.Control
              name="city"
              value={addressData.city}
              onChange={onChange}
              isInvalid={!!fieldErrors.city}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Country *</Form.Label>
        <Form.Control
          name="country"
          value={addressData.country}
          onChange={onChange}
          isInvalid={!!fieldErrors.country}
          required
        />
      </Form.Group>

      <Button variant="dark" type="submit" className="address-button w-100">
        Update Address
      </Button>
    </Form>
  );
};

export default AddressForm;
