const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema(
    {
        title: {
            type: String,
          },
        article: {
            type: String,
          },
        image: {
            type: String,
          },
        link:{
            type: String,
          }
    }
  );

const blogModel = mongoose.model('Blog', BlogSchema);

module.exports = blogModel;