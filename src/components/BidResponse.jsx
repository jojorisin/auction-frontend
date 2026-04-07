import { Alert } from "react-bootstrap";

const BidResponse = ({ bidResponse }) => {
  if (!bidResponse) return null;

  const { isAuto, status, maxBidSum} = bidResponse;

  const renderResponse = () => {
    switch (status) {
      case "LEADING":
        return (
          <Alert variant="success">
            {isAuto ? (
              <>
                <strong>Congratulations! You're leading.</strong>
                <p>Your hidden max bid: {maxBidSum} kr</p>
              </>
            ) : (
              <>
                <strong>
                  Congratulations! You're leading. Place a higher max bid to
                  access automatic bidding
                </strong>
              </>
            )}
          </Alert>
        );
      case "OUTBID":
        return (
          <Alert variant="warning">
            {isAuto ? (
              <>
                <strong>
                  Oh no, you're maxed out. Somebody had a higher hidden max bid.
                  Place a higher bid to take the lead.
                </strong>
              </>
            ) : (
              <>
                <strong>Oh no, you were outbid!</strong>
              </>
            )}
          </Alert>
        );
      case "BELOW_ACCEPTED_LEADING":
        return (
          <Alert variant="warning">
            <>
              <strong>
                Your bid is under accepted. Place a higher bid to win the
                auction.
              </strong>
            </>
          </Alert>
        );
      default:
        return null;
    }
  };

  return renderResponse();
};

export default BidResponse;
