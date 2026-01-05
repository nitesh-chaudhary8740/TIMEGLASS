import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/admin.model.js'; // Ensure this path is correct

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we are hitting the .env in the root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seed = async () => {
  try {
    const dbUri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    if (!dbUri) throw new Error("MONGO_URI is missing from .env");

    // Connect to the database
    await mongoose.connect(`${dbUri}/${dbName}`);
    console.log("Connected to MongoDB for seeding...");

    // Check if an admin already exists to avoid duplicate seeding
    const adminExists = await Admin.findOne({ role: 'SUPER_ADMIN' });
    if (adminExists) {
      console.log("⚠️  Super Admin already exists. Skipping seed.");
      process.exit(0);
    }

    // Hash the secure password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    // Create the Super Admin
    await Admin.create({
      username: "superadmin",
      email: "admin@service.com",
      password: hashedPassword,
      role: "SUPER_ADMIN"
    });

    console.log("✅ SUCCESS: First Admin (SUPER_ADMIN) created!");
    console.log("Email: admin@service.com | Password: Admin@123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ ERROR: Seeding failed ->", error.message);
    process.exit(1);
  }
};

seed();