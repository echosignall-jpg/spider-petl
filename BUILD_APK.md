# 🔨 How to Build & Get Your Spider Pet APK

## Option 1: GitHub Actions (EASIEST - Recommended!)

### Step 1: Create GitHub Account
1. Go to https://github.com
2. Click "Sign up"
3. Enter email, password, username
4. Verify email
5. Done!

### Step 2: Create Repository
1. Log into GitHub
2. Click **+** (top right) → **New repository**
3. Name: `spider-pet`
4. Description: `Free AI Pet`
5. Click **Create repository**

### Step 3: Upload Files
1. In your new repo, click **Add file** → **Upload files**
2. Drag & drop all files from `/home/claude/PetAI/`
3. Make sure to include:
   - ✅ app.js
   - ✅ index.js
   - ✅ app.json
   - ✅ package.json
   - ✅ .github/ (folder with workflows)
   - ✅ android/ (folder)
   - ✅ .gitignore
   - ✅ README.md
4. Click **Commit changes**

### Step 4: Wait for GitHub Actions
1. Click **Actions** tab
2. Watch for **"Build APK"** workflow
3. It takes 10-15 minutes
4. When done (green checkmark), click the workflow
5. Scroll down to **Artifacts** section
6. Click download icon next to `app-release-apk.zip`
7. Extract ZIP to get APK

### Step 5: Install on Phone
1. Transfer APK to your phone
2. Open File Manager
3. Find the APK
4. If it says "Unknown source", go to:
   - Settings → Security → Unknown Sources → Toggle ON
5. Tap APK → Install
6. Launch app!

---

## Option 2: Build on Computer (Windows/Mac/Linux)

### Requirements
- Node.js (nodejs.org)
- Java JDK 11+ (oracle.com)
- Android SDK
- Gradle

### Steps
```bash
# 1. Clone repo
git clone https://github.com/YOUR_USERNAME/spider-pet.git
cd spider-pet

# 2. Install dependencies
npm install

# 3. Build APK
cd android
chmod +x gradlew
./gradlew assembleRelease

# 4. Find APK
# android/app/build/outputs/apk/release/app-release.apk
```

---

## Option 3: Build on Termux (Advanced)

### Requirements
```bash
pkg install nodejs openjdk-17 gradle git
```

### Steps
```bash
cd /home/claude/PetAI
npm install
cd android
chmod +x gradlew
./gradlew assembleRelease
```

### Note
This may take 20-30 minutes on Termux. GitHub Actions is faster!

---

## Troubleshooting

**"GitHub Actions failed?"**
- Check all files uploaded
- Make sure `.github/workflows/build-apk.yml` exists
- Try pushing again

**"APK won't install?"**
- Enable Unknown Sources in Security settings
- Try uninstalling old version first
- Check Android version (needs 5.1+)

**"APK is too large?"**
- Normal size: 50-80MB
- Can reduce with ProGuard minification

**"App crashes on launch?"**
- Make sure you have internet
- Check API key is correct
- Restart phone

---

## Upload APK as Release

Once you have the APK, you can:

1. Go to GitHub repo
2. Click **Releases** (right side)
3. Click **Create new release**
4. Tag: `v1.0.0`
5. Title: `Spider Pet v1.0.0`
6. Upload APK file
7. Publish!

Now others can download it!
