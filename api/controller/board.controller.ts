import express, { Application, Request, Response, NextFunction } from 'express'
import Boards from '../model/board.model'
import Card from '../model/card.model'
import { logger } from '../service/logger'

const getBoard = async function (req: Request, res: Response, next: NextFunction) {
  return Boards.find().then((res) => console.log(JSON.stringify(res, null, 2)))
}

const createBoard = async function (req: Request, res: Response, next: NextFunction) {
  const board = new Boards(req?.body?.boardOption)
  board
    .save()
    .then((result) => {
      logger.info(result)
      res.status(200).send('ok')
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
}

export { createBoard, getBoard }
