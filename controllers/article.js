const Article = require("../models/Article")
const { validateArticle } = require("../helpers/validate")
const fs = require("fs").promises
const path = require("path")

const test = (req, res) => {
  return res.status(200).json({
    message: 'Hello World'
  })
}

const create = (req, res) => {

  // Recoger parametros por post a guardar
  let parameters = req.body

  // Validar datos
  try {
   validateArticle(parameters)
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar"
    })
  }

  // Crear el objeto a guardar
  const article = new Article(parameters)

  // Asignar valores a objeto basado en el modelo (manual o automatico)
  //article.title = parameters.title

  // Guardar el articulo en la base de datos
  article.save()

  return res.status(200).json({
    mensaje: "Success",
    content: article
  })
}

const getArticles = async (req, res) => {
  try {
    
    let query = await Article.find({})
    if(req.params.last){
      query = await Article.find({}).limit(2)
    }

    if(query){
      return res.status(200).send({
        status: "success",
        articles: query
      })
    }
  } catch (error) {
    return res.status(404).json({
      status: "error",
      messaje: "No se han encontrado articulos"
    })
  }
  
}

const getArticleByID = async(req, res) => {
  let id = req.params.id
  try {
    const item = await Article.findById(id).exec()

    return res.status(200).json({
      message:'Artículo obtenido correctamente',
      item
    })
  } catch (error) {
   return res.status(400).json({
    error:"Error al obtener el artículo."
   })
  }
  
}
  
const deleteArticle = async(req, res) => {

  let article_id = req.params.id
  console.log(article_id)
  try {
    let item = await Article.findOneAndDelete({ _id: article_id })
    
    if (!article_id || !item){
      throw new Error("No se encuentra el articulo")
    }
    return res.status(200).json({
      status: "success",
      message: "Se ha eliminado correctamente un articulo"+ article_id
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al borrar el articulo"
    })
  }
}
  
const editArticle = (req, res) => {
  let articleId = req.params.id

  let parameters = req.body

  try {
    validateArticle(parameters)
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "Faltan datos por enviar"
    })
  }


  Article.findOneAndUpdate({ _id: articleId}, parameters, { new: true})
  .then(item => {
    if(!item) {
      return res.status(500).json({
        status: error,
        mensaje: "No se encuentra el articulo"
      }) 
    }

    return res.status(202).json({
      status:'success',
      message:"Se ha actualizado el articulo"+ item
    })
  })
  .catch(error => {
    return res.status(400).json({
      status: error,
      mensaje: "No se pudo actualizar el articulo"
    }) 
  })
}

const upload = (req, res) => {

const file = req.file.originalname
const fileSplit = file.split("\.")
const extension = fileSplit[1]

if(!['png','jpg', 'jpeg', 'gif'].includes(extension)){
  fs.unlink(req.file.path).then(() => {
    return res.status(500).json({
      status: 500,
      message: `Extension ${extension}, no es valida`
    })
  })
}
 else
{

  let articleId = req.params.id

  Article.findOneAndUpdate({ _id: articleId}, {image: req.file.filename }, { new: true})
  .then(item => {
    if(!item) {
      return res.status(500).json({
        status: error,
        mensaje: "No se encuentra el articulo"
      }) 
    }

    return res.status(202).json({
      status:'success',
      message:"Se ha actualizado el articulo"+ item
    })
  })
  .catch(error => {
    return res.status(400).json({
      status: error,
      mensaje: "No se pudo actualizar el articulo"
    }) 
  })



  return res.status(200).json({
    status: 'success',
    fileSplit,
    file: req.file
  })
}
}

const getImage = (req, res) => {
  const file = req.params.file
  const filePath = `./images/articles/${file}`

  fs.stat(filePath)
  .then(
    () => res.sendFile(path.resolve(filePath))
  ).catch(error => {
    return res.status(404).json({
      status: "error",
      message: "La imagen no existe"
    })
  })
}

const search = async(req, res) => {
  const search = req.params.search

  try {
    let articles = await Article.find({"$or": [
      {"title": {"$regex": search, "$options": "i"}},
      {"content": {"$regex": search, "$options": "i"}}
    ]})
    .sort({fecha: -1})

    if(articles.length === 0 ) throw new Error("No se han encontrado articulos")

    res.status(200).json({
      status: "Success",
      articles
    })
  } catch (error) {
    return res.status(404).json({
      status: "error",
      messaje: "No se han encontrado articulos"
    })
  }

}

module.exports = {
  test, 
  create,
  getArticles,
  getArticleByID,
  deleteArticle,
  editArticle,
  upload,
  getImage, 
  search
}