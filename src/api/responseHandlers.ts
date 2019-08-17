import { Request, Response, ErrorRequestHandler, NextFunction } from 'express'

class Handlers {
  public onError (res: Response, err: string) {
    res.status(400).send(`${err}`)
  }

  public onSucess (res: Response, data) {
    res.status(200).json(data)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public errorHandlerApi (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    console.error(`API error handler execute: ${err}`)
    res.status(500).send('Internal Server Error')
  }
}

export default new Handlers()
