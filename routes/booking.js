const express = require("express");
const router = express.Router();
const Booking = require("../schema/booking"); // Asumiendo que tu archivo de modelo se encuentra en "../models/Booking"

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    return res.json(bookings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener las reservas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      names,
      lastnames,
      gender,
      birthdate,
      documentType,
      documentNumber,
      email,
      number,
      asociateName,
      asociateNumber,
      hotel, 
      rooms,
      checkInDate, 
      checkOutDate, 
      numberOfPeople, 
      destinationCity   
    } = req.body;

    const booking = new Booking({
      names,
      lastnames,
      gender,
      birthdate,
      documentType,
      documentNumber,
      email,
      number,
      asociateName,
      asociateNumber,
      hotel: hotel, 
      rooms: rooms,
      checkInDate, 
      checkOutDate, 
      numberOfPeople, 
      destinationCity   
    });

    const bookingInfo = await booking.save();
    res.json(bookingInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

module.exports = router;
