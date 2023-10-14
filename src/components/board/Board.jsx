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
  const [board, setBoard] = useState(null);
  const [playerboard, setPlayerboard] = useState(null);
  const [friendId, setFriendId] = useState({});

  useEffect(() => {

    socket.current = io("https://tictactoebaackend.onrender.com/");
    socket.current.emit("addUser", currentUser._id);

    socket.current.on("getText", (data) => {

      setMess({

        senderId: data.senderId,
        newboard: data.bo,
        lastMove: data.lastMove,
        status: data.status,
        num: data.num,
        type: data.type,

      });
    });

    return () => {
      socket.current.disconnect();
    };

  }, []);

  //first run


  useEffect(() => {


    const getAllInOne = async () => {
      try {

        const wholebo = await axiosInstance.get(`/board/boardSp/${location.state}`);
        setBoard(wholebo.data);
        setPlayerboard(wholebo.data.boardStatus);
        getFr(wholebo.data);
      } catch (err) {

      }
    }

    getAllInOne();

  }, [currentUser]);



  const getFr = async (bb) => {
    const fr = bb?.users.filter((id) => id !== currentUser._id);

    try {
      const friend = await axiosInstance.get(`/auth/${fr[0]}`);

      setFriendId(friend?.data);
      socket.current.emit("addUser", friend.data._id);

    } catch (err) { }
  };



  //set my moves
  useEffect(() => {


    if (board?.status === false) {
      setOp(
        board?.lastMove !== ""
          ? board?.lastMove !== currentUser.username
            ? "Its your move"
            : "Its other move"
          : board?.users[0] === currentUser._id
            ? "Its your move"
            : "Its other move"
      );
      setTurn(
        board?.lastMove !== ""
          ? board?.lastMove === currentUser.username
            ? false
            : true
          : board?.users[0] === currentUser._id
            ? true
            : false
      );
    } else if (board && board.status === true) {
      setWin(
        board?.type !== 3
          ? board?.type === 2 && board?.lastMove === currentUser.username
            ? "You won"
            : "Other player won"
          : "Its a draw"
      );
    }
  }, [friendId, board])


  //when ever a new entry comes
  useEffect(() => {


    if (mess !== null) {

      const messUpdated = { ...board };

      setPlayerboard(mess.newboard);
      messUpdated.lastMove = mess.lastMove;
      messUpdated.status = mess.status;
      messUpdated.type = mess.type;
      messUpdated.boardStatus[mess.num].userId = mess.senderId;
      messUpdated.boardStatus[mess.num].filled = true;
      console.log(messUpdated)
      setBoard(messUpdated);
    }
    // console.log(board)
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


      const updatedBoard = { ...board };

      // Step 2: Create a new array that includes all elements of the original 'boardStatus' array


      // Step 3: Update the 5th element (index 4) with the desired changes
      updatedBoard.boardStatus[id] = { filled: true, userId: currentUser._id, type: "" }; // Replace the sample values with your desired changes

      // Step 4: Assign the modified array back to the 'boardStatus' property in the copied 'board' object
      updatedBoard.status = false;

      updatedBoard.lastMove = currentUser.username;

      updatedBoard.type = 1;

      // Step 5: Update the state with the modified 'board' object

      const m = checkWin();

      if (m === 1) {
        updatedBoard.status = true;
        updatedBoard.type = 2;


      } else if (m === 2) {
        updatedBoard.status = true;
        updatedBoard.type = 3;

      }
      console.log(updatedBoard)
      setBoard(updatedBoard);
      setPlayerboard(updatedBoard.boardStatus);

      socket.current.emit("sendText", {

        senderId: currentUser._id,
        receiverId: friendId._id,
        newboard: updatedBoard.boardStatus,
        lastMove: currentUser.username,
        status: updatedBoard.status,
        num: id,
        type: updatedBoard.type,

      });
      updateBoard.mutate({
        boardStatus: updatedBoard.boardStatus,
        status: updatedBoard.status,
        lastMove: updatedBoard.lastMove,
        type: updatedBoard.type,
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

  const checkDraw = () => {

    for (var i = 0; i < board.boardStatus.length; i++) {
      if (board.boardStatus[i].filled === false) {
        return false;
      }
    }
    return true;
  }

  const checkWin = () => {

    var col = colCheck();
    var row = rowCheck();
    var dia = diagonalCheck();
    var draw = checkDraw();
    if (col || row || dia) {
      return 1;
    } else {
      if (draw) return 2;
      else return 3;
    }
  };




  const saveMatch = () => {
    const boardAll = {
      boardStatus: board.boardStatus,
      status: board.status,
      lastMove: board.lastMove,

      type: board.type,
    };

    updateBoard.mutate(boardAll);
  };

  return (
    <div>
      {friendId && playerboard ? (
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
          {!friendId && !playerboard ? (
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
