import fs from 'fs'
import path from 'path'

const local = path.resolve(__dirname, '../../../database.json')

class Shedule {
  public getAll () {
    return new Promise((resolve, reject) => {
      fs.readFile(local, 'utf8', (error, data) => {
        if (error) return reject(Error('falha ao abri o arquivo'))
        const file = data ? JSON.parse(data) : { shedules: [] }
        resolve(file.shedules)
      })
    })
  }
}

export default new Shedule()
