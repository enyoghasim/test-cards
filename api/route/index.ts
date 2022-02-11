import app, { Router } from 'express';
import { createBoard } from '../controller/board.controller';

// Initiate router
const router: Router = app.Router();

router.get('/', createBoard);


// Exporting router variable
export { router };
