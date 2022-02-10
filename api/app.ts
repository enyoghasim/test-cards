import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 9090, () => {
  console.log("!!! Server is running on port 9090 !!!");
});
