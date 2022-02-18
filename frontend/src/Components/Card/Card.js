import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom'

import { CheckSquare, Clock, MoreHorizontal } from "react-feather";

import Dropdown from "../Dropdown/Dropdown";

import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { _id, title, date, tasks, labels } = props.card;

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (!date) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Aprl",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    return day + " " + month;
  };

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!params.boardId || !props.boardId) {
      setShowModal(false)
    } else if (!((params.boardId) ===
      (props.boardId)) ||
      !((params.cardId) ===
        (_id))) {
      setShowModal(false)
    } else if (((params.boardId) ===
      (props.boardId)) ||
      ((params.cardId) ===
        (_id))) {
      setShowModal(true)
    }
  }, [params])

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => navigate('/')}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
          deleteLabel={props.deleteLabel}
          deleteTask={props.deleteTask}
          addLabelToCard={props.addLabelToCard}
          addTaskToCard={props.addTaskToCard}
          editTask={props.editTask}
          updateCardData={props.updateCardData}
        />
      )}
      <div

        className="card"
        draggable
        onDragEnd={() => props.dragEnded(props.boardId, _id)}
        onDragEnter={() => props.dragEntered(props.boardId, _id)}
        onClick={() => navigate(`/${props.boardId}/${_id}`)}
      >
        <div className="card_top">
          <div className="card_top_labels">
            {labels?.map((item, index) => (
              <label key={index} style={{ backgroundColor: item.color }}>
                {item.text}
              </label>
            ))}
          </div>
          <div
            className="card_top_more"
            onClick={(event) => {
              event.stopPropagation();
              setShowDropdown(true);
            }}
          >
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                class="board_dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <p onClick={() => props.removeCard(props.boardId, _id)}>
                  Delete Card
                </p>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="card_title">{title}</div>
        <div className="card_footer">
          {date && (
            <p className="card_footer_item">
              <Clock className="card_footer_icon" />
              {formatDate(date)}
            </p>
          )}
          {tasks && tasks?.length > 0 && (
            <p className="card_footer_item">
              <CheckSquare className="card_footer_icon" />
              {tasks?.filter((item) => item.completed)?.length}/{tasks?.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
