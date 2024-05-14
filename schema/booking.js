const Mongoose = require("mongoose");
const Schema = Mongoose.Schema; 

const BookingSchema = new Mongoose.Schema({
  names: { type: String, required: true },
  lastnames: { type: String, required: true },
  birthdate: { type: String, required: true },
  gender: { type: String, required: true },
  documentType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  asociateName: { type: String, required: true },
  asociateNumber: { type: String, required: true },
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' }, 
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }]
});

module.exports = Mongoose.model("Booking", BookingSchema);