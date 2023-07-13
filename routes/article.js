const express = require("express")
const router = express.Router()
const multer = require("multer")

const ArticleController = require("../controllers/article")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/articles')
  },
  filename: (req, file, cb) => {
    cb(null, `article${Date.now()}${file.originalname}`)
  }
})

const uploads = multer({ storage })

// Rutas de pruebas
router.get("/test", ArticleController.test)

router.post("/create", ArticleController.create)
router.get("/articles/:last?", ArticleController.getArticles)
router.get("/article/:id", ArticleController.getArticleByID)
router.delete("/article/:id", ArticleController.deleteArticle)
router.put("/article/:id", ArticleController.editArticle)
router.post("/upload-image/:id",[uploads.single('file0')], ArticleController.upload)
router.get("/image/:file", ArticleController.getImage)
router.get("/search/:search", ArticleController.search)



module.exports = router