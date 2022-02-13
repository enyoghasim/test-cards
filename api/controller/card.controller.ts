import Card from '../model/card.model'
import Boards from '../model/board.model'
import { logger } from '../service/logger'
import { NextFunction, Request, Response } from 'express'
import LabelModel from '../model/label.model'

const addCardToBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = new Card(req.body.cardOption)
    await card.save().then(async (result) => {
      const board = await Boards.findByIdAndUpdate(
        req?.query?.boardObjectId,
        { $push: { cards: result._id } },
        { new: true, useFindAndModify: false }
      )

      logger.info(board)
      res.status(200).send('add created card to board successful')
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

const addLabelToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const label = new LabelModel(req.body.labelOption)
    await label.save().then(async (result) => {
      const card = await Card.findByIdAndUpdate(
        req?.query?.cardObjectId,
        { $push: { labels: result._id } },
        { new: true, useFindAndModify: false }
      )
      logger.info(card)
      res.status(200).send('add created label to card successful')
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

const moveCardFromBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('move card controller')
  } catch (err) {
    logger.error(err)
  }
}

const deleteCardFromBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('delete card controller')

    const cardId = req.query.cardId

    // deleted card
    const deleted = await Card.findOneAndDelete({ _id: cardId })
    if (!deleted) return res.status(200).send('deleted card failed to be removed successful')
    if (deleted) {
      // delete corresponding id in board model
      Boards.find({ cards: { $in: [cardId] } }).then((boards) => {
        Promise.all(
          boards.map((board) => Boards.findOneAndUpdate(board._id, { $pull: { cards: cardId } }, { new: true }))
        )
      })

      res.status(200).send('deleted card from board successful')
    }
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}

export { addCardToBoard, moveCardFromBoard, addLabelToCard, deleteCardFromBoard }
