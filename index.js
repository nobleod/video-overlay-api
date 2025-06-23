const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send('Welcome to the Video Overlay API! Use POST /upload to upload a video.');
});

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const inputPath = path.join(__dirname, 'uploads', req.file.filename);
  const overlayPath = path.join(__dirname, 'overlay.png');
  const outputFilename = `output-${Date.now()}.mp4`;
  const outputPath = path.join(__dirname, outputFilename);

  const ffmpegCmd = `ffmpeg -i ${inputPath} -i ${overlayPath} -filter_complex "[0:v]scale=iw*min(1920/iw\\,1080/ih):ih*min(1920/iw\\,1080/ih),pad=1920:1080:(1920 - iw*min(1920/iw\\,1080/ih))/2:(1080 - ih*min(1920/iw\\,1080/ih))/2:black[vid];[vid][1:v]overlay=0:0" -c:v libx264 -preset veryfast -c:a copy ${outputPath}`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('FFmpeg error:', error);
      console.error('FFmpeg stderr:', stderr);
      return res.status(500).send('Processing failed');
    }

    res.download(outputPath, err => {
      // Delete files after response is finished or error
      fs.unlink(inputPath, unlinkErr => {
        if (unlinkErr) console.error('Error deleting input file:', unlinkErr);
      });
      fs.unlink(outputPath, unlinkErr => {
        if (unlinkErr) console.error('Error deleting output file:', unlinkErr);
      });

      if (err) {
        console.error('Error sending file:', err);
      }
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
