// Assuming you have required mongoose
const mongoose = require("mongoose");
require("dotenv").config();

// MongoDB connection string from environment variable
const connectionString = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.dr5fib0.mongodb.net/auction";

// Validate MongoDB URI is configured
if (!process.env.MONGODB_URI) {
  console.warn("⚠️  MONGODB_URI not found in environment variables, using default MongoDB Atlas cluster");
}

// Connect to MongoDB with optimized connection pooling
mongoose.connect(connectionString, {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2,  // Maintain minimum 2 connections for better performance
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  // bufferMaxEntries: 0, // Removed - deprecated option
  bufferCommands: false, // Disable mongoose buffering
  heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
  retryWrites: true, // Enable retry writes for better reliability
  retryReads: true   // Enable retry reads for better reliability
});

// Event handlers for connection monitoring
mongoose.connection.on("connected", () => {
	console.log("🚀 Connected to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
	console.error("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
	console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
	console.log("🔄 MongoDB reconnected successfully");
});

// Graceful shutdown
process.on('SIGINT', async () => {
	await mongoose.connection.close();
	console.log('🛑 MongoDB connection closed due to app termination');
	process.exit(0);
});

require("../user_components/models/user.model");

require("../chat/models/message.model");
require("../chat/models/conversation.model");

require("../auction_component/models/bid.model");
require("../auction_component/models/category.model");
require("../auction_component/models/order.model");
