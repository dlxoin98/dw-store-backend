const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 Apps Database with Full Metadata (Screenshots, Size, Downloads, Description)
let apps = [
  {
    id: "1710000000000",
    name: "DW Network Pro",
    description: "ئەپلیکەیشنا پشکنین و کۆنتڕۆڵکرنا خێرایا اینتەرنێتێ ب شێوەیەکێ دەمەکی و ل نۆتیفیکەیشنان.",
    version: "1.1.0",
    size: "15.4 MB",
    downloadsCount: "2.5K",
    iconUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp",
    apkUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563247-app-debug.apk",
    screenshots: [
      "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp",
      "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp"
    ]
  }
];

// 📲 1. Android API Endpoint
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

// 🛠️ 2. API - Add App via JSON
app.post('/api/apps', (req, res) => {
  const screenshotsArray = typeof req.body.screenshots === 'string' 
    ? req.body.screenshots.split(',').map(s => s.trim()).filter(s => s) 
    : (req.body.screenshots || []);

  const newApp = {
    id: Date.now().toString(),
    name: req.body.name || "Untitled App",
    description: req.body.description || "",
    version: req.body.version || "1.0.0",
    size: req.body.size || "10 MB",
    downloadsCount: req.body.downloadsCount || "0",
    iconUrl: req.body.iconUrl || "",
    apkUrl: req.body.apkUrl || "",
    screenshots: screenshotsArray
  };
  apps.push(newApp);
  res.status(201).json({ message: "App added successfully! 🎉", app: newApp });
});

// 🗑️ 3. API - Delete App by ID
app.delete('/api/apps/:id', (req, res) => {
  const { id } = req.params;
  apps = apps.filter(a => a.id !== id);
  res.json({ message: "App deleted successfully! 🗑️" });
});

// 🌐 4. Premium Admin Panel UI
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DW Store - Developer Portal</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            body { background-color: #0f172a; color: #f8fafc; padding: 30px; }
            .container { max-width: 1000px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
            .header h1 { font-size: 28px; color: #38bdf8; font-weight: 700; }
            .badge { background: #0369a1; color: #e0f2fe; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
            
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }

            .card { background: #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); border: 1px solid #334155; }
            .card h2 { font-size: 18px; color: #f1f5f9; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

            .form-group { margin-bottom: 16px; }
            label { display: block; font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 6px; }
            input, textarea { width: 100%; padding: 12px 14px; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 8px; font-size: 14px; transition: all 0.2s; }
            input:focus, textarea:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15); }
            
            .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

            .btn-primary { width: 100%; background: #0284c7; color: white; border: none; padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; margin-top: 10px; }
            .btn-primary:hover { background: #0369a1; transform: translateY(-1px); }

            .app-list { display: flex; flex-direction: column; gap: 14px; max-height: 650px; overflow-y: auto; padding-right: 4px; }
            .app-item { display: flex; align-items: flex-start; justify-content: space-between; background: #0f172a; padding: 16px; border-radius: 12px; border: 1px solid #334155; }
            .app-details { display: flex; gap: 14px; }
            .app-icon { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; background: #1e293b; border: 1px solid #334155; }
            .app-title { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 4px; }
            .app-meta { font-size: 12px; color: #38bdf8; font-weight: 500; margin-bottom: 6px; }
            .app-desc { font-size: 13px; color: #64748b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

            .screenshot-previews { display: flex; gap: 6px; margin-top: 8px; }
            .ss-thumb { width: 32px; height: 50px; border-radius: 4px; object-fit: cover; border: 1px solid #334155; }

            .btn-danger { background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
            .btn-danger:hover { background: #dc2626; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DW Store Portal 🚀</h1>
                <span class="badge">Live Production</span>
            </div>

            <div class="grid">
                <!-- Add New App Card -->
                <div class="card">
                    <h2>✨ Publish New App</h2>
                    <form action="/admin/add" method="POST">
                        <div class="form-group">
                            <label>App Name</label>
                            <input type="text" name="name" placeholder="e.g. DW Network Pro" required>
                        </div>
                        
                        <div class="row-2">
                            <div class="form-group">
                                <label>Version</label>
                                <input type="text" name="version" placeholder="1.0.0" required>
                            </div>
                            <div class="form-group">
                                <label>Size</label>
                                <input type="text" name="size" placeholder="15 MB" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Downloads Count</label>
                            <input type="text" name="downloadsCount" placeholder="e.g. 5.2K" required>
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" rows="3" placeholder="Detailed app description..." required></textarea>
                        </div>

                        <div class="form-group">
                            <label>App Icon URL</label>
                            <input type="text" name="iconUrl" placeholder="https://raw.github.../icon.png" required>
                        </div>

                        <div class="form-group">
                            <label>APK File URL</label>
                            <input type="text" name="apkUrl" placeholder="https://raw.github.../app.apk" required>
                        </div>

                        <div class="form-group">
                            <label>Screenshots URLs (comma separated)</label>
                            <input type="text" name="screenshots" placeholder="https://url1.png, https://url2.png" required>
                        </div>

                        <button type="submit" class="btn-primary">Publish to Store 🚀</button>
                    </form>
                </div>

                <!-- Existing Apps List Card -->
                <div class="card">
                    <h2>📱 Managed Apps (${apps.length})</h2>
                    <div class="app-list">
                        ${apps.length === 0 ? '<p style="color:#64748b; text-align:center;">No apps published yet.</p>' : ''}
                        ${apps.map(app => `
                            <div class="app-item">
                                <div class="app-details">
                                    <img src="${app.iconUrl}" class="app-icon" onerror="this.src='https://via.placeholder.com/56';">
                                    <div>
                                        <div class="app-title">${app.name}</div>
                                        <div class="app-meta">v${app.version} • ${app.size} • ${app.downloadsCount} downloads</div>
                                        <div class="app-desc">${app.description}</div>
                                        ${app.screenshots && app.screenshots.length > 0 ? `
                                            <div class="screenshot-previews">
                                                ${app.screenshots.map(ss => `<img src="${ss}" class="ss-thumb" onerror="this.style.display='none';">`).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <form action="/admin/delete/${app.id}" method="POST" onsubmit="return confirm('Delete this app?');">
                                    <button type="submit" class="btn-danger">Delete</button>
                                </form>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// ➕ Form Handler: Add App with Full Metadata
app.post('/admin/add', (req, res) => {
  const { name, description, version, size, downloadsCount, iconUrl, apkUrl, screenshots } = req.body;
  
  const screenshotsArray = typeof screenshots === 'string'
    ? screenshots.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  apps.push({
    id: Date.now().toString(),
    name,
    description,
    version: version || "1.0.0",
    size: size || "10 MB",
    downloadsCount: downloadsCount || "1K",
    iconUrl,
    apkUrl,
    screenshots: screenshotsArray
  });

  res.send(`<script>alert('App successfully published to DW Store! 🎉'); window.location.href='/admin';</script>`);
});

// 🗑️ Form Handler: Delete App
app.post('/admin/delete/:id', (req, res) => {
  const { id } = req.params;
  apps = apps.filter(a => a.id !== id);
  res.send(`<script>alert('App deleted! 🗑️'); window.location.href='/admin';</script>`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));