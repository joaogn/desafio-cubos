import { Router } from 'express'
import shedule from '../modules/shedule/controller'

const routes = Router()

routes.get('/shedules', shedule.getAll)
routes.post('/shedules', shedule.add)

export default routes
