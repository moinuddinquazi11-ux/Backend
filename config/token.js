import jwt from "jsonwebtoken"

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY || "default_secret_key", { expiresIn: "7d" })
    return token
}

export default generateToken