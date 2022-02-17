import express, { Application, Request, Response, NextFunction } from 'express'
import Boards, { IBoard } from '../model/board.model'
import Cards from '../model/card.model'
import LabelModel from '../model/label.model'
import TaskModel from '../model/task.model'
import { logger } from '../service/logger'

const getBoard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    await Boards.find()
      .lean()
      .populate({
        path: 'cards',
        populate: [
          {
            path: 'labels',
            model: LabelModel,
            select: 'title color createdAt updatedAt'
          },
          {
            path: 'tasks',
            model: TaskModel,
            select: 'title completed createdAt updatedAt'
          }
        ]
      })
      .then((data) => {
        res.status(200).json(data)
      })
      .catch((err) => console.log(err))
  } catch (err) {
    logger.error(err)
    res.status(500).json(err)
  }
}

const createBoard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { boardOption } = req?.body
    const board = new Boards(boardOption)
    board
      .save()
      .then((data) => {
        logger.info(data)
        res.status(200).json({ status: 200, data })
      })
      .catch((err) => {
        res.status(500).json(err)
      })
  } catch (err) {
    res.status(500).json(err)
  }
}

const editBoard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const updatedData = req.body.boardEditOption
    const { boardObjectId } = req.query
    const data = (await Boards.findOneAndUpdate({ _id: boardObjectId }, updatedData)) as any
    res.status(200).json({ message: 'edited board successful', status: 200, data: { ...data?._doc, ...updatedData } })
  } catch (err) {
    res.status(500).json({ message: 'edited board failed', status: 500, error: err })
  }
}

const deleteBoard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const boardId: any = req.query.boardObjectId
    // delete the board first
    await Boards.deleteMany({ _id: boardId })

    // get the card id then use it to find all the labels and task with this id and delete all
    const cardLists = await Cards.find({ boardRefId: boardId }).lean()
    cardLists.map(async (res) => {
      await TaskModel.deleteMany({ cardRefId: res._id })
      await LabelModel.deleteMany({ cardRefId: res._id })
    })
    // then delete the card lastly
    await Cards.deleteMany({ cardRefId: boardId })

    res.status(200).json({ message: 'deleted board successful', status: 200 })
  } catch (err) {
    logger.error(err)
  }
}

export { createBoard, getBoard, editBoard, deleteBoard }
