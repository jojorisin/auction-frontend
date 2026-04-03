import { getMyOrderById } from "../services/api";
import { useEffect, useState } from "react";
import { Container, Alert, Table, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Container className="bg-white p-5">
      <Row className="p-3">
        <Row>
          <Col>
            <h2 className="mb-5">Order #{order.orderId}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={4}>
            {order.imageUrl && (
              <img
                src={order.imageUrl}
                alt={order.title}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            )}
          </Col>

          <Col>
            <h3 className="mb-3">{order.status}</h3>
            <Table borderless border-bottom hover>
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
                  <td>{total.toFixed(2)} SEK</td>
                  <td>0.00 SEK</td>
                  <td>
                    <strong>{total.toFixed(2)} SEK</strong>
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td>Commission fee (20%)</td>
                  <td>{commissionExclVat.toFixed(2)} SEK</td>
                  <td>{commissionVat.toFixed(2)} SEK</td>
                  <td>{commissionInclVat.toFixed(2)} SEK</td>
                </tr>
                <tr className="border-bottom">
                  <td>Buyer's Premium</td>
                  <td>{premiumExclVat.toFixed(2)} SEK</td>
                  <td>{premiumVat.toFixed(2)} SEK</td>
                  <td>{premiumInclVat.toFixed(2)} SEK</td>
                </tr>
                <tr className="border-bottom">
                  <td>Shipping</td>
                  <td>0.00 SEK</td>
                  <td>0.00 SEK</td>
                  <td>0.00 SEK</td>
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
                    <strong>{finalTotal.toFixed(2)} SEK</strong>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default OrderDetailsPage;
