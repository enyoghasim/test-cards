import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editabled/Editable";

import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDrop = (e) => {
    // console.log(e);
    if (props.board?.cards?.length)
      return
     props.handleDrop(props.board._id)
  }

  return (
    <div className="board" >
      {/* onDragEnter={() => props.dragEntered(props.boardId, )} */}
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title}
          <span>{props.board?.cards?.length || 0}</span>
        </p>
        <div
          className="board_header_title_more"
          onClick={() => setShowDropdown(true)}
        >
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <p onClick={() => props.removeBoard()}>Delete Board</p>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        {props.board?.cards?.map((item, index) => (
          <Card
            key={index}
            card={item}
            boardId={props.board._id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
            updateCardData={props.updateCardData}
            deleteLabel={props.deleteLabel}
            deleteTask={props.deleteTask}
            addLabelToCard={props.addLabelToCard}
            addTaskToCard={props.addTaskToCard}
            editTask={props.editTask}
            onDragStart={props.onDragStart}
          />
        ))}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?._id, value)}
        />
      </div>
    </div>
  );
}

export default Board;
