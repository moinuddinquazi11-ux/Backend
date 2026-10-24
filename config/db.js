import mongoose from "mongoose"
import { config } from "./config.js"

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl)
        console.log("✅ Database connected successfully")
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`)
        process.exit(1)
    }
}
