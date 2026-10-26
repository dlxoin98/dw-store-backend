const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 Apps Database with Screenshots and Detailed Info
let apps = [
  {
    id: "1710000000000",
    name: "DW Network Pro",
    description: "ئەپلیکەیشنا پشکنین و کۆنتڕۆڵکرنا خێرایا اینتەرنێتێ.",
    additionalInfo: "Requires Android 8.0 and above. Completely ad-free and open-source utility tool for advanced network tracking.",
    version: "1.1.0",
    size: "15.4 MB",
    downloadsCount: "2.5K",
    iconUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp",
    apkUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563247-app-debug.apk",
    screenshots: [
      "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/1792442563239-ic_launcher_foreground.webp"
    ]
  }
];

// 📲 1. Android API
app.get('/api/apps', (req, res) => res.json(apps));

// 🌐 2. Admin Panel UI (Add, Edit, Delete, Photos, Additional Info)
app.get('/admin', (req, res) => {
  const editId = req.query.edit;
  const appToEdit = apps.find(a => a.id === editId);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DW Store Portal</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
            body { background-color: #0f172a; color: #f8fafc; padding: 30px; }
            .container { max-width: 1100px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #1e293b; padding-bottom: 20px; }
            .header h1 { font-size: 28px; color: #38bdf8; font-weight: 700; }
            .badge { background: #0369a1; color: #e0f2fe; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
            .card { background: #1e293b; border-radius: 16px; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); border: 1px solid #334155; }
            .card h2 { font-size: 18px; color: #f1f5f9; margin-bottom: 20px; }
            .form-group { margin-bottom: 16px; }
            label { display: block; font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 6px; }
            input, textarea { width: 100%; padding: 12px 14px; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 8px; font-size: 14px; }
            input:focus, textarea:focus { outline: none; border-color: #38bdf8; }
            .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .btn-primary { width: 100%; background: #0284c7; color: white; border: none; padding: 14px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; margin-top: 10px; }
            .btn-primary:hover { background: #0369a1; }
            .app-list { display: flex; flex-direction: column; gap: 14px; max-height: 700px; overflow-y: auto; }
            .app-item { display: flex; justify-content: space-between; align-items: flex-start; background: #0f172a; padding: 16px; border-radius: 12px; border: 1px solid #334155; }
            .app-details { display: flex; gap: 14px; }
            .app-icon { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; background: #1e293b; border: 1px solid #334155; }
            .btn-danger { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
            .btn-edit { background: #eab308; color: #000; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block; }
            .action-buttons { display: flex; gap: 6px; align-items: center; }
            .ss-preview-container { display: flex; gap: 6px; margin-top: 6px; }
            .ss-thumb { width: 30px; height: 45px; border-radius: 4px; object-fit: cover; border: 1px solid #334155; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DW Store Portal 🚀</h1>
                <span class="badge">Live Production</span>
            </div>

            <div class="grid">
                <!-- Add or Edit Form -->
                <div class="card">
                    <h2>${appToEdit ? '✏️ Edit App: ' + appToEdit.name : '✨ Publish New App'}</h2>
                    <form action="${appToEdit ? '/admin/edit/' + appToEdit.id : '/admin/add'}" method="POST">
                        <div class="form-group">
                            <label>App Name</label>
                            <input type="text" name="name" value="${appToEdit ? appToEdit.name : ''}" required>
                        </div>
                        
                        <div class="row-2">
                            <div class="form-group">
                                <label>Version</label>
                                <input type="text" name="version" value="${appToEdit ? appToEdit.version : '1.0.0'}" required>
                            </div>
                            <div class="form-group">
                                <label>File Size (e.g. 15.4 MB)</label>
                                <input type="text" name="size" value="${appToEdit ? appToEdit.size : '10 MB'}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Downloads Count</label>
                            <input type="text" name="downloadsCount" value="${appToEdit ? appToEdit.downloadsCount : '1K'}" required>
                        </div>

                        <div class="form-group">
                            <label>Short Description</label>
                            <textarea name="description" rows="2" required>${appToEdit ? appToEdit.description : ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label>Additional Information (Bottom Details)</label>
                            <textarea name="additionalInfo" rows="3" placeholder="Requirements, changelogs, or extra notes...">${appToEdit ? (appToEdit.additionalInfo || '') : ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label>App Icon URL</label>
                            <input type="text" name="iconUrl" value="${appToEdit ? appToEdit.iconUrl : ''}" required>
                        </div>

                        <div class="form-group">
                            <label>APK File Direct URL</label>
                            <input type="text" name="apkUrl" value="${appToEdit ? appToEdit.apkUrl : ''}" required>
                        </div>

                        <div class="form-group">
                            <label>Screenshots URLs (comma separated)</label>
                            <input type="text" name="screenshots" value="${appToEdit && appToEdit.screenshots ? appToEdit.screenshots.join(', ') : ''}" placeholder="https://url1.png, https://url2.png">
                        </div>

                        <button type="submit" class="btn-primary">${appToEdit ? 'Update App 🔄' : 'Publish to Store 🚀'}</button>
                        ${appToEdit ? '<br><a href="/admin" style="color:#94a3b8; display:block; text-align:center; margin-top:10px; font-size:13px;">Cancel Edit</a>' : ''}
                    </form>
                </div>

                <!-- Existing Apps List -->
                <div class="card">
                    <h2>📱 Managed Apps (${apps.length})</h2>
                    <div class="app-list">
                        ${apps.length === 0 ? '<p style="color:#64748b; text-align:center;">No apps published yet.</p>' : ''}
                        ${apps.map(app => `
                            <div class="app-item">
                                <div class="app-details">
                                    <img src="${app.iconUrl}" class="app-icon" onerror="this.src='https://via.placeholder.com/50';">
                                    <div>
                                        <div style="font-weight:600; font-size:15px;">${app.name}</div>
                                        <div style="font-size:12px; color:#38bdf8; margin:2px 0;">v${app.version} • ${app.size} • ${app.downloadsCount} downloads</div>
                                        <div style="font-size:12px; color:#64748b; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${app.description}</div>
                                        ${app.screenshots && app.screenshots.length > 0 ? `
                                            <div class="ss-preview-container">
                                                ${app.screenshots.map(s => `<img src="${s}" class="ss-thumb" onerror="this.style.display='none'">`).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="action-buttons">
                                    <a href="/admin?edit=${app.id}" class="btn-edit">Edit</a>
                                    <form action="/admin/delete/${app.id}" method="POST" style="margin:0;" onsubmit="return confirm('Delete app?');">
                                        <button type="submit" class="btn-danger">Delete</button>
                                    </form>
                                </div>
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

// Helper to parse comma-separated screenshots
function parseScreenshots(screenshotsInput) {
  if (!screenshotsInput) return [];
  return typeof screenshotsInput === 'string'
    ? screenshotsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : screenshotsInput;
}

// ➕ Add App Route
app.post('/admin/add', (req, res) => {
  const { name, description, additionalInfo, version, size, downloadsCount, iconUrl, apkUrl, screenshots } = req.body;
  apps.push({
    id: Date.now().toString(),
    name,
    description,
    additionalInfo: additionalInfo || "",
    version,
    size,
    downloadsCount,
    iconUrl,
    apkUrl,
    screenshots: parseScreenshots(screenshots)
  });
  res.send(`<script>alert('App published successfully! 🎉'); window.location.href='/admin';</script>`);
});

// ✏️ Edit App Route
app.post('/admin/edit/:id', (req, res) => {
  const { id } = req.params;
  const index = apps.findIndex(a => a.id === id);
  if (index !== -1) {
    const { name, description, additionalInfo, version, size, downloadsCount, iconUrl, apkUrl, screenshots } = req.body;
    apps[index] = {
      ...apps[index],
      name,
      description,
      additionalInfo: additionalInfo || "",
      version,
      size,
      downloadsCount,
      iconUrl,
      apkUrl,
      screenshots: parseScreenshots(screenshots)
    };
  }
  res.send(`<script>alert('App updated successfully! 🔄'); window.location.href='/admin';</script>`);
});

// 🗑️ Delete App Route
app.post('/admin/delete/:id', (req, res) => {
  apps = apps.filter(a => a.id !== req.params.id);
  res.send(`<script>alert('App deleted! 🗑️'); window.location.href='/admin';</script>`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));