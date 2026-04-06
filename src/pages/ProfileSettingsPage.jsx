import { useState, useEffect } from "react";
import {
  getMe,
  updateAddress,
  updateContactInfo,
  updatePassword,
} from "../services/api";
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  ListGroup,
  NavLink,
} from "react-bootstrap";
import AddressForm from "../components/AddressForm";
import ContactForm from "../components/ContactForm";

const ProfileSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    co: "",
    streetName: "",
    streetName2: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const [contactData, setContactData] = useState({ email: "", phoneNr: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMe();
        const user = response.data;
        if (user.address) setAddressData(user.address);
        setContactData({
          phoneNr: user.phoneNr || "",
          email: user.email || "",
        });
      } catch (err) {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handlers
  const handleAddressChange = (e) =>
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  const handleContactChange = (e) =>
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccess(null);
    try {
      await updateAddress(addressData);
      setSuccess("Address updated successfully!");
    } catch (err) {
      setFieldErrors(err.response?.data || {});
      setError("Failed to update address.");
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccess(null);
    try {
      await updateContactInfo(contactData);
      setSuccess("Contact info updated successfully!");
    } catch (err) {
      setFieldErrors(err.response?.data || {});
      setError("Failed to update contact info.");
    }
  };

  if (loading)
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="py-4">
      <Row>
        <Col md={5}>
          {success && (
            <Alert
              variant="success"
              dismissible
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <AddressForm
            addressData={addressData}
            onChange={handleAddressChange}
            onSubmit={handleAddressSubmit}
            fieldErrors={fieldErrors}
          />
        </Col>

        <Col md={5}>
          <ContactForm
            contactData={contactData}
            onChange={handleContactChange}
            onSubmit={handleContactSubmit}
            fieldErrors={fieldErrors}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileSettingsPage;
