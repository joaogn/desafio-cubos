# Desafio Cubos

## Roadmap

- ~~Criar Repo~~
- ~~Criar Partner do Projeto~~
- ~~Definir se vai usar lowDB ou fs~~
- ~~Criar Primeira rota getAll~~
- ~~Definir Estrutura dos Dados~~

  - ```
    interface Interval {
    start: string,
    end: string,
    }

    interface SheduleData {
        id?: string, //UUID
        type: number, // 0 - Regra Dia Especifico /  1- Regra Diaria / 2- Regra Semanal
        day?: string,
        daysOfWeek?: number[],
        intervals: Interval[],
    }

    interface Shedules{
        shedules: SheduleData[]
    }
    ```

- ~~Criar Yup Schema Para Validar Entrada~~
- ~~Criar Rotas~~
  - ~~Criar a rota add~~
  - ~~Criar a rota getByInterval~~
  - ~~Criar a rota delete~~
- Criar Testes
  - ~~Criar Test getAll~~
  - ~~Criar Test delete~~
  - Criar Test getByInterval
  - Criar Test add
- Fazer a Documentação

## Regras

### Regra Dia

```
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
    }]
 }
```

### Regra Diaria

```
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

### Regra Semanal

```
{
   "type": 2,
   "daysOfWeek": [1,2],
   "intervals": [
    {
        "start": "16:00",
        "end": "17:00"
    },
    {
        "start": "17:00",
        "end": "18:00"
    }]
}
```

# Processo Seletivo: Backend

Olá! Neste desáfio você deve criar uma API REST para facilitar o gerenciamento de horários de uma clínica! Sua API deve conter endpoints para satisfazer as seguintes features:

    - Cadastrar regras de horários para atendimento
    - Apagar regra de horário para atendimento
    - Listar regras de horários para atendimento
    - Listar horários disponíveis dentro de um intervalo

É importante notar que a API deve ser feita com Javascript (Node.js) **e os dados devem ser salvos em um arquivo JSON** (não sendo permitido o uso de banco de dados).

## Endpoints:

### Cadastro de regra de atendimento

O cadastro de regras de horário para atendimento deve possibilitar que se disponibilize intervalos de horário para consulta, possibilitando regras para:

    - Um dia especifico, por exemplo: estará disponível para atender dia 25/06/2018 nos intervalos de 9:30 até 10:20 e de 10:30 até as 11:00
    - Diáriamente, por exemplo: estará disponível para atender todos os dias das 9:30 até as 10:10
    - Semanalmente, por exemplo: estará disponível para atender todas segundas e quartas das 14:00 até as 14:30

### Apagar regra

Este metódo deve ser capaz de de apagar uma regra especifica criada pelo endpoint descrito em "Cadastro de regra de atendimento".

### Listar regras

O metódo de listar deve retornar as regras de atendimento criadas pelo endpoint descrito em "Cadastro de regra de atendimento".

### Horários disponíveis

Este endpoint deve retornar os horários disponíveis, baseado nas regras criadas anteriormente, considerando um intervalo de datas informadas na requisição.

O retorno deve seguir o formato exemplificado abaixo. Por exemplo, se o intervalo solicitado for 25-01-2018 e 29-01-2018 teremos o seguinte resultado:

```
[{
    day: "25-01-2018",
    intervals: [{ start: "14:30", end: "15:00" }, { start: "15:10", end: "15:30" }]
}, {
    day: "26-01-2018",
    intervals: [{ start: "14:30", end: "15:00" }, { start: "15:00", end: "15:30" }]
}, {
    day: "29-01-2018",
    intervals: [{ start: "10:40", end: "11:00" }, { start: "15:00", end: "15:30" }]
}]
```

As datas referentes ao intervalo devem estar no padrão: DD-MM-YYYY, por exemplo "25-11-2018".

**Atenção**: o exemplo de retorno acima NÃO está correlacionado com os exemplos de regras da seção "Cadastro de regra de atendimento".

## Se você fizer é um plus

    - Teste unitário
    - Typescript
    - Documentação
    - Validar cadastro de regras para evitar conflito de horários

## Entrega

Ao finalizar nos envie os seguintes itens:

    - Acesso ao repositório (se o repositório for privado, dar permissão de acesso para @backend.psel, se não, compartilhe o link do repositório)
    - Exemplo de requisição de criação de regra de atendimento para cada um dos 3 casos de exemplo listados na seção "Cadastro de regra de atendimento";
    - Exemplo de requisição de remoção de regra;
    - Exemplo de requisição de listagem de regras;
    - Exemplo de requisição de listagem de horários;

Os exemplos de requisição devem ser enviados na forma de uma Postman (https://www.getpostman.com/) collection, se possível, do contrário, cada exemplo deve conter: nome do endpoint, metódo HTTP referente à chamada e body.

É isso, vlws flws! :)
