import express, { Application, Request, Response, NextFunction } from 'express'
import Boards, { IBoard } from '../model/board.model'
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
    logger.info(res)
  } catch (err) {
    logger.error(err)
  }
}

export { createBoard, getBoard, editBoard, deleteBoard }
