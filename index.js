import express from "express"
import { connectDB } from "./config/db.js"
import { config } from "./config/config.js"
import authRouter from "./routes/auth.route.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the API",
        version: "1.0.0"
    })
})

app.use("/api/auth", authRouter)
app.use("/api/user", userRoutes)

const startServer = async () => {
    try {
        await connectDB()
        app.listen(config.port, () => {
            console.log(`🚀 Server is running on port ${config.port}`)
        })
    } catch (error) {
        console.log(`❌ Failed to start server: ${error.message}`)
        process.exit(1)
    }
}

startServer()
