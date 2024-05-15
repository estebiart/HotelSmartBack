const Mongoose = require("mongoose");
const Schema = Mongoose.Schema; 

const HotelSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }],
  place: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
  availability: Boolean
});

module.exports = Mongoose.model("Hotel", HotelSchema);