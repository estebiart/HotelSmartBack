const express = require("express");
const router = express.Router();
const Hotel = require("../schema/hotel");
const multer = require("multer");
const path = require("path");

// Configurar multer para guardar las imágenes en el directorio "uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const items = await Hotel.find();
    return res.json(items);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error al obtener los hoteles" });
  }
});



router.post("/", upload.array("image", 5), async (req, res) => {

  try {
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => file.path);
    }


    const hotel = new Hotel({
      name: req.body.name,
      images: imagePaths, 
      place: req.body.place,
      address: req.body.address,
      description: req.body.description,
      availability:true
    });

    const hotelInfo = await hotel.save();
    res.json(hotelInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el hotel" });
  }
});

router.get("/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }
    return res.json(hotel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error fetching hotel information" });
  }
});

router.put("/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    console.log("hotelId ",hotelId )
    const updateFields = req.body; 
    console.log("updateFields ",updateFields )
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateFields, { new: true });
    console.log("updatedHotel ",updatedHotel)

    if (!updatedHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    return res.json(updatedHotel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error updating hotel information" });
  }
});

module.exports = router;
