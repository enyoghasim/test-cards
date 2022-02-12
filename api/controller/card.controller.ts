import Card from '../model/card.model'
import Boards from '../model/board.model'
import { logger } from '../service/logger'
import { NextFunction, Request, Response } from 'express'

const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = new Card(req.body.cardOption)

    await card.save().then(async (result) => {
      const board = await Boards.findByIdAndUpdate(
        req?.query?.boardObjectId,
        { $push: { cards: result._id } },
        { new: true, useFindAndModify: false }
      )

      logger.info(board)
      res.status(200).send('card create successful')
    })
  } catch (err) {
    res.status(200).send(err)
  }
}

export { createCard }
