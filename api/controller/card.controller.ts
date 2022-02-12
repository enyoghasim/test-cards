import Card from '../model/card.model'
import Boards from '../model/board.model'
import { logger } from '../service/logger'

const createCard = async function (req: any, res: any, next: any) {
  try {
    logger.info('working controller card')

    const b = new Card({
      id: '122343',
      title: 'test'
    })

    await b.save()
    logger.info(req, res)
    res.json('hello')
    next()
  } catch (e) {
    logger.error(e)
  }
}

export { createCard }
