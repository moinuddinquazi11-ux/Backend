import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

redis.on("connect", () => {
    console.log("✅ Redis connected successfully")
})

redis.on("error", (error) => {
    console.log(`❌ Redis connection error: ${error.message}`)
})

export default redis
