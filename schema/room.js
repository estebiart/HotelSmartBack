const Mongoose = require("mongoose");
const Schema = Mongoose.Schema; 

const roomSchema = new Schema({
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' }, 
    roomType: String,
    price: Number,
    capacity: Number,
    availability: Boolean
  });
  module.exports = Mongoose.model("Room", roomSchema);