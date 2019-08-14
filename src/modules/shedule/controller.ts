import { Request, Response } from 'express'
import Handlers from '../../api/responseHandlers'
import Shedule from './service'

class SheduleController {
  public getAll (req: Request, res: Response) {
    Shedule.getAll()
      .then(value => Handlers.onSucess(res, value))
      .catch(err => Handlers.onError(res, err))
  }
}

export default new SheduleController()
