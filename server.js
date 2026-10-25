const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// لیستا ئەپێن ستۆرا تە
const apps = [
  {
    name: "DW Network Pro",
    description: "ئەپلیکەیشنا پشکنین و کۆنتڕۆڵکرنا خێرایا اینتەرنێتێ",
    version: "1.0.0",
    iconUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/icon.png",
    apkUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/app.apk"
  },
  {
    name: "DW Auto Clicker",
    description: "ئامرازێ کلیککرنا ئۆتۆماتیکی بۆ ئەندرۆید",
    version: "1.2.0",
    iconUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/icon.png",
    apkUrl: "https://raw.githubusercontent.com/dlxoin98/dw-store-backend/main/uploads/app.apk"
  }
];

// ڕێڕەوا وەرگرتنا ئەپان بۆ موبایلێ
app.get('/api/apps', (req, res) => {
  res.json(apps);
});

app.get('/', (req, res) => {
  res.send('DW Store Server is Running Live!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});