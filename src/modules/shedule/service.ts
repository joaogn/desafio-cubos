import fs from 'fs'
import path from 'path'

const local = path.resolve(__dirname, '../../../database.json')

interface Interval {
    start: string,
    end: string,
  }

  interface SheduleData {
    id?: string, // UUID
    type: number, // 0 - Regra Dia Especifico /  1- Regra Diaria / 2- Regra Semanal
    day?: string,
    daysOfWeek?: number[],
    intervals: Interval[],
  }

  interface Shedules{
    shedules: SheduleData[]
  }

class Shedule {
  public getAll (): Promise<SheduleData[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(local, 'utf8', (error, data) => {
        if (error) return reject(Error('falha ao abri o arquivo'))
        const file:Shedules = data ? JSON.parse(data) : { shedules: [] }
        resolve(file.shedules)
      })
    })
  }
}

export default new Shedule()
