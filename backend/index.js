import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

const allowedOrigins = [
	'http://localhost:3000',
	'https://project-managemen-tool.vercel.app'
  ];
  
  app.use(cors({
	origin: function (origin, callback) {
	  // allow requests with no origin (like mobile apps or curl)
	  if (!origin) return callback(null, true);
	  if (allowedOrigins.includes(origin)) {
		return callback(null, true);
	  } else {
		return callback(new Error('Not allowed by CORS'));
	  }
	},
	methods: "GET,POST,PUT,DELETE,OPTIONS",
	credentials: true
  }));

  
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// connection to MongoDB
app.listen(PORT, "0.0.0.0", () => {
	connectDB();
  }).on('error', (err) => {
	process.exit(1); 
  });

export default app;
