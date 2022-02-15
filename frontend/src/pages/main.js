import React, { useEffect, useState } from "react";

import Board from "../Components/Board/Board";

import "./main.css";
import Editable from "../Components/Editabled/Editable";
import { axiosGetInterface } from "../Util/axios";

function App() {
  const [boardsData, setBoardsData] = useState([]);
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("prac-kanban")) || []
  );

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  const addboardHandler = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (id) => {
    const item = boards.filter((item) => item.id !== id);
    setBoards(item);
  };

  const addCardHandler = (id, title) => {
    const boardItems = boards.map((item) => {
      if (item.id === id) {
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
    setBoards(boardItems);
  };

  const removeCard = (bid, cid) => {
    const board = boards.find((item) => item.id === bid);

    const cards = board.cards.filter((item) => item.id !== cid);
    const tempBoards = boards.map((item) => {
      if (item.id === bid) {
        item.cards = cards;
        return item;
      } else {
        return item;
      }
    });

    setBoards(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

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
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };

  const fetchBoards = async () => {
    const boardsData = await axiosGetInterface();
    setBoardsData(boardsData ? boardsData.data : []);

  }

  useEffect(() => {
    localStorage.setItem("prac-kanban", JSON.stringify(boards));

  }, [boards]);

  useEffect(() => {
    fetchBoards()
  }, []);

  return (
    <div className="app">
      <div className="app_nav">
        <h1>Kanban Board</h1>
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
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
