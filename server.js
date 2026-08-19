import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Dynamic helper to find the user's uploaded CV in the cv folder
function getUploadedCvFile() {
  const cvDir = path.join(__dirname, 'cv');
  if (fs.existsSync(cvDir)) {
    const files = fs.readdirSync(cvDir).filter(f => !f.startsWith('.'));
    // Check if there is any PDF file
    const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));
    if (pdfFile) {
      return { path: path.join(cvDir, pdfFile), filename: pdfFile };
    }
    if (files.length > 0) {
      return { path: path.join(cvDir, files[0]), filename: files[0] };
    }
  }
  return null;
}

// Dedicated direct CV download route with attachment headers
app.get(['/download-cv', '/api/download-cv', '/cv/download'], (req, res) => {
  const cvInfo = getUploadedCvFile();
  if (cvInfo && fs.existsSync(cvInfo.path)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cvInfo.filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.download(cvInfo.path, cvInfo.filename);
  } else {
    res.status(404).send('No CV file found in the cv/ folder. Please upload your CV file to the cv/ directory.');
  }
});

// JSON API endpoint to provide CV data and base64 for guaranteed client-side download in sandboxed iframes
app.get('/api/cv-data', (req, res) => {
  const cvInfo = getUploadedCvFile();
  if (cvInfo && fs.existsSync(cvInfo.path)) {
    try {
      const fileBuffer = fs.readFileSync(cvInfo.path);
      const base64Data = fileBuffer.toString('base64');
      res.json({
        success: true,
        filename: cvInfo.filename,
        size: fileBuffer.length,
        base64: base64Data,
        mimeType: 'application/pdf',
        downloadUrl: '/download-cv',
        viewUrl: `/cv/${cvInfo.filename}`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(404).json({ success: false, error: 'CV file not found' });
  }
});

// Explicit CV route handler for inline PDF previewing in browsers and iframes
app.get('/cv/:filename', (req, res) => {
  const requestedPath = path.join(__dirname, 'cv', req.params.filename);
  if (fs.existsSync(requestedPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
    res.sendFile(requestedPath);
  } else {
    const cvInfo = getUploadedCvFile();
    if (cvInfo && fs.existsSync(cvInfo.path)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${cvInfo.filename}"`);
      res.sendFile(cvInfo.path);
    } else {
      res.status(404).send('CV file not found');
    }
  }
});

// Static file serving
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// Fallback to index.html for root or SPA routing
app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
