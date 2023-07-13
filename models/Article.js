const { Schema, model } = require("mongoose")

const ArticleSchema = Schema({
  title: {
    type:String,
    required:[true,"Please enter a valid Title"]
  },
  content: {
    type:String,
    required:[true,'Content is Required']
  },
  date: {
    type: Date,
    default :Date.now()
  },
  image: {
    type: String,
    default: "default.png"
  }

})

module.exports = model("Article", ArticleSchema)