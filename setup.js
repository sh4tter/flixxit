const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Flixxit Netflix Clone...\n');

// Check if .env files exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const clientEnvPath = path.join(__dirname, 'client', '.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('📝 Creating backend .env file...');
  const backendEnvContent = `MONGO_URL=mongodb://localhost:27017/flixxit
SECRET_KEY=your-super-secret-jwt-key-here-change-this-in-production
PORT=8800
NODE_ENV=development`;
  
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Backend .env file created');
} else {
  console.log('✅ Backend .env file already exists');
}

if (!fs.existsSync(clientEnvPath)) {
  console.log('📝 Creating client .env file...');
  const clientEnvContent = `REACT_APP_BASE_URL=http://localhost:8800/api
REACT_APP_NODE_ENV=development`;
  
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('✅ Client .env file created');
} else {
  console.log('✅ Client .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update the SECRET_KEY in backend/.env with a strong secret');
console.log('3. Update MONGO_URL if using a different database');
console.log('4. Run: npm run install-all');
console.log('5. Run: npm run dev');
console.log('\n🎬 Happy coding!');
