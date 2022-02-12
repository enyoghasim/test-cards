import app, { Router } from 'express'
import { createBoard, getBoard } from '../controller/board.controller'
import { createCard } from '../controller/card.controller'

// Initiate router
const router: Router = app.Router()

router.get('/', createBoard)
router.get('/create/card', createCard)
router.get('/get/board', getBoard)

// Exporting router variable
export { router }
