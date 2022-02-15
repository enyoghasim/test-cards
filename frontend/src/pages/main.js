import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import Board from "../Components/Board/Board";

import "./main.css";
import Editable from "../Components/Editabled/Editable";
import { axiosGetInterface, axiosPostInterface } from "../Util/axios";

function App() {
  const [boardsData, setBoardsData] = useState([]);
  const [isLoading, setIsloading] = useState(false);


  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  const addboardHandler = async (name) => {
    const tempBoards = [...boardsData];
    const addData = await axiosPostInterface('/create/board', {
      boardOption : {
        title: name,
        
      }
    })
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoardsData(tempBoards);


  };

  const removeBoard = (id) => {
    const item = boardsData.filter((item) => item._id !== id);
    setBoardsData(item);
  };

  const addCardHandler = (id, title) => {
    const boardItems = boardsData.map((item) => {
      if (item._id === id) {
        item.cards.push({
          id: Date.now() + Math.random() * 2,
          title,
          labels: [],
          date: "",
          tasks: [],
        });
        return item;
      } else {
        return item;
      }
    });
    setBoardsData(boardItems);
  };

  const removeCard = (bid, cid) => {
    const board = boardsData.find((item) => item._id === bid);

    const cards = board.cards.filter((item) => item._id !== cid);
    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        item.cards = cards;
        return item;
      } else {
        return item;
      }
    });

    setBoardsData(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boardsData.findIndex((item) => item._id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boardsData[s_boardIndex]?.cards?.findIndex(
      (item) => item._id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boardsData.findIndex((item) => item._id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boardsData[t_boardIndex]?.cards?.findIndex(
      (item) => item._id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boardsData];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoardsData(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    const index = boardsData.findIndex((item) => item._id === bid);
    if (index < 0) return;

    const tempBoards = [...boardsData];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item._id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoardsData(tempBoards);
  };

  const fetchBoards = async () => {
    setIsloading(true);
    const boardsData = await axiosGetInterface('/get/board');
    setBoardsData(boardsData ? boardsData.data : []);
    setIsloading(false);

  }

  const LoaderOverlay = ({ isOpen }) => {
    const mount = document.getElementById("portal-root");
    const el = document.createElement("div");

    useEffect(() => {
      mount.appendChild(el);
      return () => mount.removeChild(el);
    }, [el, mount]);

    return createPortal((isOpen && <>
      <div className="loader-overlay">
        <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </>), el)
  }



  useEffect(() => {
    fetchBoards()
  }, []);

  return (
    <div className="app">
      <LoaderOverlay isOpen={isLoading}></LoaderOverlay>
      <div className="app_nav">
        <h1>Kanban Board</h1>
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {boardsData.map((item) => (
            <Board
              key={item._id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item._id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
            />
          ))}
          <div className="app_boards_last">
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
