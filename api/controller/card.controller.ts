import Cards from '../model/card.model'
import Boards from '../model/board.model'
import { logger } from '../service/logger'
import { NextFunction, Request, Response } from 'express'
import LabelModel from '../model/label.model'
import TaskModel from '../model/task.model'

type IoptionData = {
  optionData: {
    boardFromId: string;
    boardToId: string;
    cardId: string;
  };
};

type IwithinOptionData = {
  optionData: {
    boardId: string;
    cardId: string;
    newPosIndex: number;
  };
};

const arraymove = (arr, fromIndex, toIndex) => {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

const addCardToBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = new Cards(req.body.cardOption)
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

    await label.save().then(async (result) => {
      const card = await Cards.findByIdAndUpdate(
        req?.query?.cardObjectId,
        { $push: { labels: result._id } },
        { new: true, useFindAndModify: false }
      )
      logger.info(card)
      res.status(200).json({ message: 'add label to card successful', status: 200, data: card })
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: 'unable to add label to card successful', status: 500, error: err })
  }
}

const moveCardFromBoards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { optionData } = req.query as IoptionData
    const { boardFromId, boardToId, cardId } = optionData

    logger.info('move card controller')
    // remove the card from the first board and taking it to the second board
  } catch (err) {
    res.status(500).json(err)
  }
}

const moveCardWithinBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { optionData } = req.body as IwithinOptionData
    const { boardId, cardId, newPosIndex } = optionData

    // await Boards.findById({ _id: boardId }, async (err, docs) => {
    //   const newCards = arraymove(docs?.cards, docs?.cards.indexOf(cardId, 0), newPosIndex);

    //   await Boards.updateOne(
    //     { _id: boardId },
    //     {
    //       $set: {
    //         cards: newCards,
    //       },
    //     }
    //   );

    // });

    logger.info('move card controller')
  } catch (err) {
    logger.error(err)
    res.status(500).json(err)
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

export { addCardToBoard, editCard, moveCardFromBoards, moveCardWithinBoard, addLabelToCard, deleteCardFromBoard }
