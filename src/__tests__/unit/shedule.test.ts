import path from 'path'
import fs from 'fs'
import Shedule from '../../modules/shedule/service'

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const local = path.resolve(__dirname, '../../../', process.env.DB_STORAGE)

const clearShedules = { shedules: [] }
const defaultShedules = {
  shedules: [

    {
      id: 'abc123',
      type: 'day',
      day: '15-08-2019',
      intervals: [
        {
          start: '11:00',
          end: '12:00'
        },
        {
          start: '14:00',
          end: '15:00'
        }]
    },
    {
      id: 'dfg456',
      type: 'daily',
      intervals: [
        {
          start: '08:00',
          end: '09:00'
        }]
    },
    {
      id: 'hij789',
      type: 'weekly',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      intervals: [
        {
          start: '16:00',
          end: '17:00'
        }]
    }

  ] }

describe('Unit Test Shedule Service', () => {
  // limpa o arquivo json antes de cada teste
  beforeEach(async () => {
    await fs.truncate(local, 0, () => { })
    await fs.writeFile(local, JSON.stringify(defaultShedules), 'utf8', (error) => {
      if (error) {
        console.log(error)
      }
    })
  })

  describe('Test Method getAll', () => {
    it('should return default shedules', async () => {
      const result = await Shedule.getAll()
      expect(Object.keys(result[0]).sort()).toEqual(['id', 'type', 'day', 'intervals'].sort())
      expect(Object.keys(result[1]).sort()).toEqual(['id', 'type', 'intervals'].sort())
      expect(Object.keys(result[2]).sort()).toEqual(['id', 'type', 'daysOfWeek', 'intervals'].sort())
    })
  })
  describe('Test Method delete', () => {
    it('should return success message', async () => {
      const result = await Shedule.delete(defaultShedules.shedules[0].id)
      expect(result).toBe('Schedule deleted successfully')
    })
    it('should return error "This schedule was not found"', (done) => {
      Shedule.delete('zyk987').catch(function (err) {
        expect(err).toStrictEqual(Error('This schedule was not found'))
        done()
      })
    })
    it('should return error "Dont have schedules to delete"', async (done) => {
      await fs.truncate(local, 0, () => { })
      await fs.writeFile(local, JSON.stringify(clearShedules), 'utf8', (error) => {
        if (error) {
          console.log(error)
        }
        Shedule.delete('zyk987').catch(function (err) {
          expect(err).toStrictEqual(Error('Dont have schedules to delete'))
          done()
        })
      })
    })
  })
})
