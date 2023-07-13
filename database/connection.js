const mongoose = require("mongoose")

const connection =  async() => {
  try {
    await mongoose.connect("mongodb+srv://FernandoMG81:fulBeuhSfxeTD5st@cluster0.olmy4yl.mongodb.net/mi_blog?retryWrites=true&w=majority")

    console.log("Conectado correctamente a la base de datos")
  } catch (error) {
    console.log(error)
    throw new Error("No se ha podido conectar a la base de datos")
  }
}

module.exports = {
  connection
}