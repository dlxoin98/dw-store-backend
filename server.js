const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Helper to format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 📦 Apps Database
let apps = [
  {
    id: "1710000000000",
    name: "DW Network Pro",
    description: "ئەپلیکەیشنا پشکنین و کۆنتڕۆڵکرنا خێرایا اینتەرنێتێ.",
    version: "1.1.0",
    size: "15.4 MB",
    downloadsCount: "0",
    iconUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp",
    apkUrl: "https://example.com/app.apk",
    screenshots: []
  }
];

// 📲 1. Android API
app.get('/api/apps', (req, res) => res.json(apps));

// 🌐 2. Admin Panel UI (Add, Edit, Delete)
app.get('/admin', (req, res) => {
  const editId = req.query.edit;
  const appToEdit = apps.find(a => a.id === editId);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>DW Store Admin Portal</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            body { background: #0f172a; color: #f8fafc; padding: 30px; }
            .container { max-width: 900px; margin: auto; }
            h1, h2 { color: #38bdf8; margin-bottom: 20px; }
            .card { background: #1e293b; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #334155; }
            input, textarea { width: 100%; padding: 12px; margin: 8px 0 16px 0; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 8px; }
            button { background: #0284c7; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; }
            button:hover { background: #0369a1; }
            .btn-danger { background: #ef4444; width: auto; padding: 6px 12px; font-size: 13px; }
            .btn-edit { background: #eab308; color: #000; width: auto; padding: 6px 12px; font-size: 13px; text-decoration: none; display: inline-block; border-radius: 6px; font-weight: bold; }
            .app-item { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #334155; }
            .file-input { background: #1e293b; padding: 10px; border: 1px dashed #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>DW Store Developer Portal 🚀</h1>

            <!-- Add or Edit Form -->
            <div class="card">
                <h2>${appToEdit ? '✏️ Edit App: ' + appToEdit.name : '➕ Upload New App'}</h2>
                <form action="${appToEdit ? '/admin/edit/' + appToEdit.id : '/admin/add'}" method="POST" enctype="multipart/form-data">
                    <label>App Name:</label>
                    <input type="text" name="name" value="${appToEdit ? appToEdit.name : ''}" required>
                    
                    <label>Version:</label>
                    <input type="text" name="version" value="${appToEdit ? appToEdit.version : '1.0.0'}" required>
                    
                    <label>Description:</label>
                    <textarea name="description" required>${appToEdit ? appToEdit.description : ''}</textarea>
                    
                    <label>Icon URL:</label>
                    <input type="text" name="iconUrl" value="${appToEdit ? appToEdit.iconUrl : ''}" required>

                    <label>Upload APK File (Auto-calculates real size):</label>
                    <input type="file" name="apkFile" class="file-input" ${appToEdit ? '' : 'required'}>

                    <button type="submit">${appToEdit ? 'Update App 🔄' : 'Publish App 🚀'}</button>
                    ${appToEdit ? '<br><br><a href="/admin" style="color: #94a3b8; text-align:center; display:block;">Cancel Edit</a>' : ''}
                </form>
            </div>

            <!-- Managed Apps List -->
            <h2>📱 Managed Apps (${apps.length})</h2>
            <div class="card">
                ${apps.map(app => `
                    <div class="app-item">
                        <div>
                            <strong>${app.name}</strong> <span style="color:#38bdf8;">v${app.version}</span> (${app.size})
                            <div style="color:#64748b; font-size:13px;">${app.description}</div>
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <a href="/admin?edit=${app.id}" class="btn-edit">Edit ✏️</a>
                            <form action="/admin/delete/${app.id}" method="POST" onsubmit="return confirm('Delete this app?');" style="margin:0;">
                                <button type="submit" class="btn-danger">Delete 🗑️</button>
                            </form>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </body>
    </html>
  `);
});

// ➕ 3. Add App (Calculates real file size automatically!)
app.post('/admin/add', upload.single('apkFile'), (req, res) => {
  const { name, description, version, iconUrl } = req.body;
  const apkSize = req.file ? formatBytes(req.file.size) : "10 MB";
  const apkUrl = req.file ? `/uploads/${req.file.filename}` : "";

  apps.push({
    id: Date.now().toString(),
    name,
    description,
    version,
    size: apkSize,
    downloadsCount: "0",
    iconUrl,
    apkUrl,
    screenshots: []
  });

  res.send(`<script>alert('App published successfully with real size: ${apkSize} 🎉'); window.location.href='/admin';</script>`);
});

// ✏️ 4. Edit App
app.post('/admin/edit/:id', upload.single('apkFile'), (req, res) => {
  const { id } = req.params;
  const index = apps.findIndex(a => a.id === id);

  if (index !== -1) {
    const { name, description, version, iconUrl } = req.body;
    apps[index].name = name || apps[index].name;
    apps[index].description = description || apps[index].description;
    apps[index].version = version || apps[index].version;
    apps[index].iconUrl = iconUrl || apps[index].iconUrl;

    if (req.file) {
      apps[index].size = formatBytes(req.file.size);
      apps[index].apkUrl = `/uploads/${req.file.filename}`;
    }
  }

  res.send(`<script>alert('App updated successfully! 🔄'); window.location.href='/admin';</script>`);
});

// 🗑️ 5. Delete App
app.post('/admin/delete/:id', (req, res) => {
  apps = apps.filter(a => a.id !== req.params.id);
  res.send(`<script>alert('App deleted! 🗑️'); window.location.href='/admin';</script>`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));