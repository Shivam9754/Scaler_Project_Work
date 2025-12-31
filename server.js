
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Controllers
const { upload, handleUpload } = require('./controllers/uploadController');
const { handleSearch } = require('./controllers/searchController');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists for local storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

/**
 * @route POST /api/upload
 * @desc Handles multipart/form-data for Docs, Audio, and Video files.
 */
app.post('/api/upload', upload.single('file'), handleUpload);

/**
 * @route POST /api/search
 * @desc Performs contextual deep search on a specific file using Gemini.
 */
app.post('/api/search', handleSearch);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'active', service: 'WorkLens-Intelligence-Engine' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    details: err.message 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WorkLens] Backend Protocol Active on Port ${PORT}`);
  console.log(`[WorkLens] Local Storage: ${uploadDir}`);
});
