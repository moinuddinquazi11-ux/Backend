import redis from "../config/redis.js"
import generateToken from "../config/token.js"
import userModel from "../models/user_model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const {firstName, lastName, email,age, password} = req.body
        const existUser = await userModel.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exist"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            age,
            passWord: hashedPassword

        })
        const token = generateToken(user._id)
        redis.del("user:all")
        return res.status(201).json({
            user:{
                firstName,
                lastName,
                email,
                age
            },
            accessToken:token
        })

    }catch(error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const logIn = async (req, res) => {
    try {
        const {email, password} = req.body
        const existUser = await userModel.findOne({email})
        if(!existUser){
            return res.status(400).json({message:"User does not exist"})
        }

        let match = await bcrypt.compare(password, existUser.passWord)

        if(!match){
            return res.status(400).json({message:"Incorrect Password"})
        }

         const token = generateToken(existUser._id)
         const otp = await sendOtp(email)
        return res.status(201).json({
            user:{
                firstName:existUser.firstName,
                lastName:existUser.lastName,
                email:existUser.email,
                age:existUser.age
            },
            accessToken:token,
            otp:otp
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
}

const sendOtp = async (email) => {
    const otp = Math.floor(100000+Math.random()*900000).toString()
    await redis.setex(`otp:${email}`, 30, otp)
    console.log(otp)
    return otp
}

export const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body
        const cachedOtp = await redis.get(`otp:${email}`)

        if (!cachedOtp) {
            return res.status(400).json({message:"Otp Expired"})
        }

        if (cachedOtp !== otp) {
            return res.status(400).json({message:"Invalid Otp"})
        }

        // Delete OTP after successful verification
        await redis.del(`otp:${email}`)

        res.status(200).json({message:"Otp Verified Successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}