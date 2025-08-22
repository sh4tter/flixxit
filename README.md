# Flixxit - Netflix Clone

A full-stack Netflix clone built with React, Node.js, Express, and MongoDB.

![Logo](https://imgtr.ee/images/2023/08/01/55c9aff1934000bbd2ed37a6308e5956.png)

## Features

- 🔐 User authentication (register/login)
- 🎬 Browse movies and TV series
- 🎥 Watch videos in full screen
- 🎭 Genre-based filtering
- 📱 Responsive design
- 🔒 JWT-based authentication
- 👤 User profile management
- 🎯 Featured content with random selection
- 📋 Content lists with horizontal scrolling

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- Material-UI Icons
- SCSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CryptoJS for password encryption
- CORS for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flixxit
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (root, backend, and frontend)
   npm run install-all
   
   # Or install manually:
   npm install
   cd backend && npm install
   cd ../client && npm install
   ```

3. **Environment Setup**

   Create `.env` file in the `backend` directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/flixxit
   SECRET_KEY=your-super-secret-jwt-key-here
   PORT=8800
   NODE_ENV=development
   ```

   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_BASE_URL=http://localhost:8800/api
   REACT_APP_NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately:
   npm run server  # Backend on port 8800
   npm run client  # Frontend on port 3000
   ```

## Project Structure

```
flixxit/
├── backend/                 # Node.js/Express backend
│   ├── controller/         # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── verifyToken.js     # JWT middleware
├── client/                 # React frontend
│   ├── src/
│   │   ├── authContext/   # Authentication context
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── axiosInstance.js
│   └── public/
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin` - Admin login

### Movies
- `GET /api/movies` - Get all movies (admin only)
- `POST /api/movies` - Create movie (admin only)
- `GET /api/movies/find/:id` - Get movie by ID
- `GET /api/movies/random` - Get random movie/series
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Lists
- `GET /api/lists` - Get all lists
- `POST /api/lists` - Create list (admin only)
- `DELETE /api/lists/:id` - Delete list (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/find/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

## Bug Fixes Applied

### Backend Fixes
- ✅ Added missing `dotenv` dependency
- ✅ Fixed password encryption bug in user update
- ✅ Improved error handling and response consistency
- ✅ Enhanced JWT token verification
- ✅ Added proper CORS configuration
- ✅ Fixed MongoDB connection issues
- ✅ Added input validation for registration

### Frontend Fixes
- ✅ Fixed proxy configuration (localhost instead of Vercel)
- ✅ Added axios interceptors for automatic token handling
- ✅ Improved authentication state management
- ✅ Enhanced error handling in components
- ✅ Fixed route protection logic
- ✅ Added loading states and error messages
- ✅ Improved user experience with better feedback

### Security Fixes
- ✅ Proper password hashing
- ✅ JWT token validation
- ✅ Input sanitization
- ✅ CORS protection
- ✅ Error message sanitization

## Usage

1. **Register/Login**: Create an account or sign in
2. **Browse Content**: Navigate through movies and series
3. **Watch Videos**: Click on any content to watch
4. **Filter by Genre**: Use the genre dropdown to filter content
5. **User Profile**: Access settings and logout from the navbar

## Development

### Adding New Features
1. Create new routes in `backend/routes/`
2. Add controllers in `backend/controller/`
3. Create React components in `client/src/components/`
4. Add pages in `client/src/pages/`

### Database Schema
- **User**: username, email, password, isAdmin, profilePic
- **Movie**: title, desc, img, imgTitle, imgSm, trailer, video, year, limit, genre, isSeries
- **List**: title, type, genre, content

## Deployment

### Backend (Vercel/Heroku)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API URL

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository or contact the maintainers.

---

**Note**: This is a demo project. For production use, ensure proper security measures, environment variables, and database optimization.
