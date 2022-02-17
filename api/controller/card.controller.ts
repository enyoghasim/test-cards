import Cards from '../model/card.model'
import Boards from '../model/board.model'
import { logger } from '../service/logger'
import { NextFunction, Request, Response } from 'express'
import LabelModel from '../model/label.model'
import TaskModel from '../model/task.model'
import { Console } from 'console'

type IoptionData = {
  optionData: {
    boardFromId: string;
    boardToId: string;
    cardId: string;
    newPosIndex: number;
  };
};

type IwithinOptionData = {
  optionData: {
    boardId: string;
    cardId: string;
    newPosIndex: number;
  };
};

const addCardToBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardOption } = req.body
    const labelOptionpayload = { ...cardOption, boardRefId: req?.query?.boardObjectId }
    const card = new Cards(labelOptionpayload)
    let cardData
    await card.save().then(async (result) => {
      cardData = result
      const board = await Boards.findByIdAndUpdate(
        req?.query?.boardObjectId,
        { $push: { cards: result._id } },
        { new: true, useFindAndModify: false }
      )

      logger.info(board)
      res.status(200).json({ message: 'add created card to board successful', status: 200, data: cardData })
    })
  } catch (err) {
    res.status(500).json({ message: 'unable to add card to board successful', status: 500, error: err })
  }
}

const editCard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const updatedData = req.body.boardEditOption
    const { cardObjectId } = req.query
    const data = (await Cards.findOneAndUpdate({ _id: cardObjectId }, updatedData)) as any
    res.status(200).json({ message: 'edited card successful', status: 200, data: { ...data?._doc, ...updatedData } })
  } catch (err) {
    res.status(500).json({ message: 'edited card failed', status: 500, error: err })
  }
}

const addLabelToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { labelOption } = req.body

    const labelOptionpayload = { ...labelOption, cardRefId: req?.query?.cardObjectId }

    const label = new LabelModel(labelOptionpayload)

    let labelData

    await label.save().then(async (result) => {
      labelData = result
      const card = await Cards.findByIdAndUpdate(
        req?.query?.cardObjectId,
        { $push: { labels: result._id } },
        { new: true, useFindAndModify: false }
      )
      logger.info(card)
      res.status(200).json({ message: 'add label to card successful', status: 200, data: labelData })
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: 'unable to add label to card successful', status: 500, error: err })
  }
}

const moveCardFromBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { optionData } = req.body as IoptionData
    const { boardFromId, boardToId, cardId, newPosIndex } = optionData

    // remove card from the from board and update it on the to board
    await Boards.findByIdAndUpdate(boardFromId, { $pull: { cards: cardId } }, { new: true, useFindAndModify: false })

    logger.info('move card controller')
    // remove the card from the first board and taking it to the second board
  } catch (err) {
    res.status(500).json(err)
  }
}

const moveCardWithinBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { optionData } = req.body as IwithinOptionData
    let updatedCardPosition

    const { boardId, cardId, newPosIndex } = optionData

    logger.info('move card controller')

    const removedCardIdFromBoard = await Boards.findByIdAndUpdate(
      boardId,
      { $pull: { cards: cardId } },
      { new: true, useFindAndModify: false }
    )

    if (removedCardIdFromBoard) {
      updatedCardPosition = await Boards.findByIdAndUpdate(
        boardId,
        { $push: { cards: { $each: [cardId], $position: newPosIndex } } },
        { new: true, useFindAndModify: false }
      )
    }
    res.status(200).json({ message: 'moved card in board successful', status: 200, data: updatedCardPosition })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: 'moved card in board failed', status: 500, error: err })
  }
}

const deleteLabelFromCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('delete label controller')

    const labelId: any = req.query.labelId

    // deleted card
    const deleted = await LabelModel.findOneAndDelete({ _id: labelId })

    if (!deleted) return res.status(400).send('deleted label failed to be removed successful')

    if (deleted) {
      await Cards.find({ labels: { $in: [labelId] } }).then((labels) => {
        Promise.all(
          labels.map((label) => Cards.findOneAndUpdate(label._id, { $pull: { labels: labelId } }, { new: true }))
        )
      })

      res.status(200).json({ message: 'deleted label from card successful', status: 200, data: deleted })
    }
  } catch (err) {
    res.status(500).json({ message: 'unable to delete label successfully', status: 500, error: err })
  }
}

const deleteCardFromBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('delete card controller')

    const cardId: any = req.query.cardId

    // deleted card
    const deleted = await Cards.findOneAndDelete({ _id: cardId })

    // deleted all related TaskModel LabelModel
    await TaskModel.deleteMany({ cardRefId: cardId })
    await LabelModel.deleteMany({ cardRefId: cardId })

    if (!deleted) return res.status(400).send('deleted card failed to be removed successful')

    if (deleted) {
      await Boards.find({ cards: { $in: [cardId] } }).then((boards) => {
        Promise.all(
          boards.map((board) => Boards.findOneAndUpdate(board._id, { $pull: { cards: cardId } }, { new: true }))
        )
      })

      res.status(200).json({ message: 'deleted card from board successful', status: 200, data: deleted })
    }
  } catch (err) {
    res.status(500).json({ message: 'unable to delete card successfully', status: 500, error: err })
  }
}

export {
  addCardToBoard,
  editCard,
  deleteLabelFromCard,
  moveCardFromBoards,
  moveCardWithinBoard,
  addLabelToCard,
  deleteCardFromBoard
}
