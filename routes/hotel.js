const express = require("express");
const router = express.Router();
const Hotel = require("../schema/hotel");
const multer = require("multer");
const path = require("path");ç
const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);


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
      for (const file of req.files) {
        const blobName = Date.now() + path.extname(file.originalname);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype }
        });

        const imageUrl = blockBlobClient.url;
        imageUrls.push(imageUrl);
      }
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
