import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./pages/main";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/:boardId/:cardId" element={<Main />}/>
    </Routes>
  </BrowserRouter>,
  </React.StrictMode>,
  document.getElementById("root")
);
