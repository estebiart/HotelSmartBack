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

router.put("/api/hotels/:hotelId/rooms/:roomId", async (req, res) => {
  try {
      const { hotelId, roomId } = req.params;
      const updatedRoomData = req.body; 
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
          return res.status(404).json({ error: "Hotel not found" });
      }

      const room = await Room.findOne({ _id: roomId, hotel: hotelId });
      if (!room) {
          return res.status(404).json({ error: "Room not found" });
      }

      for (const key in updatedRoomData) {
          if (key !== "_id" && key !== "hotel") {
              room[key] = updatedRoomData[key];
          }
      }

      await room.save();

      return res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating room" });
  }
});
module.exports = router;
