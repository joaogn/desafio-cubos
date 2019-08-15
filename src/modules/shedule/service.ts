import fs from 'fs'
import path from 'path'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import { schema } from './schema'

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
      // Ler todo o arquivo e retorna
      fs.readFile(local, 'utf8', (error, data) => {
        if (error) return reject(Error('Something happened, try again later.'))
        const file:Shedules = data ? JSON.parse(data) : { shedules: [] }
        return resolve(file.shedules)
      })
    })
  }

  public add (data:SheduleData): Promise<SheduleData> {
  //  const validate = this.validateShedule
    let validFlag = true
    return new Promise((resolve, reject) => {
      // Faz a validação dos dados de entrada com o  schema se for valido faz a regra de negocio
      schema.validate(data).then((newShedule) => {
        fs.readFile(local, 'utf8', (error, data) => {
          if (error) return reject(Error('Something happened, try again later.'))
          const file:Shedules = data ? JSON.parse(data) : { shedules: [] }
          // faz o loop pelo vetor de regras se receber false retorna o erro altera a flag e sai do loop
          const { shedules } = file
          shedules.every(shedule => {
            // chama a função validade shedule, resposavel por verificar os typos e comparar os horarios
            if (!this.validateShedule(newShedule, shedule)) {
              reject(Error('Can not register time shock'))
              validFlag = false
              return validFlag
            } else {
              return true
            }
          })
          // se o flag não foi alterado (true), pega o regra a ser adicionada e adiciona
          // o objeto id passando um uuid e grava no arquivo
          if (validFlag) {
            const saveShedule = Object.assign(newShedule, { id: uuidv4() })
            shedules.push(saveShedule)
            fs.writeFile(local, JSON.stringify({ shedules }), (error) => {
              if (error) return reject(Error('Something happened, try again later.'))

              resolve(saveShedule)
            })
          }
        })
      }).catch(function (err) {
        // caso tenha acontecido um erro de validação retorna o Erro da Validação
        reject(Error(err.message))
      })
    })
  }

  private validateShedule (newShedule:SheduleData, oldShedule:SheduleData) {
    let validFlag = true
    // função de validar se tem choque de horario ele verifica o tipo das duas regras a velha e nova
    // e para cada combinação de regra ele compara os intervalos de acordo com a combinação nescessaria
    // para cada comparação ele salva o resutlado da comparação na flag para retornar no final
    if (oldShedule.type === 0) {
      if (newShedule.type === 0) {
        // se for regra dia com dia, ele verifica se as duas regras são no mesmo dia e compara o intervalo delas
        if (oldShedule.day === newShedule.day) {
          validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
          return validFlag
        }
      }
      // se for regra dia com diaria, ele compara os dois intervalos já que diaria serve para todos os dias
      if (newShedule.type === 1) {
        validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
        return validFlag
      }
      // se for regra dia com semanal ele vê se o dia da semana da data esta dentro do vetor de dias da semana
      // caso esteja ele compara os intervalos
      if (newShedule.type === 2) {
        if (newShedule.daysOfWeek.indexOf(moment(oldShedule.day, 'DD-MM-YYYY').weekday())) {
          validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
          return validFlag
        } else {
          return true
        }
      }
    }
    // para regra diaria indenpedente se a outra regra for dia, diaria ou semanal ele compara os intervalos
    // pq a regra diaria serve para todos os dias
    if (oldShedule.type === 1) {
      validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
      return validFlag
    }
    if (oldShedule.type === 2) {
      if (newShedule.type === 0) {
        // se for regra semanla com dia ele vê se o dia da semana da data esta dentro do vetor de dias da semana
        // caso esteja ele compara os intervalos
        if (oldShedule.daysOfWeek.indexOf(moment(newShedule.day, 'DD-MM-YYYY').weekday())) {
          validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
          return validFlag
        } else {
          return true
        }
      }
      // se for regra semanal com diaria, ele compara os dois intervalos já que a diaria serve para todos os dias
      if (newShedule.type === 1) {
        validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
        return validFlag
      }
      // se for regra semanal com semanal, ele faz um filtro no vetor do dia da semana
      // e para cada dia ele verifica se existe esse valor dentro do outro vetor caso exista
      // ele faz a comparação de intervalo
      if (newShedule.type === 2) {
        const filtredShedules = oldShedule.daysOfWeek.filter(day => newShedule.daysOfWeek.indexOf(day) >= 0)
        if (filtredShedules.length > 0) {
          validFlag = verifyIntervals(newShedule.intervals, oldShedule.intervals)
          return validFlag
        }
      }
    }
    return validFlag

    // Essa função é um Helper para a função de validar regras ela receber 2 vetores de intervalos
    // o vetor a ser cadastro e o vetor a ser comparado
    function verifyIntervals (newIntervals: Interval[], oldIntervals: Interval[]):boolean {
      let validFlag = true
      // faz um loop pelos horarios do vetor a ser cadastrado e para cada item desse vetor
      // faz um loop pelo vetor dos horarios a serem comparados e compara se teve choque de horario
      // caso tenha algum choque de horario ele muda a flag para falso e retorna falso saindo do loop 2
      // caso for falso ao retorna o falor do flag tb sai do loop 1
      newIntervals.every(newHour => {
        if (!validFlag) return false
        oldIntervals.every(oldHour => {
          // Passa os horarios para moment para comparar o choque de horario
          const newStart = moment(newHour.start, 'HH:mm')
          const newEnd = moment(newHour.end, 'HH:mm')
          const oldStart = moment(oldHour.start, 'HH:mm')
          const oldEnd = moment(oldHour.end, 'HH:mm')
          if (
            (newStart.isSame(oldStart) && newEnd.isSame(oldEnd)) ||
            (newStart.isBetween(oldStart, oldEnd) && !newStart.isSame(oldEnd)) ||
            (oldStart.isBetween(newStart, newEnd)) ||
            (newEnd.isBetween(oldStart, oldEnd) && !newEnd.isSame(oldStart)) ||
            (oldEnd.isBetween(newStart, newEnd))
          ) {
            validFlag = false
            return validFlag
          }
          return true
        })
      })
      return validFlag
    }
  }
}

export default new Shedule()
