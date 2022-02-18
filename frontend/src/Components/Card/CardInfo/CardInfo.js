import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

import "./CardInfo.css";
import { axiosPatchInterface, axiosPostInterface } from "../../../Util/axios";

function CardInfo(props) {
  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

  const [selectedColor, setSelectedColor] = useState();
  const [values, setValues] = useState({
    ...props.card,
  });

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
    props.updateCardData(props.card._id, props.boardId, { title: value });
  };

  const updateDesc = (value) => {
    setValues({ ...values, description: value });
    props.updateCardData(props.card._id, props.boardId, { description: value });
  };

  const addLabel = async (label) => {
    const index = values.labels.findIndex((item) => item.text === label.text);
    if (index > -1) return;

    const labelData = await axiosPostInterface(`card/create/label?cardObjectId=${props.card._id}`, {
      labelOption: {
        title: label.text,
        color: label.color || '#a8193d'
      }
    })

    setSelectedColor("");

    if (labelData && labelData.status === 200) {


      setValues({
        ...values,
        labels: [...values.labels, labelData.data.data],
      });
      props.addLabelToCard(labelData.data.data, props.card._id, props.boardId);
    }
  };

  const removeLabel = (label) => {
    const tempLabels = values.labels.filter((item) => item._id !== label._id);

    setValues({
      ...values,
      labels: tempLabels,
    });
    props.deleteLabel(label._id, props.card._id, props.boardId)
  };

  const addTask = async (value) => {

    const taskData = await axiosPostInterface(`card/create/task?cardObjectId=${props.card._id}`, {
      taskOption: {
        title: value,
        completed: false
      }
    })

    if (taskData && taskData.status === 200) {


      setValues({
        ...values,
        tasks: [...values.tasks, taskData.data.data],
      });
      props.addTaskToCard(taskData.data.data, props.card._id, props.boardId);
    }
  };

  const removeTask = (id) => {
    const tasks = [...values.tasks];

    const tempTasks = tasks.filter((item) => item._id !== id);
    setValues({
      ...values,
      tasks: tempTasks,
    });
    props.deleteTask(id, props.card._id, props.boardId)
  };

  const updateTask = async (id, value) => {
    const tasks = [...values.tasks];

    const index = tasks.findIndex((item) => item._id === id);
    if (index < 0) return;

    tasks[index].completed = value;

    setValues({
      ...values,
      tasks,
    });
    await axiosPatchInterface(`edit/task?taskObjectId=${id}`, {
      taskEditOption: {
        ...tasks[index]
      }
    })
    props.editTask(id, props.card._id, props.boardId, { completed: value })
  };



  const calculatePercent = () => {
    if (!values.tasks?.length) return 0;
    const completed = values.tasks?.filter((item) => item.completed)?.length;
    return (completed / values.tasks?.length) * 100;
  };

  const updateDate = (date) => {
    if (!date) return;

    setValues({
      ...values,
      date,
    });
    props.updateCardData(props.card._id, props.boardId, { date });
  };

  return (
    <Modal onClose={props.onClose}>
      <div className="cardinfo">
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            <p>Title</p>
          </div>
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"
            onSubmit={updateTitle}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            <p>Description</p>
          </div>
          <Editable
            defaultValue={values.description}
            text={values.description || "Add a Description"}
            placeholder="Enter description"
            onSubmit={updateDesc}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            <p>Date</p>
          </div>
          <input
            type="date"
            defaultValue={values.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Tag />
            <p>Labels</p>
          </div>
          <div className="cardinfo_box_labels">
            {values.labels?.map((item,index) => (
              <label
               key={index}
                style={{ backgroundColor: item.color, color: "#fff" }}
              >
                {item.title}
                <X onClick={() => removeLabel(item)} />
              </label>
            ))}
          </div>
          <ul>
            {colors.map((item, index) => (
              <li
                key={index + item}
                style={{ backgroundColor: item }}
                className={selectedColor === item ? "li_active" : ""}
                onClick={() => setSelectedColor(item)}
              />
            ))}
          </ul>
          <Editable
            text="Add Label"
            placeholder="Enter label text"
            onSubmit={(value) =>
              addLabel({ color: selectedColor, text: value })
            }
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          <div className="cardinfo_box_progress-bar">
            <div
              className="cardinfo_box_progress"
              style={{
                width: `${calculatePercent()}%`,
                backgroundColor: calculatePercent() === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <div className="cardinfo_box_task_list">
            {values.tasks?.map((item,index) => (
              <div key={index} className="cardinfo_box_task_checkbox">
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  onChange={(event) =>
                    updateTask(item._id, event.target.checked)
                  }
                />
                <p className={item.completed ? "completed" : ""}>{item.title}</p>
                <Trash onClick={() => removeTask(item._id)} />
              </div>
            ))}
          </div>
          <Editable
            text={"Add a Task"}
            placeholder="Enter task"
            onSubmit={addTask}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
