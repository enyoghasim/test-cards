import express, { Application, Request, Response, NextFunction } from 'express'
import Boards from '../model/board.model'
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
    const board = new Boards(req?.body?.boardOption)
    board
      .save()
      .then((result) => {
        logger.info(result)
        res.status(200).json({ status: 200 })
      })
      .catch((err) => {
        res.status(500).json(err)
      })
  } catch (err) {
    res.status(500).json(err)
  }
}

export { createBoard, getBoard }
