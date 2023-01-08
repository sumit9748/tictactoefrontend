import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import "./card.css";
import Moment from "react-moment";
import { Link } from "react-router-dom";
const Card = ({ cardDetails }) => {
  const { currentUser } = useContext(AuthContext);
  const [friend, setFriend] = useState([]);

  const findFriend = async (friendId) => {
    try {
      const res = await axiosInstance.get("/auth/" + friendId);
      setFriend(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    const friendId = cardDetails.users.filter((id) => id !== currentUser?._id);
    findFriend(friendId);
  }, [cardDetails]);
  return (
    <div className="card">
      <h2>Game with {friend.name}</h2>
      {!cardDetails.status ? (
        <>
          {cardDetails.lastMove === currentUser?.username ? (
            <p style={{ margin: "0px 0px" }}>Its their Move</p>
          ) : (
            <p style={{ margin: "0px 0px" }}>its your turn to play now</p>
          )}
          <p>
            <Moment format="YYYY-MM-DD HH:mm">{cardDetails.updatedAt}</Moment>
          </p>
          <Link
            to={{
              pathname: "/board",
              state: cardDetails._id,
              friend: friend._id,
            }}
          >
            <button className="playYear">Play</button>
          </Link>
        </>
      ) : (
        <>
          {cardDetails?.type == 3 && (
            <p style={{ margin: "0px 0px" }}>Its a draw match</p>
          )}
          {cardDetails?.type == 2 && (
            <p style={{ margin: "0px 0px" }}>Other player won</p>
          )}
          {cardDetails?.type == 1 && (
            <p style={{ margin: "0px 0px" }}>You Win </p>
          )}

          <Link
            to={{
              pathname: "/board",
              state: cardDetails._id,
              friend: friend._id,
            }}
          >
            <button className="playYear">View Details</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Card;
