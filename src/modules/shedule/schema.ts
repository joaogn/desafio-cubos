import * as Yup from 'yup'
import moment from 'moment'

interface Interval {
    start: string,
    end: string,
  }

// cria um objeto Yup e fazendo as devidas verificaçãos e test para cada item
// e escreve a menssagem de erro para verificação.
export const getSchema = Yup.object().shape({
  startDate: Yup.string()
    .required('Day is required.')
    .test(
      'start day',
      'Invalid start day format.',
      // testa se o formato do dia está correto
      (value:string):boolean => (moment(value, 'DD-MM-YYYY', true).isValid())
    ),
  endDate: Yup.string()
    .required('Nescessario informar o dia')
    .test(
      'end day',
      'Invalid end day format',
      // testa se o formato do dia está correto
      (value:string):boolean => (moment(value, 'DD-MM-YYYY', true).isValid())
    )
}).test(
  'validation time',
  'Start value must be before end.',
  // testa se o dia inicial é menor ou igual que o final
  (value):boolean => (moment(value.startDate, 'DD-MM-YYYY').isSameOrBefore(moment(value.endDate, 'DD-MM-YYYY')))
)

// cria um objeto Yup e fazendo as devidas verificaçãos e test para cada item
// e escreve a menssagem de erro para verificação.
export const addSchema = Yup.object().shape({
  type: Yup.number()
    .required('Type is required.')
    .test(
      'type',
      'Value not allowed for type.',
      // testa se o type é um dos valores permitidos
      (value:number):boolean => (value === 0 || value === 1 || value === 2)
    ),
  day: Yup.string()
    // O When verifica qual o tipo e só valida a obrigação da variavel day se for do tipo 0
    .when('type', {
      is: 0,
      then: Yup.string()
        .required('Day is required.')
        .test(
          'day',
          'Invalid day format.',
          // testa se o formato do dia está correto
          (value:string):boolean => (moment(value, 'DD-MM-YYYY', true).isValid())
        ),
      // se for de qualquer outro tipo a variavel day não deve existir
      otherwise: Yup.string().test(
        'type error',
        'day is not allowed for this type.',
        // se value for igual a undefined é pq o daysOfWeek não foi passado
        // então ele passa pelo test do tipo, caso exista a variavel
        // ele retorna erro dizendo que daysOfWeek não é permitido
        // para esse tipo
        (value:number[]):boolean => value === undefined
      )
    }),
  daysOfWeek: Yup.array<number>()
    // O When verifica qual o tipo e só valida a obrigação da variavel daysOfWeek se for do tipo 2
    .when('type', {
      is: 2,
      then: Yup.array()
        // O of diz que tipo é o array no caso é de number
        .of(
          Yup.number()
            .min(0, 'Minimum allowed value is 0 within daysOfWeek.')
            .max(6, 'Maximum allowed value is 6 within daysOfWeek.')
        )
        .min(1, 'Must have at least one item in daysOfWeek.')
        .max(7, 'Must have a maximum of 7 items in daysOfWeek.')
        .test(
          'duplicate value',
          'Has duplicate value in daysOfWeek.',
          // o Set não permite valor repetidos, então se tiver valores repetidos
          // o retorno do Set sera menor que o valor do vetor passado
          (value:number[]):boolean => (new Set(value)).size === value.length
        )
        .required('daysOfWeek is required.'),
      // se for de qualquer outro tipo a variavel daysOfWeek não deve existir
      otherwise: Yup.array().test(
        'type error',
        'daysOfWeek is not allowed for this type.',
        // se value for igual a undefined é pq o daysOfWeek não foi passado
        // então ele passa pelo test do tipo, caso exista a variavel
        // ele retorna erro dizendo que daysOfWeek não é permitido
        // para esse tipo
        (value:number[]):boolean => value === undefined
      )
    }),
  intervals: Yup.array()
    // o of define o tipo do array, nesse caso um objeto com 2 string star e end
    .of(
      Yup.object({
        start: Yup.string()
          .required()
          .test(
            'start format',
            'Invalid start format.',
            // testa se o formato do start está correto
            (value:string):boolean => (moment(value, 'HH:mm', true).isValid())
          ),
        end: Yup.string()
          .required()
          .test(
            'end format',
            'Invalid end format.',
            // testa se o formato do end está correto
            (value:string):boolean => (moment(value, 'HH:mm', true).isValid())
          )
      }).test(
        'validation time',
        'Start hour must be before end.',
        // testa se o valor de start é menos que o de end
        (value:Interval):boolean => moment(value.start, 'HH:mm').isBefore(moment(value.end, 'HH:mm'))
      )
    )
    .min(1, 'Must have at least one item in intervals.')
    .test(
      'validation interval shock',
      'Time shock in the intervals',
      // Chama a função validateIntervals para verificar se choque nos intevalos passados
      (value:Interval[]):boolean => validateIntervals(value)
    )
    .required('Intervals is required.')
})

// essa função é um helpers para validar a lista de intervalos
// verifica se tem choque de horairo e retorna true ou false
function validateIntervals (intervals:Interval[]):boolean {
  let validFlag = true
  // verifica se tem mais de um item no vetor se tiver faz a comparação
  // se não tiver retorna a Flag inicial no caso True e informa que não tem
  // choque
  if (intervals.length > 1) {
  // faz o loop pelo vetor de intervalos e dentro desse loop faz outro loop pelo vetor intervalo
  // para comparar todos os valores de intervalos entre eles e testar se tem choque de horario
  // caso tenha choque de horario ele muda a flag para false e retorna a flag saindo do loop
  // com a flag false ele verifica se é falsó e sai do segundo loop retornando a flag
    intervals.every((firstInterval, firstIndex) => {
      if (!validFlag) return false
      intervals.every((secondInterval, secondIndex) => {
      // verifica se o  valor do index do primeiro
      // é diferente do segundo para não compara o mesmo item
        if (firstIndex !== secondIndex) {
        // transforma em moment e verifica se tem choque de horario
          const firstStart = moment(firstInterval.start, 'HH:mm')
          const firstEnd = moment(firstInterval.end, 'HH:mm')
          const secondStart = moment(secondInterval.start, 'HH:mm')
          const secondEnd = moment(secondInterval.end, 'HH:mm')
          if (
            (firstStart.isSame(secondStart) && firstEnd.isSame(secondEnd)) ||
          (firstStart.isBetween(secondStart, secondEnd) && !firstStart.isSame(secondEnd)) ||
          (secondStart.isBetween(firstStart, firstEnd)) ||
          (firstEnd.isBetween(secondStart, secondEnd) && !firstEnd.isSame(secondStart)) ||
          (secondEnd.isBetween(firstStart, firstEnd))
          ) {
            validFlag = false
            return validFlag
          }
          return true
        }
        return true
      })
      return validFlag
    })
    return validFlag
  } else {
    return validFlag
  }
}
