import app, { Router } from 'express'
import { createBoard, getBoard } from '../controller/board.controller'
import { addCardToBoard, addLabelToCard, deleteCardFromBoard, moveCardFromBoard } from '../controller/card.controller'
import { addTaskToCard } from '../controller/task.controller'

// Initiate router
const router: Router = app.Router()

router.post('/create/board', createBoard)

router.get('/get/board', getBoard)

router.post('/card/create/label', addLabelToCard)

router.post('/board/create/card', addCardToBoard)

router.post('/card/create/task', addTaskToCard)

router.put('/move/card/board', moveCardFromBoard)

router.delete('/board/delete/card', deleteCardFromBoard)

// Exporting router variable
export { router }
