# 📤 How to Upload to GitHub

Follow these steps to get your Yuki Pet app on GitHub.

## Step 1: Create GitHub Account

1. Go to **github.com**
2. Sign up (free)
3. Verify email

## Step 2: Create New Repository

1. Click **+** (top right) → **New repository**
2. Name: `yuki-pet`
3. Description: `Interactive AI Pet App`
4. Choose **Public** (so people can download your APK)
5. Check **Add a README file**
6. Click **Create repository**

## Step 3: Set Up Git Locally (Or in Termux)

### On Windows/Mac/Linux:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global init.defaultBranch main
```

### On Termux:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Step 4: Upload Files

### Option A: Using Git (Recommended)

```bash
# Navigate to your project folder
cd /path/to/yuki-pet

# Initialize git (if not already done)
git init

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/yuki-pet.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Yuki Pet AI App"

# Push to GitHub
git push -u origin main
```

### Option B: Using GitHub Web UI (Easiest)

1. Go to your repo on GitHub
2. Click **Add file** → **Upload files**
3. Select all files from the `yuki-pet` folder
4. Click **Commit changes**

## Step 5: Check GitHub Actions

1. Go to your repo
2. Click **Actions** tab
3. Wait for workflow to complete (5-15 minutes)
4. Check for **green checkmark** ✅

## Step 6: Download APK

1. Go to your repo
2. Click **Releases** (right side)
3. Download `yuki-pet.apk`
4. Transfer to phone
5. Install & enjoy! 🎉

---

## Workflow Summary

```
Local Code  →  git push  →  GitHub Repo  →  GitHub Actions  →  APK Built
(your computer)          (cloud storage)   (auto-build)       (download here)
```

---

## Updating Your App

Make changes, then:

```bash
git add .
git commit -m "Update: added new feature"
git push
```

APK rebuilds automatically! ✨

---

## Troubleshooting

### "Authentication failed"

Generate Personal Access Token:
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (no expiration)
3. Copy token
4. When prompted for password, paste token

### "Can't push"

```bash
git remote -v  # Check connection
git remote set-url origin https://github.com/YOUR_USERNAME/yuki-pet.git
```

### "Actions not running"

Workflow files might be in wrong location:
- Correct: `.github/workflows/build-apk.yml`
- Re-check file path

---

**Done!** Your APK builds automatically on every push. 🚀
