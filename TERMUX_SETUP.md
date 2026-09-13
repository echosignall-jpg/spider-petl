# 🐾 Yuki Pet - Termux Setup Guide

This guide explains how to use Termux to manage and develop the Yuki Pet app.

## Important Note

**Building APKs directly in Termux is NOT recommended** due to:
- Limited storage space (~1GB typical)
- ARM architecture constraints
- Long build times (30+ min)
- High memory usage

**Instead:** Use **GitHub Actions** (automatic, cloud-based) to build APKs for you!

---

## What Termux CAN Do

1. ✅ Clone the repository
2. ✅ Manage project files
3. ✅ Install/update dependencies
4. ✅ Run tests
5. ✅ Preview in development mode
6. ✅ Push changes to GitHub

---

## Setup in Termux (Code Management)

### 1. Install Requirements

```bash
pkg update
pkg upgrade
pkg install nodejs git
npm install -g react-native-cli
```

### 2. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/yuki-pet.git
cd yuki-pet
npm install
```

### 3. Check for Updates

```bash
git pull origin main
npm install
```

### 4. Make Changes

Edit files as needed, then push to GitHub:

```bash
git add .
git commit -m "Your message"
git push origin main
```

GitHub Actions automatically builds the APK → check Releases tab!

---

## APK Building (Optional - For Advanced Users)

If you **really** want to build in Termux:

### Prerequisites (Takes 2-4GB)

```bash
pkg install android-tools android-sdk-build-tools gradle java-17
```

### Increase Termux Storage

Termux needs more space. Run once:

```bash
termux-setup-storage
```

### Build APK

```bash
cd yuki-pet/android
chmod +x gradlew
./gradlew assembleRelease
```

**Wait time:** 30-60 minutes (slow on phones)

**Output:** `app/build/outputs/apk/release/app-release.apk`

---

## Recommended Workflow

```
You (Termux)        →  GitHub Repo  →  GitHub Actions  →  APK Built
  git push              stores code      builds in cloud      downloads
```

1. Make changes in Termux
2. Push to GitHub (`git push`)
3. Check GitHub **Actions** tab (builds automatically)
4. Download APK from **Releases** tab

---

## Troubleshooting

### "npm command not found"
```bash
pkg install nodejs
```

### "git permission denied"
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

### "Out of space"
```bash
# Check storage
du -sh *

# Clean npm cache
npm cache clean --force

# Remove node_modules (reinstall later)
rm -rf node_modules
```

### Build fails
1. Update everything: `pkg upgrade`
2. Clear cache: `npm cache clean --force`
3. Reinstall: `npm install`
4. Try again

---

## Key GitHub Actions Steps

When you `git push`:

1. GitHub Actions starts automatically
2. Installs Java & Android SDK (cloud)
3. Builds APK in 10-15 minutes
4. Uploads to Releases
5. Email notification (optional)

**No Termux build needed!**

---

## File Structure in Termux

```
~/yuki-pet/
├── app.js (Main code)
├── package.json
├── android/ (Build config)
├── .github/workflows/ (Auto-build settings)
└── README.md
```

Edit any `.js` or `.json` file directly:

```bash
nano app.js    # Edit main app
nano package.json  # Edit dependencies
```

---

## Next Steps

1. ✅ Clone repo in Termux
2. ✅ Make your changes
3. ✅ Push to GitHub
4. ✅ Wait for GitHub Actions
5. ✅ Download APK from Releases

**That's it!** No need to build locally.

---

Questions? Create an Issue on GitHub!
