import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";

import Header from "../header/Header";
import Square from "../square/Square";
import "./board.css";
import { io } from "socket.io-client";
import Viewboard from "../../viewboard/Viewboard";
const Board = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const socket = useRef();

  const [board, setBoard] = useState(null);
  const fren = location.friend;
  const [turn, setTurn] = useState(false);
  const [friendId, setFriendId] = useState(null);
  const [op, setOp] = useState("");
  const [win, setWin] = useState("");
  const [mess, setMess] = useState(null);
  const [playerboard, setPlayerboard] = useState(null);

  //find friend
  useEffect(() => {
    socket.current = io("ws://localhost:8000");
    socket.current.on("getText", (data) => {
      console.log("call hochhena");
      setMess({
        sender: data.senderId,
        num: data.num,
        lastMove: data.lastMove,
      });
    });
  }, []);
  // console.log(mess);
  //first run
  useEffect(() => {
    const getFriend = async () => {
      try {
        const res2 = await axiosInstance.get(`/auth/${fren}`);
        setFriendId(res2.data);
      } catch (err) {}
    };
    getFriend();
  }, [currentUser]);

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await axiosInstance.get(`/board/boardSp/${location.state}`);
        setPlayerboard(res.data.boardStatus);
        setBoard(res.data);
      } catch (err) {}
    };
    getBoard();
  }, [friendId, currentUser, board]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);
    socket.current.emit("addUser", friendId?._id);
  }, [currentUser, friendId]);
  // console.log(friendId);

  //set my moves
  useEffect(() => {
    board?.status !== true &&
      setOp(
        board?.lastMove !== ""
          ? board?.lastMove !== currentUser.username
            ? "Its your move"
            : "Its other move"
          : board?.users[0] === currentUser._id
          ? "Its your move"
          : "Its other move"
      );
    board?.status !== true &&
      setTurn(
        board?.lastMove !== ""
          ? board?.lastMove === currentUser.username
            ? false
            : true
          : board?.users[0] === currentUser._id
          ? true
          : false
      );
    board?.status === true &&
      setWin(
        board?.type !== 3
          ? board?.type === 2 && board?.lastMove === currentUser.username
            ? "You won"
            : "Other player won"
          : "Its a draw"
      );
  }, [playerboard, board]);
  //when ever a new entry comes
  useEffect(() => {
    if (mess !== null) {
      board.boardStatus[mess.num].userId = mess?.sender;
      board.boardStatus[mess.num].filled = true;
      board.lastMove = mess.lastMove;

      setPlayerboard(board.boardStatus);
      setBoard(board);
    }
  }, [mess]);

  //it updates the board whenever a change locks

  const updateBoard = async () => {
    await axiosInstance
      .put(`/board/${board._id}`, {
        boardStatus: board.boardStatus,
        status: board.status,
        lastMove: board.lastMove,
        fill: board.fill,
        type: board.type,
      })
      .then(async () => {
        await axiosInstance.get(`/board/boardSp/${board._id}`).then((res) => {
          setPlayerboard(res.data.boardStatus);
          setBoard(res.data);
        });
      });
  };
  // console.log(board);
  // console.log(playerboard);

  const handleClick = (id) => {
    if (!board.boardStatus[id].filled && turn === true) {
      board.boardStatus[id].userId = currentUser._id;
      board.boardStatus[id].filled = true;
      board.lastMove = currentUser.username;
      board.status = false;
      board.fill = board.fill + 1;
      board.type = board.type;

      socket.current.emit("sendText", {
        senderId: currentUser._id,
        receiverId: friendId._id,
        num: id,
        lastMove: currentUser.username,
      });

      updateBoard();
      board.fill >= 3 && checkWin();
    }
  };

  const colCheck = () => {
    let ans = false;

    for (let i = 0; i < 3; i++) {
      if (
        board.boardStatus[i].userId === board.boardStatus[i + 3].userId &&
        board.boardStatus[i].userId === board.boardStatus[i + 6].userId &&
        board.boardStatus[i].userId !== ""
      ) {
        ans = true;
        break;
      }
    }
    return ans;
  };
  const rowCheck = () => {
    let ans = false;

    for (let i = 0; i < 9; i += 3) {
      if (
        board?.boardStatus[i]?.userId === board?.boardStatus[i + 1]?.userId &&
        board?.boardStatus[i]?.userId === board?.boardStatus[i + 2]?.userId &&
        board?.board.boardStatus[i].userId !== ""
      ) {
        ans = true;
        break;
      }
    }

    return ans;
  };
  const diagonalCheck = () => {
    let ans = false;
    if (
      board?.boardStatus[0].userId === board?.boardStatus[4].userId &&
      board?.boardStatus[0].userId === board?.boardStatus[8].userId &&
      board?.boardStatus[0].userId !== ""
    ) {
      ans = true;
    }
    if (
      board?.boardStatus[2].userId === board?.boardStatus[4].userId &&
      board?.boardStatus[2].userId === board?.boardStatus[6].userId &&
      board?.boardStatus[2].userId !== ""
    ) {
      ans = true;
    }
    return ans;
  };

  const declareWinner = (text) => {
    text === "true" &&
      setWin(
        board?.lastMove === currentUser.username
          ? "You Win"
          : "Other player won"
      );
    text === "false" && setWin("Its a draw");

    updateBoard();
  };

  const checkWin = () => {
    console.log("checkWin called");
    if (colCheck() || rowCheck() || diagonalCheck()) {
      board.status = true;
      board.type = 2;
      declareWinner("true");
    }
    if (board.fill >= 9 && !colCheck() && !rowCheck() && !diagonalCheck()) {
      board.status = true;
      board.type = 3;
      declareWinner("false");
    }
    return;
  };
  const saveMatch = async () => {
    try {
      const data = {
        boardStatus: board.boardStatus,
        status: board.status,
        lastMove: board.lastMove,
        fill: board.fill,
        type: board.type,
      };

      await axiosInstance.put(`/board/${board._id}`, {
        data,
      });
    } catch (err) {}
  };

  return (
    <div>
      <Header info={`Game with ${friendId?.name}`} />
      <p>Your Piece</p>
      <div
        style={{
          display: "flex",
          width: "105.09px",
          height: "105.09px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CloseIcon
          style={{ color: "blue", fontWeight: "bold", fontSize: "70px" }}
        />
      </div>
      <div className="boardDetector">
        <p style={{ fontSize: "20px", fontWeight: "bold" }}>
          {win !== "" ? win : op}
        </p>
      </div>
      {board?.status === false ? (
        <div className="box">
          {playerboard?.map((board, id) => (
            <div className="col">
              <Square
                element={board?.userId}
                id={id}
                handleClick={handleClick}
                friendId={friendId?._id}
              />
            </div>
          ))}
          <button className="goBack" onClick={() => saveMatch()}>
            Back to games
          </button>
        </div>
      ) : (
        <Viewboard board={board} friendId={friendId?._id} />
      )}
    </div>
  );
};

export default Board;
