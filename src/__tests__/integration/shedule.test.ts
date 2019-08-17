import request from 'supertest'
import path from 'path'
import fs from 'fs'
import app from '../../api/api'


require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})


const local = path.resolve(__dirname, '../../../', process.env.DB_STORAGE)

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
      daysOfWeek: [0, 1, 2, 3, 5, 6],
      intervals: [
        {
          start: '16:00',
          end: '17:00'
        }]
    }

  ] }



describe('Integration Test Shedule', () => {
  // limpa o arquivo json antes de cada teste
  beforeEach(async () => {
    await fs.truncate(local, 0, () => { })
    await fs.writeFile(local, JSON.stringify(defaultShedules), 'utf8', (error) => {
      if (error) {
        console.log(error)
      }
    })
  })

  describe('GET /shedules', () => {
    it('should return default shedules', (done) => {
      request(app)
        .get('/shedules')
        .set('Content-Type', 'application/json')
        .end((erro, res) => {
          expect(res.status).toEqual(200)
          expect(Object.keys(res.body[0]).sort()).toEqual(['id', 'type', 'day', 'intervals'].sort())
          expect(Object.keys(res.body[1]).sort()).toEqual(['id', 'type', 'intervals'].sort())
          expect(Object.keys(res.body[2]).sort()).toEqual(['id', 'type', 'daysOfWeek', 'intervals'].sort())
          done(erro)
        })
    })
    it('should return error "Something happened, try again later."', (done) => {
      fs.unlink(local, () => {
        request(app)
          .get('/shedules')
          .set('Content-Type', 'application/json')
          .end((erro, res) => {
            expect(res.status).toEqual(400)
            expect(res.text).toBe('Error: Something happened, try again later.')
            done(erro)
          })
      })
    })
  })
  describe('POST /shedules', () => {
    it('should return new shedule type day', (done) => {
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
      request(app)
        .post('/shedules')
        .set('Content-Type', 'application/json')
        .send(newSheduleDay)
        .end((erro, res) => {
          expect(res.status).toEqual(200)
          expect(Object.keys(res.body).sort()).toEqual(['id', 'type', 'day', 'intervals'].sort())
          expect(res.body.day).toEqual(newSheduleDay.day)
          expect(res.body.intervals[0].start).toEqual(newSheduleDay.intervals[0].start)
          done(erro)
        })
    })
    it('should return new shedule type weekly', (done) => {
      const newSheduleWeek = {
        type: 2,
        daysOfWeek: [0],
        intervals: [
          {
            start: '18:00',
            end: '19:00'
          }]
      }
      request(app)
        .post('/shedules')
        .set('Content-Type', 'application/json')
        .send(newSheduleWeek)
        .end((erro, res) => {
          expect(res.status).toEqual(200)
          expect(Object.keys(res.body).sort()).toEqual(['id', 'type', 'daysOfWeek', 'intervals'].sort())
          expect(res.body.daysOfWeek).toEqual(newSheduleWeek.daysOfWeek)
          expect(res.body.intervals[0].start).toEqual(newSheduleWeek.intervals[0].start)
          done(erro)
        })
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
      request(app)
        .post('/shedules')
        .set('Content-Type', 'application/json')
        .send(newSheduleDay)
        .end((erro, res) => {
          expect(res.status).toEqual(400)
          expect(res.text).toBe('Error: Can not register time shock')
          done(erro)
        })
    })
  })
  describe('DELETE /shedules/:id/delete', () => {
    it('should return success message', (done) => {
      request(app)
        .delete(`/shedules/${defaultShedules.shedules[0].id}/delete`)
        .set('Content-Type', 'application/json')
        .end((erro, res) => {
          expect(res.status).toEqual(200)
          expect(res.body).toBe('Schedule deleted successfully')
          done(erro)
        })
    })
    it('should return error "This schedule was not found"', (done) => {
      request(app)
        .delete(`/shedules/zyk987/delete`)
        .set('Content-Type', 'application/json')
        .end((erro, res) => {
          expect(res.status).toEqual(400)
          expect(res.text).toBe('Error: This schedule was not found')
          done(erro)
        })
    })
  })
  describe('GET /shedules/:start/:end', () => {
    it('should return intervals', (done) => {
      request(app)
        .get('/shedules/14-08-2019/16-08-2019')
        .set('Content-Type', 'application/json')
        .end((erro, res) => {
          expect(res.status).toEqual(200)
          expect(Object.keys(res.body[0]).sort()).toEqual(['day', 'intervals'].sort())
          expect(res.body[0].day).toEqual('14-08-2019')
          expect(res.body[0].intervals[0].start).toEqual('08:00')
          expect(res.body[2].day).toEqual('16-08-2019')
          expect(res.body[2].intervals[1].end).toEqual('17:00')
          done(erro)
        })
    })
    it('should return error "Start value must be before end.', (done) => {
      request(app)
        .get('/shedules/16-08-2019/14-08-2019')
        .set('Content-Type', 'application/json')
        .end((erro, res) => {
          expect(res.status).toEqual(400)
          expect(res.text).toEqual('Error: Start value must be before end.')
          done(erro)
        })
    })
  })
})
