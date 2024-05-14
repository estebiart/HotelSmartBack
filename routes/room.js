const express = require("express");
const router = express.Router();
const Hotel = require("../schema/hotel");
const Room = require("../schema/room");

router.get("/api/hotels/:hotelId/rooms", async (req, res) => {
    try {
      const { hotelId} = req.params; 
      const items = await Room.find({ hotel: hotelId });
      return res.json(items);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al obtener los hoteles" });
    }
  });

router.post("/api/hotels/:hotelId/rooms", async (req, res) => {
  try {

    const { hotelId, roomsData } = req.body; 
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    for (const roomData of roomsData) {
        const newRoom = new Room({ ...roomData, hotel: hotelId, availability:true });
        await newRoom.save();
        hotel.rooms.push(newRoom);
      }

    await hotel.save();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating room" });
  }
});

module.exports = router;
