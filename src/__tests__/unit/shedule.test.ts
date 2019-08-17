
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
      type: 0,
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
      type: 1,
      intervals: [
        {
          start: '08:00',
          end: '09:00'
        }]
    },
    {
      id: 'hij789',
      type: 2,
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
    it('should return error "Something happened, try again later."', (done) => {
      fs.unlink(local, () => {
        Shedule.getAll().catch(function (err) {
          expect(err).toStrictEqual(Error('Something happened, try again later.'))
          done()
        })
      })
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
    it('should return error "Something happened, try again later."', (done) => {
      fs.unlink(local, () => {
        Shedule.delete('zyk987').catch(function (err) {
          expect(err).toStrictEqual(Error('Something happened, try again later.'))
          done()
        })
      })
    })
  })



  describe('Test Validation for Method getByInterval', () => {
    it('should return error "Start value must be before end.', (done) => {
      Shedule.getByInterval('16-08-2019', '14-08-2019').catch((err) => {
        expect(err).toStrictEqual(Error('Start value must be before end.'))
        done()
      })
    })
    it('should return error "Invalid start day format."', (done) => {
      Shedule.getByInterval('1-08-2019', '14-08-2019').catch(function (err) {
        expect(err).toStrictEqual(Error('Invalid start day format.'))
        done()
      })
    })
    it('should return error "Invalid end day format"', (done) => {
      Shedule.getByInterval('14-08-2019', '16-8-2019').catch(function (err) {
        expect(err).toStrictEqual(Error('Invalid end day format'))
        done()
      })
    })
  })



  describe('Test Method getByInterval', () => {
    it('should return intervals', async () => {
      const result = await Shedule.getByInterval('14-08-2019', '16-08-2019')
      console.log(result)
      expect(Object.keys(result[0]).sort()).toEqual(['day', 'intervals'].sort())
      expect(result[0].day).toEqual('14-08-2019')
      expect(result[0].intervals[0].start).toEqual('08:00')
      expect(result[2].day).toEqual('16-08-2019')
      expect(result[2].intervals[1].end).toEqual('17:00')
    })
    it('should return error "Something happened, try again later."', (done) => {
      fs.unlink(local, () => {
        Shedule.getByInterval('14-08-2019', '16-08-2019').catch(function (err) {
          expect(err).toStrictEqual(Error('Something happened, try again later.'))
          done()
        })
      })
    })
  })



  describe('Test Validations for Method add', () => {
    it('should return error "Type is required."', (done) => {
      const newSheduleDay = {
        day: '15-08-2019',
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Type is required.'))
        done()
      })
    })
    it('should return error "daysOfWeek is required."', (done) => {
      const newSheduleDay = {
        type: 2,
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('daysOfWeek is required or Intervals is required'))
        done()
      })
    })
    it('should return error "Intervals is required."', (done) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newSheduleDay:any = {
        type: 1
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('daysOfWeek is required or Intervals is required'))
        done()
      })
    })
    it('should return error "Value not allowed for type."', (done) => {
      const newSheduleDay = {
        type: 6,
        day: '15-08-2019',
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Value not allowed for type.'))
        done()
      })
    })
    it('should return error "daysOfWeek is not allowed for this type."', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        daysOfWeek: [1, 2, 3],
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('daysOfWeek is not allowed for this type.'))
        done()
      })
    })
    it('should return error "daysOfWeek is not allowed for this type."', (done) => {
      const newSheduleDay = {
        type: 1,
        daysOfWeek: [1, 2, 3],
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('daysOfWeek is not allowed for this type.'))
        done()
      })
    })
    it('should return error "day is not allowed for this type."', (done) => {
      const newSheduleDay = {
        type: 1,
        day: '15-08-2019',
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('day is not allowed for this type.'))
        done()
      })
    })
    it('should return error "day is not allowed for this type."', (done) => {
      const newSheduleDay = {
        type: 2,
        day: '15-08-2019',
        daysOfWeek: [1, 2, 3],
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('day is not allowed for this type.'))
        done()
      })
    })
    it('should return error "Invalid day format.', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-8-2019',
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Invalid day format.'))
        done()
      })
    })
    it('should return error "Start hour must be before end."', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '10:00',
            end: '09:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Start hour must be before end.'))
        done()
      })
    })
    it('should return error "Invalid start format."', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '110:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Invalid start format.'))
        done()
      })
    })
    it('should return error "Invalid end format."', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '11:00',
            end: '20:001'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Invalid end format.'))
        done()
      })
    })
    it('should return error "Maximum allowed value is 6 within daysOfWeek."', (done) => {
      const newSheduleWeekly = {
        type: 2,
        daysOfWeek: [7],
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          }]
      }
      Shedule.add(newSheduleWeekly).catch(function (err) {
        expect(err).toStrictEqual(Error('Maximum allowed value is 6 within daysOfWeek.'))
        done()
      })
    })
    it('should return error "Minimum allowed value is 0 within daysOfWeek."', (done) => {
      const newSheduleWeekly = {
        type: 2,
        daysOfWeek: [-1],
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          }]
      }
      Shedule.add(newSheduleWeekly).catch(function (err) {
        expect(err).toStrictEqual(Error('Minimum allowed value is 0 within daysOfWeek.'))
        done()
      })
    })
    it('should return error "Must have at least one item in daysOfWeek."', (done) => {
      const newSheduleWeekly = {
        type: 2,
        daysOfWeek: [],
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          }]
      }
      Shedule.add(newSheduleWeekly).catch(function (err) {
        expect(err).toStrictEqual(Error('Must have at least one item in daysOfWeek.'))
        done()
      })
    })
    it('should return error "Must have a maximum of 7 items in daysOfWeek."', (done) => {
      const newSheduleWeekly = {
        type: 2,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6, 7],
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          }]
      }
      Shedule.add(newSheduleWeekly).catch(function (err) {
        expect(err).toStrictEqual(Error('Must have a maximum of 7 items in daysOfWeek.'))
        done()
      })
    })
    it('should return error "Has duplicate value in daysOfWeek."', (done) => {
      const newSheduleWeekly = {
        type: 2,
        daysOfWeek: [0, 1, 1],
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          }]
      }
      Shedule.add(newSheduleWeekly).catch(function (err) {
        expect(err).toStrictEqual(Error('Has duplicate value in daysOfWeek.'))
        done()
      })
    })
    it('should return error "Must have at least one item in intervals."', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: []
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Must have at least one item in intervals.'))
        done()
      })
    })
    it('should return error "Time shock in the intervals" (Intervals in same hour)', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          },
          {
            start: '16:00',
            end: '17:00'
          }
        ]
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Time shock in the intervals'))
        done()
      })
    })
    it('should return error "Time shock in the intervals" (newEnd between sart and end)', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          },
          {
            start: '15:00',
            end: '16:30'
          }
        ]
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Time shock in the intervals'))
        done()
      })
    })
    it('should return error "Time shock in the intervals" (newStart between start and end)', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          },
          {
            start: '16:30',
            end: '18:00'
          }
        ]
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Time shock in the intervals'))
        done()
      })
    })
    it('should return error "Time shock in the intervals" (newInterval inside oldInterval)', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '16:15',
            end: '16:45'
          },
          {
            start: '16:00',
            end: '17:00'
          }
        ]
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Time shock in the intervals'))
        done()
      })
    })
    it('should return error "Time shock in the intervals" (newInterval outside oldInterval)', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '16:00',
            end: '17:00'
          },
          {
            start: '15:00',
            end: '18:00'
          }
        ]
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Time shock in the intervals'))
        done()
      })
    })
    it('should return sucess (Pass oneInterval)', async () => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '17:00',
            end: '18:00'
          }
        ]
      }
      const result = await Shedule.add(newSheduleDaily)
      expect(Object.keys(result).sort()).toEqual(['id', 'type', 'intervals'].sort())
      expect(result.intervals[0].start).toEqual(newSheduleDaily.intervals[0].start)
    })
  })



  describe('Method newShedule', () => {
    it('should return new shedule type day', async () => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '10:00',
            end: '11:00'
          },
          {
            start: '12:00',
            end: '13:00'
          }
        ]
      }
      const result = await Shedule.add(newSheduleDay)
      expect(Object.keys(result).sort()).toEqual(['id', 'type', 'day', 'intervals'].sort())
      expect(result.day).toEqual(newSheduleDay.day)
      expect(result.intervals[0].start).toEqual(newSheduleDay.intervals[0].start)
    })
    it('should return new shedule type daily', async () => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '10:00',
            end: '11:00'
          }]
      }
      const result = await Shedule.add(newSheduleDaily)
      expect(Object.keys(result).sort()).toEqual(['id', 'type', 'intervals'].sort())
      expect(result.intervals[0].start).toEqual(newSheduleDaily.intervals[0].start)
    })
    it('should return new shedule type weekly', async () => {
      const newSheduleWeek = {
        type: 2,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        intervals: [
          {
            start: '18:00',
            end: '19:00'
          }]
      }
      const result = await Shedule.add(newSheduleWeek)
      expect(Object.keys(result).sort()).toEqual(['id', 'type', 'daysOfWeek', 'intervals'].sort())
      expect(result.daysOfWeek).toEqual(newSheduleWeek.daysOfWeek)
      expect(result.intervals[0].start).toEqual(newSheduleWeek.intervals[0].start)
    })
    it('should return new shedule type daily (newStartHour equals endHour)', async () => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '18:00',
            end: '19:00'
          },
          {
            start: '19:00',
            end: '20:00'
          }
        ]
      }
      const result = await Shedule.add(newSheduleDaily)
      expect(Object.keys(result).sort()).toEqual(['id', 'type', 'intervals'].sort())
      expect(result.intervals[0].start).toEqual(newSheduleDaily.intervals[0].start)
    })
    it('should return new shedule type daily (newEndHour equals startHour)', async () => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '17:00',
            end: '18:00'
          },
          {
            start: '18:00',
            end: '19:00'
          }
        ]
      }
      const result = await Shedule.add(newSheduleDaily)
      expect(Object.keys(result).sort()).toEqual(['id', 'type', 'intervals'].sort())
      expect(result.intervals[0].start).toEqual(newSheduleDaily.intervals[0].start)
    })
    it('should return error "Can not register time shock" (Intervals in same hour)', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '11:00',
            end: '12:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Can not register time shock'))
        done()
      })
    })
    it('should return error "Can not register time shock" (newEnd between old Interval)', (done) => {
      const newSheduleDaily = {
        type: 1,
        intervals: [
          {
            start: '07:30',
            end: '08:30'
          }]
      }
      Shedule.add(newSheduleDaily).catch(function (err) {
        expect(err).toStrictEqual(Error('Can not register time shock'))
        done()
      })
    })
    it('should return error "Can not register time shock" (newStart between  old Interval)', (done) => {
      const newSheduleWeekly = {
        type: 2,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        intervals: [
          {
            start: '16:30',
            end: '18:00'
          }]
      }
      Shedule.add(newSheduleWeekly).catch(function (err) {
        expect(err).toStrictEqual(Error('Can not register time shock'))
        done()
      })
    })
    it('should return error "Can not register time shock" (newInterval inside oldInterval)', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '11:15',
            end: '11:45'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Can not register time shock'))
        done()
      })
    })
    it('should return error "Can not register time shock" (newInterval outside oldInterval)', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '10:00',
            end: '13:00'
          }]
      }
      Shedule.add(newSheduleDay).catch(function (err) {
        expect(err).toStrictEqual(Error('Can not register time shock'))
        done()
      })
    })
    it('should return error "Something happened, try again later."', (done) => {
      const newSheduleDay = {
        type: 0,
        day: '15-08-2019',
        intervals: [
          {
            start: '10:00',
            end: '13:00'
          }]
      }
      fs.unlink(local, () => {
        Shedule.add(newSheduleDay).catch(function (err) {
          expect(err).toStrictEqual(Error('Something happened, try again later.'))
          done()
        })
      })
    })
  })
})
