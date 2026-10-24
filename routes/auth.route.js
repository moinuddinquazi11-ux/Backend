import express from "express"
import { logIn, signUp, verifyOtp } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/signUp", signUp)
authRouter.post("/signIn", logIn)
authRouter.post("/verifyOtp", verifyOtp)

export default authRouter