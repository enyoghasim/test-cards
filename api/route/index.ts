import app from "express";
import { createBoard } from "../controller/index.controller";

// Initiate router
const router = app.Router();

router.get("/", createBoard);




// Exporting router variable
module.exports = router;
