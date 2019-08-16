import { Request, Response } from 'express'
import Handlers from '../../api/responseHandlers'
import Shedule from './service'

class SheduleController {
  public add (req: Request, res: Response) {
    Shedule.add(req.body)
      .then(value => Handlers.onSucess(res, value))
      .catch(err => Handlers.onError(res, err))
  }

  public getAll (req: Request, res: Response) {
    Shedule.getAll()
      .then(value => Handlers.onSucess(res, value))
      .catch(err => Handlers.onError(res, err))
  }

  public getByInterval (req: Request, res: Response) {
    Shedule.getByInterval(req.params.start, req.params.end)
      .then(value => Handlers.onSucess(res, value))
      .catch(err => Handlers.onError(res, err))
  }

  public delete (req: Request, res: Response) {
    Shedule.delete(req.params.id)
      .then(value => Handlers.onSucess(res, value))
      .catch(err => Handlers.onError(res, err))
  }
}

export default new SheduleController()
