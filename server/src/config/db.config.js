import mongoose from "mongoose"; 

const connectDB = async () => {
    try {
        // Pass the database name as a separate option
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || 'TIMEGLASS' 
        });

        console.log(`database successfully connected to: ${connectionInstance.connection.host}, ${connectionInstance.connection.db.databaseName}`);
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}  

export default connectDB;