const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// دروستکرنا پوشکێن هەلگرتنا فایلا
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

// ڕێکخستنا Multer بۆ Upload کرنا فایلا
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// داتابەیسەکا دەستپێکی (د ناو memory دا)
let apps = [];

// API: ئینانا هەمی بەرنامان
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// API: زێدەکرنا بەرنامەکێ نوو (لەگەڵ فایلا APK و وێنەی)
app.post('/api/apps', upload.fields([{ name: 'apk' }, { name: 'icon' }]), (req, res) => {
  const { name, description, version } = req.body;
  
  const newApp = {
    id: Date.now(),
    name,
    description,
    version,
    iconUrl: req.files['icon'] ? `/uploads/${req.files['icon'][0].filename}` : '',
    apkUrl: req.files['apk'] ? `/uploads/${req.files['apk'][0].filename}` : '',
    downloads: 0
  };

  apps.push(newApp);
  res.status(201).json({ message: 'App added successfully!', app: newApp });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});