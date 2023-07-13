const { connection } = require("./database/connection")
const express = require("express")
const cors = require("cors")

console.log("test OK")

// Conectar a la base de datos
connection()

// Crear servidor Node
const app = express()
const puerto = 3900

// Configurar cors
app.use(cors())

// Convertir body a objeto js
app.use(express.json()) // Recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})) // form-urlencoded

// Rutas
const routes_articles = require("./routes/article")

app.use("/api", routes_articles)

// Crear rutas
app.get('/probando', (req, res) => {
  const data = [
    {"id":1,"name":"John","age":25},
    {"id":2,"name":"Jane","age":34}
    ]
    return res.status(200).send({data
      })
})

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puesto ${puerto}`)
})