import fs from 'fs'
import path from 'path'
import moment from 'moment'
import uuidv4 from 'uuid/v4'
import { addSchema, getSchema } from './schema'

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const local = path.resolve(__dirname, '../../../', process.env.DB_STORAGE)

interface Interval {
    start: string,
    end: string,
  }

  interface SheduleData {
    id?: string, // UUID
    type?: number, // 0 - Regra Dia Especifico /  1- Regra Diaria / 2- Regra Semanal
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
    let validFlag = true
    return new Promise((resolve, reject) => {
      // Faz a validação dos dados de entrada com o  schema se for valido faz a regra de negocio
      addSchema.validate(data).then((newShedule) => {
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

        // contorna as issues https://github.com/jquense/yup/issues/256 , https://github.com/jquense/yup/issues/602
        if (err.message === `Cannot read property 'length' of undefined`) {
          return reject(Error('daysOfWeek is required or Intervals is required'))
        } else {
          return reject(Error(err.message))
        }
      })
    })
  }

  public getByInterval (startDate:string, endDate:string): Promise<SheduleData[]> {
    let response: SheduleData[] = []
    return new Promise((resolve, reject) => {
      // faz a validações dos dados pelo schema se valido faz a regra de negocio
      getSchema.validate({ startDate, endDate }).then((dateInterval) => {
        fs.readFile(local, 'utf8', (error, data) => {
          if (error) return reject(Error('Something happened, try again later.'))
          const file:Shedules = data ? JSON.parse(data) : { shedules: [] }
          const { shedules } = file
          // passa os dias passados para o momente
          const momentStartDate = moment(dateInterval.startDate, 'DD-MM-YYYY')
          const momentEndDate = moment(dateInterval.endDate, 'DD-MM-YYYY')
          // cria uma variavel moment para ser adicionado cada dia no loop e usar na comparação
          const variableMoment = momentStartDate
          // calcula a diferença em dias para realizar um loop por cada dia
          const diffDays = momentEndDate.diff(momentStartDate, 'days')
          for (let i = 0; i <= diffDays; i++) {
            // para cada dia faz um for por pelas regras cadastradas
            // e faz comparações para saber se aquela regra pertence
            // ao dia passado
            shedules.map(shedule => {
              if (shedule.type === 0) {
                // para a regra dia verifica se é o mesmo dia
                if (moment(shedule.day, 'DD-MM-YYYY').format('DD-MM-YYYY') === variableMoment.format('DD-MM-YYYY')) {
                  response = this.insertDayInVetor({ day: variableMoment.format('DD-MM-YYYY'), intervals: shedule.intervals }, response)
                }
              }
              if (shedule.type === 1) {
                // para a regra diaria não faz verificação pois serve para todos os dias
                response = this.insertDayInVetor({ day: variableMoment.format('DD-MM-YYYY'), intervals: shedule.intervals }, response)
              }
              if (shedule.type === 2) {
                // para a regra semanal verifica se o dia da semana passada esta dentro do vetor daysOfWeek
                if (shedule.daysOfWeek.indexOf(moment(shedule.day, 'DD-MM-YYYY').weekday())) {
                  response = this.insertDayInVetor({ day: variableMoment.format('DD-MM-YYYY'), intervals: shedule.intervals }, response)
                }
              }
            })
            // adiciona um dia ao final do loop
            variableMoment.add(1, 'days')
          }
          // retorna o vetor response com os dados caso encontre, se não encontrar retorna vazio
          return resolve(response)
        })
      }).catch(function (err) {
        // retorna o erro da validação caso não passe no teste de validação
        return reject(Error(err.message))
      })
    })
  }

  public delete (id:string): Promise<string> {
    let deletedFlag = false
    return new Promise((resolve, reject) => {
      fs.readFile(local, 'utf8', (err, data) => {
        if (err) return reject(Error('Something happened, try again later.'))

        const file:Shedules = data ? JSON.parse(data) : { shedules: [] }
        const { shedules } = file
        // verifica se existe ao menos uma regra cadastrada se não tiver envia o erro
        if (shedules.length === 0) return reject(Error('Dont have schedules to delete'))
        // faz um filtro pelas regras  caso o id da regra e o id
        // passado para deletar for igual retorna falso, então
        // elemina esse item do vetor filtrado, caso o item for
        // deletado ele altera a flag
        const filtredShedules = shedules.filter((shedule) => {
          if (shedule.id === id) {
            deletedFlag = true
            return false
          } else {
            return true
          }
        })
        // caso a flag tenha sido alterada ele retorna grava o vetor filtrado
        // e retorna uma mensagem de sucesso
        if (deletedFlag) {
          fs.writeFile(local, JSON.stringify({ shedules: filtredShedules }), (error) => {
            if (error) return reject(Error('Something happened, try again later.'))

            return resolve('Schedule deleted successfully')
          })
        } else {
          // caso a flag não tenha sido alterada ele acusa erro
          // informando que não achou essa regra
          return reject(Error('This schedule was not found'))
        }
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
        if (newShedule.daysOfWeek.indexOf(moment(oldShedule.day, 'DD-MM-YYYY').weekday()) >= 0) {
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
        if (oldShedule.daysOfWeek.indexOf(moment(newShedule.day, 'DD-MM-YYYY').weekday()) >= 0) {
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

    // Essa função é um Helper para a função de validar regras ela receber 2 vetores de intervalos
    // o vetor a ser cadastro e o vetor a ser comparado
    function verifyIntervals (newIntervals: Interval[], oldIntervals: Interval[]):boolean {
      let validFlag = true
      // faz um loop pelos horarios do vetor a ser cadastrado e para cada item desse vetor
      // faz um loop pelo vetor dos horarios a serem comparados e compara se teve choque de horario
      // caso tenha algum choque de horario ele muda a flag para falso e retorna falso saindo do loop 2
      // caso for falso ao retorna o falor do flag tb sai do loop 1
      newIntervals.every(newHour => {
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
            (newEnd.isBetween(oldStart, oldEnd)) ||
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

  // essa função é um helper para o getIntervals, ele recebe um vetor com o dia
  // e os intervalos cadastrados e um objeto com o dia e os inteervalos a serem
  // adicionado, verifica se já existe dia no vetor e concatena com o intervals
  // do dia que já esta no vetor, caso não tenha o dia insere o novo dia
  private insertDayInVetor (newShedule:SheduleData, shedules:SheduleData[]) {
    let addFlag = false
    // verifica se tem ao menos um item no vetor
    // para fazer o teste e incluir o intervalo
    if (shedules.length > 0) {
      shedules.map((shedule, index) => {
        if (shedule.day === newShedule.day) {
          // caso seja o mesmo dia altera o flag
          // e concatena os vetores de intervalo
          addFlag = true
          shedules[index].intervals = shedule.intervals.concat(newShedule.intervals)
        }
      })
    } else {
      // caso não tenha nenhum dado no vetor adiciona
      // o novo objeto no vetor e muda a flag
      addFlag = true
      shedules.push(newShedule)
    }

    // caso não adicionou o novo objeto adiciona
    !addFlag && shedules.push(newShedule)

    return shedules
  }
}

export default new Shedule()
