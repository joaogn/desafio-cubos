"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const moment_1 = __importDefault(require("moment"));
// cria um objeto Yup e fazendo as devidas verificaçãos e test para cada item
// e escreve a menssagem de erro para verificação.
exports.schema = Yup.object().shape({
    type: Yup.number()
        .required('Type is required.')
        .test('type', 'Value not allowed for type.', 
    // testa se o type é um dos valores permitidos
    (value) => (value === 0 || value === 1 || value === 2)),
    day: Yup.string()
        // O When verifica qual o tipo e só valida a obrigação da variavel day se for do tipo 0
        .when('type', {
        is: 0,
        then: Yup.string()
            .required('Day is required.')
            .test('day', 'Invalid day format.', 
        // testa se o formato do dia está correto
        (value) => (moment_1.default(value, 'DD-MM-YYYY', true).isValid())),
        otherwise: Yup.string().notRequired()
    }),
    daysOfWeek: Yup.array()
        // O When verifica qual o tipo e só valida a obrigação da variavel daysOfWeek se for do tipo 1
        .when('type', {
        is: 1,
        then: Yup.array()
            // O of diz que tipo é o array no caso é de number
            .of(Yup.number()
            .min(0, 'Minimum allowed value is 0 within daysOfWeek.')
            .max(6, 'Maximum allowed value is 6 within daysOfWeek.'))
            .min(1, 'Must have at least one item in daysOfWeek.')
            .max(7, 'Must have a maximum of 7 items in daysOfWeek.')
            .test('duplicate value', 'Has duplicate value in daysOfWeek.', 
        // o Set não permite valor repetidos, então se tiver valores repetidos
        // o retorno do Set sera menor que o valor do vetor passado
        (value) => (new Set(value)).size === value.length)
            .required('daysOfWeek is required.'),
        otherwise: Yup.array().notRequired()
    }),
    intervals: Yup.array()
        // o of define o tipo do array, nesse caso um objeto com 2 string star e end
        .of(Yup.object({
        start: Yup.string()
            .required()
            .test('start format', 'Invalid start format.', 
        // testa se o formato do start está correto
        (value) => (moment_1.default(value, 'HH:mm', true).isValid())),
        end: Yup.string()
            .required()
            .test('end format', 'Invalid end format.', 
        // testa se o formato do end está correto
        (value) => (moment_1.default(value, 'HH:mm', true).isValid()))
    }).test('validation time', 'Start value must be before end.', 
    // testa se o valor de start é menos que o de end
    (value) => moment_1.default(value.start, 'HH:mm').isBefore(moment_1.default(value.end, 'HH:mm'))))
        .required('Intervals is required.')
});
//# sourceMappingURL=schema.js.map