const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({

  action:String,

  category:String,

  type:String,

  name:String,

  quantity:Number,

  location:String,

  remarks:String,

  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model(
  "Material",
  materialSchema
);