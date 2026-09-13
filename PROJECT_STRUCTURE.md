# 📁 Spider Pet - Complete Project Structure

```
spider-pet/
│
├── 📄 app.js                    ← Main React Native app (Spider AI)
├── 📄 index.js                  ← App entry point
├── 📄 app.json                  ← App config
├── 📄 package.json              ← Dependencies + build scripts
│
├── 📁 android/                  ← Android build files
│   ├── build.gradle            ← Main gradle config
│   ├── settings.gradle         ← Project settings
│   ├── gradle/
│   │   └── wrapper/
│   │       └── gradle-wrapper.properties
│   └── app/
│       ├── build.gradle        ← App-specific gradle config
│       ├── proguard-rules.pro  ← Code optimization
│       └── src/
│           └── main/
│               ├── AndroidManifest.xml
│               ├── java/
│               │   └── com/spiderpet/
│               │       └── MainActivity.java
│               └── res/
│                   └── drawable/
│
├── 📁 .github/
│   └── workflows/
│       └── build-apk.yml        ← GitHub Actions auto-builder
│
├── 📁 node_modules/             ← npm packages (auto-generated)
│
├── 📄 .gitignore               ← Git ignore file
├── 📄 README.md                ← Project overview
├── 📄 QUICKSTART.md            ← 5-min setup guide
├── 📄 GROQ_API_SETUP.md        ← API key setup
├── 📄 BUILD_APK.md             ← APK building guide
├── 📄 PROJECT_STRUCTURE.md     ← This file
│
└── 📄 WHATS_NEW.md             ← Feature changelog
```

## Key Files Explained

### Core App
- **app.js** - React Native main component
  - Spider pet animation
  - Chat interface
  - Groq API integration
  - Relationship system
  - Settings/API key management

- **index.js** - Entry point that registers the app
- **app.json** - App metadata (name, version, etc.)
- **package.json** - Node dependencies and scripts

### Android Build
- **android/build.gradle** - Project-wide gradle config
- **android/app/build.gradle** - App-specific config
- **android/app/src/main/AndroidManifest.xml** - App permissions & activities
- **.github/workflows/build-apk.yml** - GitHub Actions automation

### Documentation
- **README.md** - What is Spider Pet?
- **QUICKSTART.md** - Get it running in 5 min
- **GROQ_API_SETUP.md** - Free API setup
- **BUILD_APK.md** - How to build APK (3 methods)
- **PROJECT_STRUCTURE.md** - This file

## Workflow

```
Development
    ↓
Upload to GitHub (push)
    ↓
GitHub Actions triggers
    ↓
Gradle builds APK (10-15 min)
    ↓
APK uploaded to Releases
    ↓
Download to phone
    ↓
Install APK
    ↓
Add Groq API key
    ↓
Start chatting! 🕷️
```

## File Sizes

| Component | Size |
|-----------|------|
| Node modules | ~400MB (dev only) |
| Built APK | 50-80MB |
| Source code | ~500KB |

## What's What?

**To modify:**
- `app.js` - Change Spider behavior, UI, features

**To configure:**
- `package.json` - Add/remove packages
- `android/build.gradle` - Android settings
- `app.json` - App metadata

**To build:**
- `.github/workflows/build-apk.yml` - GitHub Actions
- `android/` - Gradle build system

**To understand:**
- `README.md` - What it does
- `QUICKSTART.md` - How to use it
- `BUILD_APK.md` - How to build it

---

**Total lines of code:** ~500 (app.js main component)
**Dependencies:** React, React Native, AsyncStorage
**API:** Free Groq (no payments)
**License:** MIT (free to use/modify)
