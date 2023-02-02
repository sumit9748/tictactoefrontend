import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";

import Header from "../header/Header";
import "./board.css";
import { io } from "socket.io-client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import TictactoeBoard from "./TictactoeBoard";
const Board = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const socket = useRef();
  const queryClient = useQueryClient();

  const [turn, setTurn] = useState(false);

  const [op, setOp] = useState("");
  const [win, setWin] = useState("");
  const [mess, setMess] = useState(null);
  const [playerboard, setPlayerboard] = useState(null);
  const [friendId, setFriendId] = useState({});

  useEffect(() => {
    // console.log(1);
    socket.current = io("ws://localhost:8000");
    socket.current.emit("addUser", currentUser._id);

    socket.current.on("getText", (data) => {
      setMess({
        sender: data.senderId,
        num: data.num,
        lastMove: data.lastMove,
        fill: data.fill,
        status: data.status,
      });
    });
  }, []);

  //first run

  const {
    isLoading,
    error,
    data: board,
  } = useQuery(["board"], () =>
    axiosInstance.get(`/board/boardSp/${location.state}`).then((res) => {
      // console.log(3);

      setPlayerboard(res.data.boardStatus);
      return res.data;
    })
  );

  useEffect(() => {
    const fr = board?.users.filter((id) => id !== currentUser._id);
    // console.log(fr[0]);
    // console.log(4);

    const getUser = async () => {
      try {
        const res = await axiosInstance.get(`/auth/${fr[0]}`);
        setFriendId(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  //set my moves
  useEffect(() => {
    board?.status === false &&
      setOp(
        board?.lastMove !== ""
          ? board?.lastMove !== currentUser.username
            ? "Its your move"
            : "Its other move"
          : board?.users[0] === currentUser._id
          ? "Its your move"
          : "Its other move"
      );
    board?.status === false &&
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
  }, [board, playerboard]);
  //when ever a new entry comes
  useEffect(() => {
    // console.log(5);
    if (mess !== null) {
      board.boardStatus[mess.num].userId = mess?.sender;
      board.boardStatus[mess.num].filled = true;
      board.lastMove = mess.lastMove;
      board.fill = mess.fill;
      board.status = mess.status;

      setPlayerboard(board.boardStatus);
    }
  }, [mess]);

  //it updates the board whenever a change locks.

  const updateBoard = useMutation(
    (bordAll) => {
      return axiosInstance.put(`/board/${board._id}`, bordAll);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["board"]);
      },
    }
  );

  const handleClick = (id) => {
    if (!board.boardStatus[id].filled && turn === true) {
      board.boardStatus[id].userId = currentUser._id;
      board.boardStatus[id].filled = true;
      board.lastMove = currentUser.username;
      board.status = false;
      board.fill = board.fill + 1;
      board.type = 1;

      let m = checkWin();
      if (m == 1) {
        board.status = true;
        board.type = 2;
      } else if (m == 2) {
        board.status = true;
        board.type = 3;
      }
      socket.current.emit("sendText", {
        senderId: currentUser._id,
        receiverId: friendId._id,
        num: id,
        lastMove: currentUser.username,
        fill: board.fill,
        status: board.status,
      });
      updateBoard.mutate({
        boardStatus: board.boardStatus,
        status: board.status,
        lastMove: board.lastMove,
        fill: board.fill,
        type: board.type,
      });
    }
  };

  const colCheck = () => {
    let ans = false;

    for (let i = 0; i < 3; i++) {
      if (
        board?.boardStatus[i].userId === board?.boardStatus[i + 3].userId &&
        board?.boardStatus[i].userId === board?.boardStatus[i + 6].userId &&
        board?.boardStatus[i].userId !== ""
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
        board?.boardStatus[i].userId === board?.boardStatus[i + 1].userId &&
        board?.boardStatus[i].userId === board?.boardStatus[i + 2].userId &&
        board?.boardStatus[i].userId !== ""
      ) {
        ans = true;
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

  const checkWin = () => {
    console.log(board);
    var col = colCheck();
    var row = rowCheck();
    var dia = diagonalCheck();
    if (col || row || dia) {
      return 1;
    } else if (board?.fill >= 9 && !col && !row && !dia) {
      return 2;
    } else return 3;
  };

  const saveMatch = () => {
    const boardAll = {
      boardStatus: board.boardStatus,
      status: board.status,
      lastMove: board.lastMove,
      fill: board.fill,
      type: board.type,
    };

    updateBoard.mutate(boardAll);
  };

  return (
    <div>
      {friendId ? (
        <>
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
          {isLoading && friendId ? (
            "Loading the board"
          ) : (
            <TictactoeBoard
              board={board}
              friendId={friendId}
              handleClick={handleClick}
              playerboard={playerboard}
              saveMatch={saveMatch}
            />
          )}
        </>
      ) : (
        "loading"
      )}
    </div>
  );
};

export default Board;
