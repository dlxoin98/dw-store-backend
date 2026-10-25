const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// لیستا ئەپان (بۆ نموونە)
let apps = [
  {
    name: "DW Network Pro ",
    description: "ئەپلیکەیشنا پشکنین و کۆنتڕۆڵکرنا خێرایا اینتەرنێتێ",
    version: "1.1.0",
    iconUrl: "https://github.com/dlxoin98/dw-store-backend/blob/main/uploads/1792442563239-ic_launcher_foreground.webp",
    apkUrl: "https://github.com/dlxoin98/dw-store-backend/blob/main/uploads/1792442563247-app-debug.apk"
  }
];

// ١. ڕێڕەوا موبایلێ (داتایێ ددەتە ئەپلیکەیشنا ئەندرۆید)
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// ٢. پشکا ادمین (Admin Panel HTML) - فۆرمەک بۆ زێدەکرنا ئەپان
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ku" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>DW Store - Admin Panel</title>
        <style>
            body { font-family: Arial, sans-serif; background: #121212; color: #fff; padding: 40px; }
            .container { max-width: 500px; margin: auto; background: #1e1e1e; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
            input, textarea { width: 100%; padding: 10px; margin: 10px 0; background: #2c2c2c; border: 1px solid #444; color: #fff; border-radius: 5px; }
            button { background: #4CAF50; color: white; border: none; padding: 10px 20px; width: 100%; border-radius: 5px; cursor: pointer; font-size: 16px; }
            button:hover { background: #45a049; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>پشکا ادمین - زێدەکرنا ئەپا نوو</h2>
            <form action="/admin/add" method="POST">
                <label>ناڤێ ئەپێ:</label>
                <input type="text" name="name" required>
                <label>پێناسە:</label>
                <textarea name="description" required></textarea>
                <label>ڤێرژن:</label>
                <input type="text" name="version" required>
                <label>لينکا وێنەیێ (Icon URL):</label>
                <input type="text" name="iconUrl" required>
                <label>لينکا فایلا APK (APK URL):</label>
                <input type="text" name="apkUrl" required>
                <button type="submit">زیادکرنا ئەپێ</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

// ٣. وەرگرتنا زانیارییێن ئەپا نوو و زێدەکرنا وێ بۆ لیستێ
app.post('/admin/add', (req, res) => {
  const { name, description, version, iconUrl, apkUrl } = req.body;
  apps.push({ name, description, version, iconUrl, apkUrl });
  res.send(`<script>alert('ئەپ بە سەرکەوتوویی زیاد بوو!'); window.location.href='/admin';</script>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});