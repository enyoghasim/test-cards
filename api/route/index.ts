import app, { Router } from 'express'
import { createBoard, deleteBoard, editBoard, getBoard } from '../controller/board.controller'
import {
  addCardToBoard,
  addLabelToCard,
  deleteCardFromBoard,
  deleteLabelFromCard,
  editCard,
  moveCardFromBoards,
  moveCardWithinBoard
} from '../controller/card.controller'
import { addTaskToCard, deleteTaskFromCard, editTask } from '../controller/task.controller'

// Initiate router
const router: Router = app.Router()

router.post('/create/board', createBoard)

router.delete('/delete/board', deleteBoard)

router.patch('/edit/card', editCard)

router.get('/get/board', getBoard)

router.post('/card/create/label', addLabelToCard)

router.delete('/card/delete/label', deleteLabelFromCard)

router.post('/board/create/card', addCardToBoard)

router.post('/card/create/task', addTaskToCard)

router.patch('/edit/task', editTask)

router.delete('/card/delete/task', deleteTaskFromCard)

router.put('/card/move/board', moveCardFromBoards)

router.patch('/edit/board', editBoard)

router.put('/move/within/card/board', moveCardWithinBoard)

router.delete('/board/delete/card', deleteCardFromBoard)

// Exporting router variable
export { router }
