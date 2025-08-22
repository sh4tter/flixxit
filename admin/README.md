# Flixxit Admin Panel

A separate Vite React application for managing Flixxit content.

## Features

- 🔐 Secure admin authentication
- 🎬 Movie management (add, edit, delete)
- 📋 List management (create, organize, delete)
- ☁️ Cloudinary integration for media uploads
- 🎨 Modern, responsive UI
- 🔥 Top 10 list support

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_API_KEY=your-api-key
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the admin panel:**
   Open [http://localhost:5173](http://localhost:5173)

## Usage

1. **Login:** Use your admin credentials to access the panel
2. **Add Movies:** Upload images, videos, and fill in movie details
3. **Create Lists:** Organize movies into lists with custom ordering
4. **Manage Content:** Edit or delete existing content

## API Integration

The admin panel connects to the main Flixxit backend API at `http://localhost:8800/api`.

## Security

- Only users with `isAdmin: true` can access the panel
- JWT token authentication
- Automatic token validation and refresh

## Development

- **Framework:** React 18 + Vite
- **Styling:** SCSS with modern CSS features
- **State Management:** React Context API
- **HTTP Client:** Axios with interceptors
- **Routing:** React Router v6
