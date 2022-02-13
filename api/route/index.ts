import app, { Router } from 'express'
import { createBoard, getBoard } from '../controller/board.controller'
import { addCardToBoard, addLabelToCard, moveCardFromBoard } from '../controller/card.controller'

// Initiate router
const router: Router = app.Router()

router.post('/', createBoard)

router.post('/create/label', addLabelToCard)

router.post('/create/card', addCardToBoard)

router.get('/get/board', getBoard)

// Exporting router variable
export { router }
