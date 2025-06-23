const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route to confirm API is running
app.get('/', (req, res) => {
  res.send('Video Overlay API is running.');
});

// Overlay route
app.post('/overlay', (req, res) => {
  const { videoUrl, overlayText, position } = req.body;

  // Basic validation
  if (!videoUrl || !overlayText) {
    return res.status(400).json({
      error: 'Missing required fields: videoUrl and overlayText.',
    });
  }

  // Placeholder for actual video overlay logic
  // Normally you'd call ffmpeg or a similar tool here
  console.log('Received request for overlay:');
  console.log('Video URL:', videoUrl);
  console.log('Overlay Text:', overlayText);
  console.log('Position:', position || 'default');

  // Simulate processing
  const outputUrl = 'https://example.com/processed-video.mp4'; // Replace with real processing output

  res.status(200).json({
    message: 'Overlay processing started successfully.',
    input: { videoUrl, overlayText, position },
    outputUrl,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
