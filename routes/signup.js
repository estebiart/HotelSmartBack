const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.post("/", async function (req, res, next) {
  const { username, password, name } = req.body;

  if (!username || !password || !name || username.length < 3 || password.length < 6 || name.length < 3) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Invalid request data. Username, password, and name are required with a minimum length of 3 characters for each."
      })
    );
  }

  try {

    const user = new User();
    const userExists = await user.usernameExists(username);    

    if (userExists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Username already exists"
        })
      );
    }

    const newUser = new User({ username, password, name });
    await newUser.save();

    res.status(201).json(
      jsonResponse(201, {
        message: "User created successfully"
      })
    );
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json(
      jsonResponse(500, {
        error: "Internal server error. Unable to create user."
      })
    );
  }
});

module.exports = router;
