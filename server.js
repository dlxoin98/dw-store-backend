const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 داتایێن ئەپان (کۆگەها دەمکی)
let apps = [
  {
    id: "1710000000000",
    name: "DW Network Pro",
    description: "ئەپلیکەیشنا پشکنین و کۆنتڕۆڵکرنا خێرایا اینتەرنێتێ",
    version: "1.1.0",
    iconUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp",
    apkUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563247-app-debug.apk"
  }
];

// 📲 1. API - داتایێن ئەپان بۆ ئەندرۆیدێ (GET All Apps)
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// 🛠️ 2. API - زێدەکرنا ئەپەکا نوو ب ڕێکا JSON (POST)
app.post('/api/apps', (req, res) => {
  const newApp = {
    id: Date.now().toString(),
    name: req.body.name || "Untitled",
    description: req.body.description || "",
    version: req.body.version || "1.0.0",
    iconUrl: req.body.iconUrl || "",
    apkUrl: req.body.apkUrl || ""
  };
  apps.push(newApp);
  res.status(201).json({ message: "ئەپ بە سەرکەوتوویی زێدە بوو! 🎉", app: newApp });
});

// 🔄 3. API - دەستکاریکرنا ئەپەکێ ب ڕێکا ID (PUT)
app.put('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  const index = apps.findIndex(a => a.id === id);

  if (index !== -1) {
    apps[index] = { ...apps[index], ...req.body };
    res.json({ message: "ئەپ بە سەرکەوتوویی نوێ کرایەوە! 🔄", app: apps[index] });
  } else {
    res.status(404).json({ error: "ئەپ نەهاتە دیتن ❌" });
  }
});

// 🗑️ 4. API - سڕینا ئەپەکێ ب ڕێکا ID (DELETE)
app.delete('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = apps.length;
  apps = apps.filter(a => a.id !== id);

  if (apps.length < initialLength) {
    res.json({ message: "ئەپ ب سەرکەوتوویی هاتە سڕین! 🗑️" });
  } else {
    res.status(404).json({ error: "ئەپ نەهاتە دیتن ❌" });
  }
});

// 🌐 5. پشکا ئادمین پەنەل (Full Web Admin Panel: Add, Edit, Delete, View)
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ku" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DW Store - Admin Panel</title>
        <style>
            * { box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #121212; color: #fff; margin: 0; padding: 20px; }
            .main-wrapper { max-width: 900px; margin: auto; }
            h1, h2 { color: #4CAF50; text-align: center; }
            .card { background: #1e1e1e; padding: 25px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
            input, textarea { width: 100%; padding: 12px; margin: 8px 0 16px 0; background: #2c2c2c; border: 1px solid #444; color: #fff; border-radius: 6px; font-size: 14px; }
            button { background: #4CAF50; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: bold; width: 100%; transition: 0.2s; }
            button:hover { background: #45a049; }
            .btn-delete { background: #e53935; width: auto; padding: 6px 14px; font-size: 13px; margin-top: 5px; }
            .btn-delete:hover { background: #c62828; }
            .app-item { display: flex; align-items: center; justify-content: space-between; background: #2a2a2a; padding: 15px; border-radius: 8px; margin-bottom: 12px; }
            .app-info { display: flex; align-items: center; gap: 15px; }
            .app-icon { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; background: #333; }
        </style>
    </head>
    <body>
        <div class="main-wrapper">
            <h1>DW Store Developer Admin 🚀</h1>

            <!-- Form to Add New App -->
            <div class="card">
                <h2>➕ زێدەکرنا ئەپا نوو</h2>
                <form action="/admin/add" method="POST">
                    <label>ناڤێ ئەپێ:</label>
                    <input type="text" name="name" placeholder="م. App Name" required>
                    <label>پێناسە:</label>
                    <textarea name="description" placeholder="پێناسەیا کورتی یا ئەپی..." required></textarea>
                    <label>ڤێرژن:</label>
                    <input type="text" name="version" placeholder="1.0.0" required>
                    <label>لینکێ ئایکۆنی (Icon URL):</label>
                    <input type="text" name="iconUrl" placeholder="https://..." required>
                    <label>لینکێ فایلا APK (APK URL):</label>
                    <input type="text" name="apkUrl" placeholder="https://..." required>
                    <button type="submit">زیادکرنا ئەپێ ✨</button>
                </form>
            </div>

            <!-- List of Current Apps -->
            <div class="card">
                <h2>📱 لیستا ئەپێن ستۆرێ (${apps.length})</h2>
                ${apps.length === 0 ? '<p style="text-align:center; color: #888;">هیچ ئەپەک نەهاتییە زێدەکرن!</p>' : ''}
                ${apps.map(app => `
                    <div class="app-item">
                        <div class="app-info">
                            <img src="${app.iconUrl}" class="app-icon" alt="icon" onerror="this.src='https://via.placeholder.com/50';">
                            <div>
                                <strong>${app.name}</strong> <span style="color: #4CAF50; font-size: 12px;">v${app.version}</span>
                                <div style="color: #aaa; font-size: 13px;">${app.description}</div>
                            </div>
                        </div>
                        <form action="/admin/delete/${app.id}" method="POST" onsubmit="return confirm('تە دڤێت ڤێ ئەپێ بسڕی؟');">
                            <button type="submit" class="btn-delete">بسڕە 🗑️</button>
                        </form>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
  `);
});

// ➕ 6. Form Handler: Add App from Admin Form
app.post('/admin/add', (req, res) => {
  const { name, description, version, iconUrl, apkUrl } = req.body;
  apps.push({
    id: Date.now().toString(),
    name,
    description,
    version,
    iconUrl,
    apkUrl
  });
  res.send(`<script>alert('ئەپ بە سەرکەوتوویی زیاد بوو! 🎉'); window.location.href='/admin';</script>`);
});

// 🗑️ 7. Form Handler: Delete App from Admin Panel
app.post('/admin/delete/:id', (req, res) => {
  const { id } = req.params;
  apps = apps.filter(a => a.id !== id);
  res.send(`<script>alert('ئەپ هاتە سڕین! 🗑️'); window.location.href='/admin';</script>`);
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT} 🚀`);
});