const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const AuthRouter = require('./Routes/AuthRouter');
const UserModel = require('./Models/User');
const authenticateJWT = require('./Middlewares/authenticateJWT'); // Import middleware
const axios = require('axios');


require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/auth', AuthRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");  // Ensure this path is correct
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route for uploading images
app.post("/upload-image", authenticateJWT, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageName = req.file.filename;
  console.log(`User ID: ${req.user._id}`);
  console.log(`Image Name: ${imageName}`);

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.images.push(imageName);
    await user.save();
    res.json({ status: "ok" });
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ status: "error", error });
  }
});

// Route for fetching images
// app.get("/get-image", authenticateJWT, async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.send({ status: "ok", data: user.images });
//   } catch (error) {
//     console.error(`Error: ${error}`);
//     res.status(500).json({ status: "error", error });
//   }
// });

app.get("/get-image", authenticateJWT, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imageUrls = user.images.map(image => `${req.protocol}://${req.get('host')}/images/${image}`);

    res.send({ status: "ok", data: imageUrls });
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ status: "error", error });
  }
});


// Route for downloading images
app.get("/download-image/:filename", authenticateJWT, (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "./images/", filename);
  console.log(`Filepath: ${filepath}`); // Add log to see the path being accessed

  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

// Route for deleting images
app.delete("/delete-image/:filename", authenticateJWT, async (req, res) => {
  const filename = req.params.filename;

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imageIndex = user.images.indexOf(filename);
    if (imageIndex > -1) {
      user.images.splice(imageIndex, 1);
      await user.save();

      // Delete the image file from the server
      const filepath = path.join(__dirname, "./images/s", filename);
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error(`Error deleting image file: ${err}`);
        }
      });

      res.json({ status: "ok", message: "Image deleted successfully." });
    } else {
      res.status(403).json({ message: "Not authorized to delete this image" });
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ status: "error", error });
  }
});


app.get('/download', async (req, res) => {
  const fileUrl = req.query.url;
  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream'
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
