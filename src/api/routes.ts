import { Router } from 'express'
import shedule from '../modules/shedule/controller'

const routes = Router()

routes.get('/', shedule.getAll)

export default routes
