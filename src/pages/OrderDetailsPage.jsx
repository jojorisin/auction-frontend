import { getMyOrderById, createCheckoutSession } from "../services/api";
import { useEffect, useState } from "react";
import { Container, Alert, Table, Row, Col, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePayment = async (orderId) => {
    try {
      const session = await createCheckoutSession(orderId);
      const checkoutUrl = session.data.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Betalningen misslyckades:", error);
      alert("Kunde inte starta betalningen. Försök igen senare.");
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getMyOrderById(id);
        setOrder(response.data || response);
      } catch (err) {
        setError("Kunde inte hämta ordern.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading)
    return (
      <Container className="mt-5">
        <p>Laddar...</p>
      </Container>
    );

  if (error || !order)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || "Hittade ingen order"}</Alert>
      </Container>
    );

  const getExclVat = (amount) => Number(amount) / 1.25;
  const total = Number(order.orderSum);

  const commissionInclVat = total * 0.2;
  const commissionExclVat = getExclVat(commissionInclVat);
  const commissionVat = commissionInclVat - commissionExclVat;

  const premiumExclVat = 50;
  const premiumVat = 50 * 0.25;
  const premiumInclVat = 50 * 1.25;

  const finalTotal = total + commissionInclVat + premiumInclVat;

  // temporary fix for missing fields in backend.
  return (
    <Container className="bg-white ">
      <Row className="py-3">
        <Col>
          <Col xs={12}>
            <p
              className={
                order?.status === "PAID"
                  ? "text-success fw-bold"
                  : "text-danger fw-bold"
              }
            >
              {order.status}
            </p>
            <h2 className="mb-5">Order #{order.orderId}</h2>
          </Col>

          <Col xs={12}>
            {order.imageUrl && (
              <img
                src={order.imageUrl}
                alt={order.title}
                style={{ width: "250px", height: "250px", objectFit: "cover" }}
              />
            )}
          </Col>
        </Col>

        <Col xs={12} md={8} className="mt-5">
          <Table borderless border-bottom hover className="mt-5">
            <thead>
              <tr>
                <th>Item</th>
                <th>Excl. Vat</th>
                <th>Vat (25%)</th>
                <th>Incl. Vat</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-bottom">
                <td>
                  {order.auctionId},{order.title} (Hammer Price)
                </td>
                <td> </td>
                <td></td>
                <td>{order.orderSum} SEK</td>
              </tr>
              <tr className="border-bottom">
                <td>Commission fee (20%)</td>
                <td> </td>
                <td> </td>
                <td></td>
              </tr>
              <tr className="border-bottom">
                <td>Buyer's Premium</td>
                <td> </td>
                <td> </td>
                <td> </td>
              </tr>
              <tr className="border-bottom">
                <td>Shipping</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="border-bottom border-black">
                <td>Paid</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className="border-bottom">
                <td>
                  <strong>Total</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>{order.orderSum} SEK</strong>
                </td>
              </tr>
            </tbody>
          </Table>
          <Col className="d-flex justify-content-end mt-3">
            {order.status === "PENDING" && (
              <Button
                className="btn btn-dark d-flex align-items-center shadow-sm py-2 px-4"
                onClick={() => handlePayment(order.orderId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-stripe me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.226 5.385c-.584 0-.937.164-.937.593 0 .468.607.674 1.36.93 1.228.415 2.844.963 2.851 2.993C11.5 11.868 9.924 13 7.63 13a7.7 7.7 0 0 1-3.009-.626V9.758c.926.506 2.095.88 3.01.88.617 0 1.058-.165 1.058-.671 0-.518-.658-.755-1.453-1.041C6.026 8.49 4.5 7.94 4.5 6.11 4.5 4.165 5.988 3 8.226 3a7.3 7.3 0 0 1 2.734.505v2.583c-.838-.45-1.896-.703-2.734-.703" />
                </svg>
                Pay safe with Stripe
              </Button>
            )}
            ;
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailsPage;
