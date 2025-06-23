const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const pdfParse = require('pdf-parse');

// Set this to the absolute path of your venv's Python
const pythonPath = path.join(__dirname, '../venv/bin/python');

function removeFileLater(filePath) {
  setTimeout(() => {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
  }, 3000);
}

exports.transcribeAudio = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio uploaded' });
  const audioPath = req.file.path;
  const scriptPath = path.join(__dirname, '../transcribe.py');
  console.log('Transcribe: using python at', pythonPath, 'with', scriptPath, audioPath);
  execFile(pythonPath, [scriptPath, audioPath], (err, stdout, stderr) => {
    removeFileLater(audioPath);
    if (err) {
      console.error('Transcription failed:', err, stderr);
      return res.status(500).json({ error: 'Transcription failed', details: stderr || err.message });
    }
    if (stderr) console.error('Python stderr:', stderr);
    res.json({ text: stdout.trim() });
  });
};

exports.captionImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  const imagePath = req.file.path;
  const scriptPath = path.join(__dirname, '../caption.py');
  console.log('Caption: using python at', pythonPath, 'with', scriptPath, imagePath);
  execFile(pythonPath, [scriptPath, imagePath], (err, stdout, stderr) => {
    removeFileLater(imagePath);
    if (err) {
      console.error('Image captioning failed:', err, stderr);
      return res.status(500).json({ error: 'Image captioning failed', details: stderr || err.message });
    }
    if (stderr) console.error('Python stderr:', stderr);
    res.json({ caption: stdout.trim() });
  });
};

exports.extractTextFromFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = req.file.path;
  try {
    let text = '';
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      text = data.text;
    } else if (req.file.mimetype.startsWith('text/')) {
      text = fs.readFileSync(filePath, 'utf8');
    } else {
      text = '[Unsupported file type]';
    }
    removeFileLater(filePath);
    res.json({ text: text.trim() });
  } catch (e) {
    removeFileLater(filePath);
    console.error('File extraction failed:', e);
    res.status(500).json({ error: 'File extraction failed', details: e.message });
  }
};