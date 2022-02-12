import { logger } from '../service/logger'

const createTask = async function (req: any, res: any, next: any) {
  logger.info(req, res, next)
}

export { createTask }
