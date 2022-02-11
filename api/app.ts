import express from "express";
import cors from "cors";
import { config } from "dotenv";

import mongooseInstance from "./data.db.source/mongoose";
const route = require('./route/index');

config();
const app = express()

app.use(cors());

app.use('/', route);

mongooseInstance
  .then(() => {
    console.log("connected successfully..");
    app.listen(process.env.PORT || 9090, () => {
      console.log(
        `!!! Server is running on port ${process.env.PORT || 9090} !!!`
      );
    });
  })
  .catch((err) => {
    console.error("not connected successfully..", err);
  });
