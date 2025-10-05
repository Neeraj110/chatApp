import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

connectDb();

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
  maxHttpBufferSize: 100 * 1024 * 1024, // 100MB
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const connectedUsers: Map<string, Socket> = new Map();

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("user-join", (userId: string) => {
    console.log(`User ${userId} joined with socket ${socket.id}`);
    connectedUsers.set(userId, socket);
    io.emit("onlineUsers", Array.from(connectedUsers.keys()));
    socket.join(userId);
  });

  socket.on("joinConversation", (conversationId: string) => {
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    socket.join(conversationId);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers.forEach((s, userId) => {
      if (s.id === socket.id) {
        connectedUsers.delete(userId);
        console.log(`Removed user ${userId} from connected users`);
        io.emit("onlineUsers", Array.from(connectedUsers.keys()));
      }
    });
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else if (process.env.NODE_ENV === "development") {
  app.get("/", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Chat API is running with TypeScript!",
      timestamp: new Date().toISOString(),
    });
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

export { io, app, server };
