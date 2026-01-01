import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/model.admin.js';


// --- ES6 Fix for __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Point to .env in the ROOT (2 levels up from src/scripts) ---
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seed = async () => {
  try {
    // Debug: Check if URI is actually loading
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your .env path!");
    }

    await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log("Connected to MongoDB...");

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log("Admin already exists. No need to seed.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await Admin.create({
      username: "superadmin",
      email: "admin@service.com",
      password: hashedPassword,
      role: "SUPER_ADMIN"
    });

    console.log("✅ First Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();