import { Form, Button } from "react-bootstrap";

const ContactForm = ({ contactData, onChange, onSubmit, fieldErrors = {} }) => {
  return (
    <div className="p-3 bg-light mb-4">
      <h3>Contact Info</h3>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={contactData.email}
            onChange={onChange}
            isInvalid={!!fieldErrors.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors.email || "Please enter a valid email."}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phoneNr"
            value={contactData.phoneNr}
            onChange={onChange}
            isInvalid={!!fieldErrors.phoneNr}
            required
          />
          <Form.Control.Feedback type="invalid">
            {fieldErrors.phoneNr || "Phone number is required."}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="dark" type="submit" className="w-100">
          Update Contact
        </Button>
      </Form>
    </div>
  );
};

export default ContactForm;
