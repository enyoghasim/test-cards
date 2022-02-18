import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import Board from "../Components/Board/Board";

import "./main.css";
import Editable from "../Components/Editabled/Editable";
import { axiosGetInterface, axiosPostInterface, axiosDeleteInterface, axiosPatchInterface, axiosPutInterface } from "../Util/axios";

function App() {
  const [boardsData, setBoardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [boardActionInProgress, setBoardActionInProgress] = useState(false);


  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });


  const addboardHandler = async (name) => {
    const tempBoards = [...boardsData];
    setBoardActionInProgress(true);
    const addData = await axiosPostInterface('/create/board', {
      boardOption: {
        title: name,

      }
    })
    if (addData.status === 200 && addData.data) {
      tempBoards.push(addData.data.data);
      setBoardsData(tempBoards);
    }
    setBoardActionInProgress(false);
  };

  const removeBoard = async (id) => {
    const item = boardsData.filter((item) => item._id !== id);
    setBoardActionInProgress(true);
    setBoardsData(item);
    await axiosDeleteInterface(`/delete/board?boardObjectId=${id}`);
    setBoardActionInProgress(false);
  };

  const deleteTaskFromCard = async (tid, cid, bid) => {
    const board = boardsData.find((item) => item._id === bid);
    board.cards.map((item) => {
      if (item._id === cid) {
        const iTasks = item.tasks.filter(task => task._id !== tid)
        item.tasks = iTasks;
        return item
      }
      return item
    });
    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        return board
      } else {
        return item;
      }
    });
    await axiosDeleteInterface(`/card/delete/task?tasklId=${tid}`);
    setBoardsData(tempBoards);

  }

  const addLabelToCard = async (label, cid, bid) => {
    const board = boardsData.find((item) => item._id === bid);
    board.cards.map((item) => {
      if (item._id === cid) {
        item.labels.push(label);
        return item
      }
      return item
    });
    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        return board
      } else {
        return item;
      }
    });
    setBoardsData(tempBoards);
  }

  const addTaskToCard = async (task, cid, bid) => {
    const board = boardsData.find((item) => item._id === bid);
    board.cards.map((item) => {
      if (item._id === cid) {
        item.tasks.push(task);
        return item
      }
      return item
    });
    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        return board
      } else {
        return item;
      }
    });
    setBoardsData(tempBoards);
  }

  const deleteLabelFromCard = async (lid, cid, bid) => {
    const board = boardsData.find((item) => item._id === bid);
    board.cards.map((item) => {
      if (item._id === cid) {
        const iLabels = item.labels.filter(task => task._id !== lid)
        item.labels = iLabels;
        return item
      }
      return item
    });
    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        return board
      } else {
        return item;
      }
    });
    setBoardsData(tempBoards);
    await axiosDeleteInterface(`/card/delete/label?labelId=${lid}`);
  }


  const updateCardData = async (cid, bid, card) => {
    const board = boardsData.find((item) => item._id === bid);
    let newCard = board.cards.map(element => {
      if (element._id === cid) {
        element = { ...element, ...card }
      } return element
    });

    board.cards = newCard;
    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        item.cards = newCard
      }
      return item
    });
    await axiosPatchInterface(`/edit/card?cardObjectId=${cid}`, { boardEditOption: { ...card } });
    setBoardsData(tempBoards);

  }


  const editTaskFromCard = async (tid, cid, bid, task) => {
    const board = boardsData.find((item) => item._id === bid);
    board.cards.map((item) => {
      if (item._id === cid) {
        item.tasks.map((item) => {
          if (item._id === tid) {
            item = { ...item, ...task };
            return item
          }
          return item
        });
        return item
      }
      return item
    }
    );

    const tempBoards = boardsData.map((item) => {
      if (item._id === bid) {
        return board
      } else {
        return item;
      }
    });
    setBoardsData(tempBoards);
  }

  const addCardHandler = async (id, title) => {
    setBoardActionInProgress(true);
    const addData = await axiosPostInterface(`/board/create/card?boardObjectId=${id}`, {
      cardOption: {
        title: title,

      }
    })

    if (addData.status === 200 && addData.data) {
      const tempBoards = boardsData.map((item) => {
        if (item._id === id) {
          item.cards.push(addData.data.data);
          return item;
        } else {
          return item;
        }
      });
      setBoardsData(tempBoards);

    }
    setBoardActionInProgress(false);
  };

  const removeCard = async (bid, cid) => {
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
    setBoardActionInProgress(true);
    await axiosDeleteInterface(`/board/delete/card?cardId=${cid}`)
    setBoardActionInProgress(false);
  };



  const dragEnded = async (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boardsData.findIndex((item) => item._id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boardsData[s_boardIndex]?.cards?.findIndex(
      (item) => item._id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boardsData.findIndex((item) => item._id === targetCard.bid);
    if (t_boardIndex < 0) return;

    if (targetCard.cid && targetCard.cid !== null) {
      t_cardIndex = boardsData[t_boardIndex]?.cards?.findIndex(
        (item) => item._id === targetCard.cid
      );
      if (t_cardIndex < 0) return;
    } else {
      t_cardIndex = 0;
    }
    const tempBoards = [...boardsData];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoardsData(tempBoards);

    if (bid === targetCard.bid) {
      await axiosPutInterface("/move/within/card/board", {
        optionData: {
          boardId: bid,
          cardId: cid,
          newPosIndex: t_cardIndex
        }
      })

    }

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (!cid) {
      setTargetCard({
        bid
      });
      return
    }
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
    setIsLoading(true);
    const fetchedBoardsData = await axiosGetInterface('/get/board');
    setBoardsData(fetchedBoardsData && fetchedBoardsData.data ? fetchedBoardsData.data : []);
    setIsLoading(false);

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
          {boardsData && boardsData.map((item, index) => (
            <Board
              key={index}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item._id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
              deleteLabel={deleteLabelFromCard}
              deleteTask={deleteTaskFromCard}
              addLabelToCard={addLabelToCard}
              addTaskToCard={addTaskToCard}
              editTask={editTaskFromCard}
              updateCardData={updateCardData}

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
              disabled={boardActionInProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
