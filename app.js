const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
const log = require("./lib/trace");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/signout", require("./routes/signout"));

app.use("/", require("./routes/room"));
app.use("/api/refresh-token", require("./routes/refreshToken"));

app.use("/api/hotels", require("./routes/hotel"));
app.use("/api/booking", require("./routes/booking"));

app.use(authenticateToken);
app.use("/api/user", require("./routes/user"));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
