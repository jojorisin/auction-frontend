import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMyMaxBidForAuction } from "../services/api";

const MyMaxBid = ({ auctionId }) => {
  const { isLoggedIn } = useOutletContext();
  const [myMaxBid, setMyMaxBid] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const fetchMyMaxBid = async () => {
      try {
        const response = await getMyMaxBidForAuction(auctionId);
        setMyMaxBid(response.data);
      } catch (err) {
        console.error("Error fetching max bid:", err);
      }
    };
    fetchMyMaxBid();
  }, [auctionId, isLoggedIn]);

  if (!isLoggedIn || myMaxBid <= 0) {
    return null;
  }
  return <p className="text-muted small">Din max bud: {myMaxBid} kr</p>;
};

export default MyMaxBid;
