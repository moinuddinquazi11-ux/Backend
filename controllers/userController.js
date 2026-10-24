import userModel from "../models/user_model.js"
import redis from "../config/redis.js"

export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, age, passWord } = req.body

        const user = await userModel.create({
            firstName,
            lastName,
            email,
            age,
            passWord
        })

        // Clear the "all users" cache
        await redis.del("user:all")
        console.log("✅ All users cache cleared")

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const cached = await redis.get("user:all")
        if (cached) {
            console.log("✅ Users retrieved from cache")
            const parsedUsers = JSON.parse(cached)
            return res.status(200).json({
                success: true,
                count: parsedUsers.length,
                data: parsedUsers,
                cached: true
            })
        }

        const users = await userModel.find()
        await redis.setex("user:all", 3600, JSON.stringify(users))
        console.log("✅ Users cached in Redis")

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
            cached: false
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const cacheKey = `user:${req.params.id}`

        // Try to get from Redis cache first
        const cachedUser = await redis.get(cacheKey)
        if (cachedUser) {
            console.log("✅ User retrieved from cache")
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedUser),
                cached: true
            })
        }

        // If not in cache, get from database
        const user = await userModel.findById(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Cache the user data for 1 hour (3600 seconds)
        await redis.setex(cacheKey, 3600, JSON.stringify(user))
        console.log("✅ User cached in Redis")

        res.status(200).json({
            success: true,
            data: user,
            cached: false
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Update cache with new data
        const cacheKey = `user:${req.params.id}`
        await redis.setex(cacheKey, 3600, JSON.stringify(user))
        console.log("✅ User cache updated")

        // Clear the "all users" cache
        await redis.del("user:all")
        console.log("✅ All users cache cleared")

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Remove from cache
        const cacheKey = `user:${req.params.id}`
        await redis.del(cacheKey)
        console.log("✅ User removed from cache")

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: {}
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
