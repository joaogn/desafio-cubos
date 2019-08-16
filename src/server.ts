import app from './api/api'

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

app.listen(process.env.PORT)
console.log(`Server on Port ${process.env.PORT}`)
