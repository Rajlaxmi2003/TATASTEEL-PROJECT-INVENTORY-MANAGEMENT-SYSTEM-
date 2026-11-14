const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.join(__dirname, "..", "backend", ".env"),
  });
}

const authRoutes = require("../backend/routes/authRoutes");
const materialRoutes = require("../backend/routes/materialRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || null;

mongoose.set("strictQuery", false);

if (!global.__MONGOOSE) {
  global.__MONGOOSE = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (!MONGO_URL) {
    throw new Error(
      "Missing MONGO_URL environment variable. Set it in Vercel Environment Variables."
    );
  }

  if (global.__MONGOOSE.conn) {
    return global.__MONGOOSE.conn;
  }

  if (!global.__MONGOOSE.promise) {
    global.__MONGOOSE.promise = mongoose
      .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        global.__MONGOOSE.conn = mongooseInstance;
        return mongooseInstance;
      });
  }

  return global.__MONGOOSE.promise;
}

async function ensureConnected(req, res, next) {
  try {
    await connectToDatabase();
    return next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Please check MONGO_URL.",
      error: error.message,
    });
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", ensureConnected);
app.use("/api", authRoutes);
app.use("/api", materialRoutes);


module.exports = app;
