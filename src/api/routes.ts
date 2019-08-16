import { Router } from 'express'
import shedule from '../modules/shedule/controller'

const routes = Router()

routes.get('/shedules', shedule.getAll)
routes.post('/shedules', shedule.add)
routes.get('/shedules/:start/:end', shedule.getByInterval)
routes.delete('/shedules/:id/delete', shedule.delete)

export default routes
