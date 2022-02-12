import express, { Application, Request, Response, NextFunction } from 'express'
import Boards from '../model/board.model'
import { logger } from '../service/logger'

const createBoard = async function (req: Request, res: Response, next: NextFunction) {
  try {
    logger.info('working controller')
    const b = new Boards({
      id: '122343',
      title: 'test'
    })

    await b.save()
    res.json('hello')
    next()
  } catch (e) {
    logger.error(e)
  }
}

export { createBoard }
