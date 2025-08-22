# Flixxit Client - Vite React App

This project has been migrated from Create React App (CRA) to Vite for better performance and faster development experience.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔧 Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
VITE_BASE_URL=http://localhost:8800/api
VITE_APP_KEY=your-firebase-api-key-here
```

## 📁 Project Structure

- `src/` - Source code
- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/authContext/` - Authentication context
- `src/axiosInstance.js` - Axios configuration
- `vite.config.js` - Vite configuration

## 🔄 Migration Changes

### From CRA to Vite:
- ✅ Removed `react-scripts` dependency
- ✅ Added `vite` and `@vitejs/plugin-react`
- ✅ Updated environment variables from `REACT_APP_` to `VITE_`
- ✅ Moved `index.html` to root directory
- ✅ Updated entry point to `index.jsx`
- ✅ Configured proxy for API calls
- ✅ Removed CRA-specific files (setupTests.js, reportWebVitals.js, etc.)

### Key Benefits:
- ⚡ Faster development server startup
- 🔥 Hot Module Replacement (HMR)
- 📦 Optimized build process
- 🎯 Better tree-shaking
- 🛠️ Modern tooling

## 🐛 Troubleshooting

If you encounter any issues:

1. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check environment variables:**
   Make sure all `VITE_` prefixed variables are set correctly.

3. **Verify API proxy:**
   The backend should be running on `http://localhost:8800` for the proxy to work.

## 📝 Notes

- The app now uses Vite's `import.meta.env` instead of `process.env`
- Static assets should be placed in the `public/` directory
- The development server runs on port 3000 by default
