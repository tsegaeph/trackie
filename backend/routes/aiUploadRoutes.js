const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const aiUploadController = require('../controllers/aiUploadController');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/voice', upload.single('audio'), aiUploadController.transcribeAudio);
router.post('/image', upload.single('image'), aiUploadController.captionImage);
router.post('/file', upload.single('file'), aiUploadController.extractTextFromFile);

module.exports = router;