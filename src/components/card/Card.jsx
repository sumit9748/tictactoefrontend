import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import "./card.css";
import Moment from "react-moment";
import { Link } from "react-router-dom";
const Card = ({ cardDetails }) => {
  const { currentUser } = useContext(AuthContext);
  const [friend, setFriend] = useState([]);
  const [tu, setTu] = useState("");

  const findFriend = async (friendId) => {
    try {
      const res = await axiosInstance.get("/auth/" + friendId);
      setFriend(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    setTu(
      cardDetails?.lastMove !== ""
        ? cardDetails?.lastMove !== currentUser.username
          ? "Its your move"
          : "Its other move"
        : cardDetails?.users[0] === currentUser._id
        ? "Its your move"
        : "Its other move"
    );
  }, []);

  useEffect(() => {
    const friendId = cardDetails.users.filter((id) => id !== currentUser?._id);
    findFriend(friendId);
  }, [cardDetails]);
  return (
    <div className="card">
      <h2>Game with {friend.name}</h2>
      {!cardDetails.status ? (
        <>
          <p>
            <Moment format="YYYY-MM-DD HH:mm">{cardDetails.updatedAt}</Moment>
            <p>{tu}</p>
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
          {cardDetails?.type == 3 ? (
            <p style={{ margin: "5px 0px" }}>Its a draw match</p>
          ) : cardDetails?.lastMove === currentUser.username ? (
            <p style={{ margin: "5px 0px" }}>You win</p>
          ) : (
            <p style={{ margin: "5px 0px" }}>Other player win</p>
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
