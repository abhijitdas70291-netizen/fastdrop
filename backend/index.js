const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3({
  endpoint: process.env.CLOUDSPACE_ENDPOINT,
  accessKeyId: process.env.CLOUDSPACE_KEY,
  secretAccessKey: process.env.CLOUDSPACE_SECRET,
  s3ForcePathStyle: true
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const name = Date.now() + "_" + req.file.originalname;

    await s3.putObject({
      Bucket: process.env.CLOUDSPACE_BUCKET,
      Key: name,
      Body: req.file.buffer
    }).promise();

    res.json({ success: true, file: name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log("FastDrop backend running"));
