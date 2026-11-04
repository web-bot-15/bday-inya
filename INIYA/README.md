# 🎀 A Little World Called Iniya
*A birthday gift website made with love by Rokith*

---

## 🌐 Deploy to GitHub Pages (step by step)

> **No coding experience needed!** Just follow these steps.

### Step 1 — Create a GitHub account
If you don't have one, sign up at [github.com](https://github.com).

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it something like `iniya-birthday`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload the files
**Option A — Via GitHub website (easiest):**
1. Inside the new repo page, click **uploading an existing file**
2. Drag and drop **all the files and folders** from this project
3. Click **Commit changes**

**Option B — Via Git (if you have Git installed):**
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iniya-birthday.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** (top bar)
2. Scroll to **Pages** (left sidebar)
3. Under **Build and deployment**, set:
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)**
4. Click **Save**

### Step 5 — Wait ~1 minute, then visit
```
https://YOUR_USERNAME.github.io/iniya-birthday/
```

> Changes you push will appear after about 1 minute.

---

## 🖼️ Adding Photos

Place your photos in the `assets/photos/` folder:
- `photo1.jpg` → `photo8.jpg`
- Resize them to **≤ 1200px wide** for best performance
- If a photo is missing, a cute placeholder shows instead

---

## 🎵 Adding the Song

Place your MP3 in `assets/audio/`:
- Filename must be **`song.mp3`**
- Keep it under ~5 MB for fast loading
- If missing, the cassette player shows "add your song" tooltip

---

## ✏️ Editing All Content

**Everything editable is in `js/config.js`:**

| Thing to change | Where in config.js |
|---|---|
| Secret code (password) | `PASSCODE: "5129"` |
| Password hint | `PASSCODE_HINT` |
| Birthday note | `birthdayNote` |
| Photo captions | `photos[].caption` |
| Song file / title | `SONG` |
| Letter text | `LETTER` |
| Mochi's dialogue | `puppyLines` |
| Arcade gifts | `GIFTS` |

---

## 🧪 Testing Locally

No server needed — just double-click `index.html` in a file manager!

Or, for mic features and audio to work properly, run:
```bash
python3 -m http.server
```
Then open `http://localhost:8000` in your browser.

---

## 🔐 Note on the Password

The password (`5129`) lives in `js/config.js` and is visible in the page source.
This is **cute-level protection** — perfect for a birthday surprise link.
Anyone who opens the page source could find it. That's totally fine for a gift! 💗

---

*Made with 💗 by Rokith for Iniya's birthday*
