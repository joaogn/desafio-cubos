# Desafio Cubos

## Api Para Agendamento

### **Overview**

Api para agendamento serve para agendar horários, sendo possível cadastrar um agendamento por: dia especifico, diária ou semanal, deletar o agendamento criado, consultar todos os agendamentos e também consultar por intervalo de dia

### **Features**

- Node.js
- TypeScript
- ESLint
- Jest

### **Quick start**

- Clonar Repositorio: `git clone git@github.com:joaogn/desafio-cubos.git`
- Instalar Depedencias: `yarn`
- Iniciar Server: `yarn start`
- Testes: `yarn test`
- Testes Windows: `yarn testwin`
- Develop: `yarn dev`

### **Database**

Os arquivos de dados são src/database.json e src/testDatabase.json (usado somente para testes)

### **Endpoints**

### Cadastrar regras de horário para atendimento

http://localhost:3333/shedules **POST**

**Dados Válidos**

```javascript
type: 0 - Regra Dia Especifico /  1- Regra Diária / 2- Regra Semanal
day: "DD-MM-YYY" // Apenas type: 0
daysOfWeek:[0,1,2,3,4,5,6] //0 a 6 sendo (Domingo a Sábado) Apenas type: 2
intervals [
    {
        "start": "HH:MM",
        "end": "HH:MM"
    }
]
// Verifica se tem itens em intervals e se não tem choque de horário nesses itens
```

**Regra Dia Especifico**

Esta regra cadastra intervalos de horários em um dia específico.

```json
{
  "type": 0,
  "day": "14-08-2019",
  "intervals": [
    {
      "start": "11:00",
      "end": "12:00"
    },
    {
      "start": "14:00",
      "end": "15:00"
    }
  ]
}
```

**Regra Diária**

Esta regra cadastra intervalos de horários para todos os dias

```json
{
  "type": 1,
  "intervals": [
    {
      "start": "08:00",
      "end": "09:00"
    }
  ]
}
```

**Regra Semanal**

Esta regra cadastra intervalos de horários para os dias da semana, passando os valores do dia da semana em daysOfWeek

```json
{
  "type": 2,
  "daysOfWeek": [1, 2],
  "intervals": [
    {
      "start": "16:00",
      "end": "17:00"
    },
    {
      "start": "17:00",
      "end": "18:00"
    }
  ]
}
```

**Dados de Retorno**

```json
{
  "type": 0,
  "day": "14-08-2019",
  "intervals": [
    {
      "start": "11:00",
      "end": "12:00"
    },
    {
      "start": "14:00",
      "end": "15:00"
    }
  ],
  "id": "7d86241a-cfbb-4307-a0f5-4fd211ae2125"
}
```

**Erros Retornados**

```json
 "Something happened, try again later." 400 Bad Request
 "Type is required." 400 Bad Request
 "daysOfWeek is required." 400 Bad Request
 "Intervals is required." 400 Bad Request
 "Value not allowed for type." 400 Bad Request
 "daysOfWeek is not allowed for this type." 400 Bad Request
 "day is not allowed for this type." 400 Bad Request
 "Invalid day format." 400 Bad Request
 "Start hour must be before end." 400 Bad Request
 "Invalid start format." 400 Bad Request
 "Invalid end format." 400 Bad Request
 "Maximum allowed value is 6 within daysOfWeek." 400 Bad Request
 "Minimum allowed value is 0 within daysOfWeek." 400 Bad Request
 "Must have at least one item in daysOfWeek." 400 Bad Request
 "Must have a maximum of 7 items in daysOfWeek." 400 Bad Request
 "Has duplicate value in daysOfWeek." 400 Bad Request
 "Must have at least one item in intervals." 400 Bad Request
 "Time shock in the intervals" 400 Bad Request
 "Can not register time shock" 400 Bad Request

```

### **Apagar regra de horário para atendimento**

http://localhost:3333/shedules/:id/delete **DELETE**

**Dados Válidos**

```javascript
id: "d922041b-99b1-4650-bf75-0f7f8f8e4eb3"; // id da regra cadastrada
```

**Dados de Retorno**

```json
"Schedule deleted successfully" 200 OK
```

**Erros Retornados**

```json
"Something happened, try again later." 400 Bad Request
"This schedule was not found" 400 Bad Request
"Dont have schedules to delete" 400 Bad Request
```

### **Listar regras de horários para atendimento**

http://localhost:3333/shedules **GET**

**Dados de Retorno**

```json
[
  {
    "type": 0,
    "day": "14-08-2019",
    "intervals": [
      {
        "start": "11:00",
        "end": "12:00"
      },
      {
        "start": "14:00",
        "end": "15:00"
      }
    ],
    "id": "2bc3edb2-59b7-4b1f-81e5-7dea1e602a30"
  },
  {
    "type": 1,
    "intervals": [
      {
        "start": "08:00",
        "end": "09:00"
      }
    ],
    "id": "7673d802-76f8-4f6b-974f-547e35d78995"
  },
  {
    "type": 2,
    "daysOfWeek": [1, 2],
    "intervals": [
      {
        "start": "16:00",
        "end": "17:00"
      },
      {
        "start": "17:00",
        "end": "18:00"
      }
    ],
    "id": "d174b9a9-42f7-4964-8c8f-6cb6042977c9"
  }
]
```

**Erros Retornados**

```json
"Something happened, try again later." 400 Bad Request
```

**Obs**

Caso não tenha nenhuma regra gravada retona o vetor vazio

### **Listar horários disponíveis dentro de um intervalo**

http://localhost:3333/shedules/:start/:end **GET**

**Dados Válidos**

```javascript
start: "DD-MM-YYYY";
end: "DD-MM-YYYY";
```

**Dados de Retorno**

```json
[
  {
    "day": "14-08-2019",
    "intervals": [
      {
        "start": "11:00",
        "end": "12:00"
      },
      {
        "start": "14:00",
        "end": "15:00"
      },
      {
        "start": "08:00",
        "end": "09:00"
      },
      {
        "start": "16:00",
        "end": "17:00"
      },
      {
        "start": "17:00",
        "end": "18:00"
      }
    ]
  },
  {
    "day": "15-08-2019",
    "intervals": [
      {
        "start": "08:00",
        "end": "09:00"
      },
      {
        "start": "16:00",
        "end": "17:00"
      },
      {
        "start": "17:00",
        "end": "18:00"
      }
    ]
  },
  {
    "day": "16-08-2019",
    "intervals": [
      {
        "start": "08:00",
        "end": "09:00"
      },
      {
        "start": "16:00",
        "end": "17:00"
      },
      {
        "start": "17:00",
        "end": "18:00"
      }
    ]
  }
]
```

**Erros Retornados**

```json
"Something happened, try again later." 400 Bad Request
"Start value must be before end." 400 Bad Request
"Invalid start day format." 400 Bad Request
"Invalid end day format" 400 Bad Request
```

**Obs**

Caso não tenha nenhuma regra gravada retona o vetor vazio

### **Collection Postman**

- src/desafio-cubos-collections
