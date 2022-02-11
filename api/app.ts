import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { config } from "dotenv";

import mongooseInstance from "./data.db.source/mongoose";
import { router } from "./route";

config();
const app = express();

app.use(cors());
app.use(express.json({}));
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use("/api/v1/", router);

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
