import { NextFunction, Request, Response } from 'express'
import Cards from '../model/card.model'
import TaskModel from '../model/task.model'
import { logger } from '../service/logger'

const addTaskToCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskOption } = req.body

    const taskOptionpayload = { ...taskOption, cardRefId: req?.query?.cardObjectId }

    const task = new TaskModel(taskOptionpayload)

    await task.save().then(async (result) => {
      const card = await Cards.findByIdAndUpdate(
        req?.query?.cardObjectId,
        { $push: { tasks: result._id } },
        { new: true, useFindAndModify: false }
      )
      logger.info(card)
      res.status(200).json({ message: 'add created task to card successful', status: 200, data: card })
    })
  } catch (err) {
    res.status(500).json({ message: 'unable to created task to card successful', status: 500, error: err })
  }
}

export { addTaskToCard }
