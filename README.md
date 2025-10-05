# Chat App - Single Server Setup Guide

## 🚀 Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

#### 1. Clone and Install Dependencies
```bash
# Install root dependencies (backend)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat-app
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_key_here
```

#### 3. Run the Application

**Option A: Run Both Together (Recommended)**
```bash
npm run dev
```
This runs:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

#### 4. Access the Application
Open your browser and go to:
- **Frontend**: `http://localhost:5173`
- **API**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/api/health`

## 📂 Project Structure

```
chat-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── index.ts          ← Main server file
├── frontend/
│   ├── src/
│   ├── vite.config.ts    ← Proxy configuration
│   └── package.json
├── .env                   ← Environment variables
├── package.json          ← Root scripts
└── nodemon.json
```

## 🔧 How It Works

### Development Mode
1. **Backend** runs on port `3000` (Express + Socket.IO)
2. **Frontend** runs on port `5173` (Vite dev server)
3. Vite proxies API requests to backend
4. Hot reload works for both frontend and backend

### Production Mode
1. Build frontend: `npm run build:frontend`
2. Backend serves static frontend files
3. Everything runs on single port `3000`
4. Deploy as single application

## 🌐 API Endpoints

- `GET /api/health` - Server health check
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get messages

## 🔌 Socket.IO Events

- `user-join` - User joins with their ID
- `joinConversation` - Join a conversation room
- `onlineUsers` - Broadcast online users
- `disconnect` - Handle user disconnect

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`

### CORS Issues
- Verify `CLIENT_URL` in `.env` matches frontend URL
- Default development: `http://localhost:5173`

### Socket.IO Not Connecting
- Check proxy configuration in `vite.config.ts`
- Verify Socket.IO client connects to correct URL

## 📦 Production Deployment

```bash
# 1. Build frontend
npm run build:frontend

# 2. Set environment to production
NODE_ENV=production

# 3. Start server
npm start
```

Server will serve frontend from `frontend/dist` folder.

## 🔑 Important Files

1. **backend/index.ts** - Main server configuration
2. **frontend/vite.config.ts** - Proxy setup for development
3. **.env** - Environment variables
4. **package.json** - Scripts for running application

## 💡 Tips

- Use `npm run dev` for development (runs both servers)
- Frontend proxies all `/api` requests to backend
- Socket.IO automatically proxied in development
- Production uses single server on port 3000

## 🎯 Next Steps

1. Configure your MongoDB connection
2. Set up Cloudinary for image uploads
3. Add Google OAuth credentials (if needed)
4. Customize JWT secret
5. Start developing!

---

**Need Help?** Check the console logs for detailed error messages.